import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { pool } from "../config/database.js";
import {
  iniciarChatbot,
  atenderPerguntaLivre,
} from "../services/chat_service.js";
import {
  criarAgendamento as criarAgendamentoService,
  ErroAgendamento,
} from "../services/agendamento_service.js";

type EtapaCadastro =
  | "aguardando_nome"
  | "aguardando_telefone"
  | "aguardando_cpf";

type EtapaAgendamento =
  | "oferecendo_agendamento"
  | "aguardando_data_agendamento"
  | "aguardando_horario_agendamento"
  | "confirmando_agendamento";

const etapasCadastro: EtapaCadastro[] = [
  "aguardando_nome",
  "aguardando_telefone",
  "aguardando_cpf",
];

const etapasAgendamento: EtapaAgendamento[] = [
  "oferecendo_agendamento",
  "aguardando_data_agendamento",
  "aguardando_horario_agendamento",
  "confirmando_agendamento",
];

const mensagemDadosExistentes =
  "Este usuário já inseriu seus dados! Já podemos prosseguir, digite sua dúvida";

async function salvarMensagem(
  sessaoId: number,
  tipo: "BOT" | "USUARIO",
  mensagem: string,
  etapa: string,
) {
  await pool.query(
    `INSERT INTO mensagens (sessao_id, tipo, mensagem, etapa)
     VALUES ($1, $2, $3, $4)`,
    [sessaoId, tipo, mensagem, etapa],
  );
}

function validarCPF(cpf: string) {
  return cpf.replace(/\D/g, "").length === 11;
}

function normalizarTelefone(telefone: string) {
  let numeros = telefone.replace(/\D/g, "");

  if (
    (numeros.length === 12 || numeros.length === 13) &&
    numeros.startsWith("55")
  ) {
    numeros = numeros.slice(2);
  }

  return numeros;
}

function validarTelefone(telefone: string) {
  return /^[1-9]{2}9?\d{8}$/.test(telefone);
}

async function responderCadastro(
  res: Response,
  sessaoId: number,
  _etapaAnterior: EtapaCadastro,
  resposta: string,
  proximaEtapa: EtapaCadastro,
) {
  await salvarMensagem(sessaoId, "BOT", resposta, proximaEtapa);

  return res.status(200).json({
    resposta,
    tipo: "cadastro",
    etapa: proximaEtapa,
  });
}

async function prosseguirComDadosExistentes(
  res: Response,
  sessaoId: number,
  sessionId: string,
  usuarioId: number | null = null,
) {
  try {
    await pool.query(
      `UPDATE sessoes
       SET usuario_id = COALESCE($2, usuario_id),
           cadastro_nome = NULL,
           cadastro_telefone = NULL,
           pergunta_atual = 'resposta_usuario',
           status = 'ativa',
           finalizada = FALSE,
           fim_sessao = NULL,
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [sessaoId, usuarioId],
    );

    await iniciarChatbot(sessionId);

    const resposta =
      "Seus dados já foram identificados. Digite sua dúvida para continuar o atendimento.";

    await salvarMensagem(
      sessaoId,
      "BOT",
      resposta,
      "resposta_usuario",
    );

    return res.status(200).json({
      sessionId,
      resposta,
      tipo: "cadastro_existente",
      etapa: "resposta_usuario",
    });
  } catch (error) {
    console.error("Erro ao continuar cadastro:", error);

    return res.status(500).json({
      erro: "Não foi possível continuar o atendimento.",
    });
  }
}

function interpretarSimNao(texto: string): boolean | null {
  const resposta = texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  if (/^(sim|s|quero|aceito|claro|pode ser)$/.test(resposta)) {
    return true;
  }

  if (/^(nao|n|agora nao|nao quero|cancelar)$/.test(resposta)) {
    return false;
  }

  return null;
}

function converterData(texto: string): string | null {
  let data = texto.trim();
  const brasileira = data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (brasileira) {
    data = `${brasileira[3]}-${brasileira[2]}-${brasileira[1]}`;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return null;

  const dataObj = new Date(`${data}T00:00:00Z`);

  if (
    Number.isNaN(dataObj.getTime()) ||
    dataObj.toISOString().slice(0, 10) !== data ||
    data < "2026-10-26" ||
    data > "2026-10-30"
  ) {
    return null;
  }

  return data;
}

function converterHorario(texto: string): string | null {
  const match = texto.trim().match(/^(\d{1,2}):([0-5]\d)$/);
  if (!match) return null;

  const horario = `${match[1]!.padStart(2, "0")}:${match[2]!}`;

  if (
    horario < "08:00" ||
    horario > "15:15" ||
    (horario >= "11:45" && horario < "12:00")
  ) {
    return null;
  }

  return horario;
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

function dataDoBanco(valor: unknown): string {
  if (valor instanceof Date) return valor.toISOString().slice(0, 10);
  return String(valor ?? "").slice(0, 10);
}

async function responderAgendamento(
  res: Response,
  sessaoId: number,
  resposta: string,
  etapa: string,
) {
  await pool.query(
    `UPDATE sessoes
     SET pergunta_atual = $2, atualizado_em = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [sessaoId, etapa],
  );

  await salvarMensagem(sessaoId, "BOT", resposta, etapa);

  return res.status(200).json({
    resposta,
    tipo: "agendamento",
    etapa,
    necessitaAgendamento: true,
  });
}

async function processarAgendamento(
  res: Response,
  sessao: any,
  sessaoId: number,
  etapa: EtapaAgendamento,
  texto: string,
) {
  await salvarMensagem(sessaoId, "USUARIO", texto, etapa);

  if (etapa === "oferecendo_agendamento") {
    const escolha = interpretarSimNao(texto);

    if (escolha === null) {
      return responderAgendamento(
        res,
        sessaoId,
        "Deseja solicitar atendimento presencial no PROCON? Responda sim ou não.",
        etapa,
      );
    }

    if (!escolha) {
      return responderAgendamento(
        res,
        sessaoId,
        "Tudo bem. Você pode enviar outra dúvida ou procurar um canal oficial do PROCON.",
        "resposta_usuario",
      );
    }

    if (!sessao.usuario_id) {
      return responderAgendamento(
        res,
        sessaoId,
        "Não consegui identificar seu cadastro. Será necessário concluir a identificação antes de solicitar o atendimento.",
        "resposta_usuario",
      );
    }

    await pool.query(
      `UPDATE sessoes
       SET pergunta_atual = 'aguardando_data_agendamento',
           agendamento_data_temp = NULL,
           agendamento_horario_temp = NULL,
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [sessaoId],
    );

    return responderAgendamento(
      res,
      sessaoId,
      "Qual data você prefere? Escolha entre 26 e 30/10/2026 e informe DD/MM/AAAA.",
      "aguardando_data_agendamento",
    );
  }

  if (etapa === "aguardando_data_agendamento") {
    const data = converterData(texto);

    if (!data) {
      return responderAgendamento(
        res,
        sessaoId,
        "Data inválida. Escolha uma data entre 26 e 30/10/2026 no formato DD/MM/AAAA.",
        etapa,
      );
    }

    await pool.query(
      `UPDATE sessoes
       SET agendamento_data_temp = $2::date,
           agendamento_horario_temp = NULL,
           pergunta_atual = 'aguardando_horario_agendamento',
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [sessaoId, data],
    );

    return responderAgendamento(
      res,
      sessaoId,
      "Qual horário você prefere? O expediente é das 08:00 às 15:15, exceto das 11:45 às 12:00. Informe HH:MM.",
      "aguardando_horario_agendamento",
    );
  }

  if (etapa === "aguardando_horario_agendamento") {
    const horario = converterHorario(texto);

    if (!horario) {
      return responderAgendamento(
        res,
        sessaoId,
        "Horário inválido. Informe um horário entre 08:00 e 15:15, exceto das 11:45 às 12:00.",
        etapa,
      );
    }

    await pool.query(
      `UPDATE sessoes
       SET agendamento_horario_temp = $2::time,
           pergunta_atual = 'confirmando_agendamento',
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [sessaoId, horario],
    );

    const data = dataDoBanco(sessao.agendamento_data_temp);

    return responderAgendamento(
      res,
      sessaoId,
      `Confira sua solicitação:\nData: ${formatarData(data)}\nHorário: ${horario}\n\nDeseja confirmar? Responda sim ou não.`,
      "confirmando_agendamento",
    );
  }

  const escolha = interpretarSimNao(texto);

  if (escolha === null) {
    return responderAgendamento(
      res,
      sessaoId,
      "Deseja confirmar a solicitação? Responda sim ou não.",
      "confirmando_agendamento",
    );
  }

  if (!escolha) {
    await pool.query(
      `UPDATE sessoes
       SET agendamento_data_temp = NULL,
           agendamento_horario_temp = NULL,
           pergunta_atual = 'resposta_usuario',
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [sessaoId],
    );

    return responderAgendamento(
      res,
      sessaoId,
      "Solicitação cancelada. Nenhum agendamento foi criado.",
      "resposta_usuario",
    );
  }

  const data = dataDoBanco(sessao.agendamento_data_temp);
  const horario = String(sessao.agendamento_horario_temp ?? "").slice(0, 5);

  try {
    const agendamento = await criarAgendamentoService({
      usuarioId: Number(sessao.usuario_id),
      sessaoId,
      dataAgendamento: data,
      horario,
    });

    await pool.query(
      `UPDATE sessoes
       SET agendamento_data_temp = NULL,
           agendamento_horario_temp = NULL,
           pergunta_atual = 'resposta_usuario',
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [sessaoId],
    );

    const resposta =
      `Sua solicitação de atendimento foi registrada para ${formatarData(data)} às ${horario}.`;

    await salvarMensagem(sessaoId, "BOT", resposta, "resposta_usuario");

    return res.status(201).json({
      resposta,
      tipo: "agendamento_criado",
      etapa: "resposta_usuario",
      necessitaAgendamento: false,
      agendamento,
    });
  } catch (error) {
    if (error instanceof ErroAgendamento) {
      if (error.statusCode === 409) {
        await pool.query(
          `UPDATE sessoes
           SET agendamento_data_temp = NULL,
               agendamento_horario_temp = NULL,
               pergunta_atual = 'resposta_usuario',
               atualizado_em = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [sessaoId],
        );

        return responderAgendamento(
          res,
          sessaoId,
          "Não foi possível registrar outro atendimento. Verifique se você já possui um agendamento ativo.",
          "resposta_usuario",
        );
      }

      return responderAgendamento(
        res,
        sessaoId,
        error.message,
        "confirmando_agendamento",
      );
    }

    throw error;
  }
}

export async function iniciarConversa(_req: Request, res: Response) {
  try {
    const sessionId = randomUUID();

    const resultado = await pool.query(
      `INSERT INTO sessoes (session_id, usuario_id, status, pergunta_atual)
       VALUES ($1, NULL, 'ativa', 'aguardando_nome')
       RETURNING id, session_id, usuario_id, status, pergunta_atual`,
      [sessionId],
    );

    const sessao = resultado.rows[0];
    const resposta =
      "Olá! Para iniciar seu atendimento no PROCON, qual é o seu nome completo?";

    await salvarMensagem(
      Number(sessao.id),
      "BOT",
      resposta,
      "aguardando_nome",
    );

    return res.status(201).json({
      sessionId,
      resposta,
      tipo: "cadastro",
      etapa: "aguardando_nome",
      sessao,
    });
  } catch (error) {
    console.error("Erro ao iniciar conversa:", error);
    return res.status(500).json({ erro: "Não foi possível iniciar a conversa." });
  }
}

export async function enviarMensagem(req: Request, res: Response) {
  try {
    const { sessionId, mensagem } = req.body;

    if (
      typeof sessionId !== "string" ||
      !sessionId.trim() ||
      typeof mensagem !== "string" ||
      !mensagem.trim()
    ) {
      return res.status(400).json({ erro: "Informe a sessão e uma mensagem válida." });
    }

    const texto = mensagem.trim();

    const consulta = await pool.query(
      `SELECT id, session_id, usuario_id, status, categoria, pergunta_atual,
              cadastro_nome, cadastro_telefone, agendamento_data_temp,
              agendamento_horario_temp
       FROM sessoes WHERE session_id = $1`,
      [sessionId],
    );

    if (!consulta.rows.length) {
      return res.status(404).json({ erro: "Sessão não encontrada." });
    }

    const sessao = consulta.rows[0];
    const sessaoId = Number(sessao.id);
    const etapa = String(sessao.pergunta_atual ?? "");

    if (sessao.status !== "ativa") {
      return res.status(409).json({ erro: "Esta conversa não está ativa." });
    }

    if (etapasAgendamento.includes(etapa as EtapaAgendamento)) {
      return processarAgendamento(
        res,
        sessao,
        sessaoId,
        etapa as EtapaAgendamento,
        texto,
      );
    }

    if (etapasCadastro.includes(etapa as EtapaCadastro)) {
      const etapaCadastro = etapa as EtapaCadastro;

      await salvarMensagem(
        sessaoId,
        "USUARIO",
        etapaCadastro === "aguardando_cpf" ? "CPF informado" : texto,
        etapaCadastro,
      );

      if (etapaCadastro === "aguardando_nome") {
        if (texto.length < 2 || texto.length > 150) {
          return responderCadastro(
            res, sessaoId, etapaCadastro,
            "Informe seu nome completo, com até 150 caracteres.",
            "aguardando_nome",
          );
        }

        const existente = await pool.query(
          `SELECT id FROM usuarios
           WHERE LOWER(BTRIM(nome)) = LOWER(BTRIM($1)) LIMIT 1`,
          [texto],
        );

        const outraSessao = await pool.query(
          `SELECT 1 FROM sessoes
           WHERE id <> $2 AND status = 'ativa'
             AND cadastro_nome IS NOT NULL
             AND LOWER(BTRIM(cadastro_nome)) = LOWER(BTRIM($1))
           LIMIT 1`,
          [texto, sessaoId],
        );

        if (existente.rows.length || outraSessao.rows.length) {
          return prosseguirComDadosExistentes(res, sessaoId, sessionId);
        }

        await pool.query(
          `UPDATE sessoes SET cadastro_nome = $2,
           pergunta_atual = 'aguardando_telefone' WHERE id = $1`,
          [sessaoId, texto],
        );

        return responderCadastro(
          res, sessaoId, etapaCadastro,
          "Obrigado! Agora informe seu telefone com DDD.",
          "aguardando_telefone",
        );
      }

      if (etapaCadastro === "aguardando_telefone") {
        const telefone = normalizarTelefone(texto);

        if (!validarTelefone(telefone)) {
          return responderCadastro(
            res, sessaoId, etapaCadastro,
            "Informe um telefone brasileiro com DDD, por exemplo: 11987654321.",
            "aguardando_telefone",
          );
        }

        const existente = await pool.query(
          "SELECT id FROM usuarios WHERE telefone = $1 LIMIT 1",
          [telefone],
        );

        const outraSessao = await pool.query(
          `SELECT 1 FROM sessoes
           WHERE id <> $2 AND status = 'ativa' AND cadastro_telefone = $1
           LIMIT 1`,
          [telefone, sessaoId],
        );

        if (existente.rows.length || outraSessao.rows.length) {
          return prosseguirComDadosExistentes(
            res,
            sessaoId,
            sessionId,
            existente.rows.length ? Number(existente.rows[0].id) : null,
          );
        }

        await pool.query(
          `UPDATE sessoes SET cadastro_telefone = $2,
           pergunta_atual = 'aguardando_cpf' WHERE id = $1`,
          [sessaoId, telefone],
        );

        return responderCadastro(
          res, sessaoId, etapaCadastro,
          "Agora informe seu CPF, com ou sem pontuação.",
          "aguardando_cpf",
        );
      }

      const cpf = texto.replace(/\D/g, "");

      if (!validarCPF(cpf)) {
        return responderCadastro(
          res, sessaoId, etapaCadastro,
          "Para este teste, informe exatamente 11 dígitos no CPF.",
          "aguardando_cpf",
        );
      }

      const { cadastro_nome: nome, cadastro_telefone: telefone } = sessao;

      if (!nome || !telefone) {
        return res.status(409).json({
          erro: "Dados temporários não encontrados. Inicie uma nova conversa.",
        });
      }

      const existente = await pool.query(
        "SELECT id FROM usuarios WHERE cpf = $1 LIMIT 1",
        [cpf],
      );

      if (existente.rows.length) {
        return prosseguirComDadosExistentes(
          res, sessaoId, sessionId, Number(existente.rows[0].id),
        );
      }

      const porTelefoneOuCpf = await pool.query(
        "SELECT id FROM usuarios WHERE telefone = $1 OR cpf = $2",
        [telefone, cpf],
      );

      if (porTelefoneOuCpf.rows.length) {
        const usuarioId = porTelefoneOuCpf.rows.length === 1
          ? Number(porTelefoneOuCpf.rows[0].id)
          : null;

        return prosseguirComDadosExistentes(res, sessaoId, sessionId, usuarioId);
      }

      const novoUsuario = await pool.query(
        `INSERT INTO usuarios (nome, telefone, cpf)
         VALUES ($1, $2, $3) RETURNING id`,
        [nome, telefone, cpf],
      );

      await pool.query(
        `UPDATE sessoes
         SET usuario_id = $2, cadastro_nome = NULL, cadastro_telefone = NULL,
             categoria = NULL, pergunta_atual = 'resposta_usuario',
             status = 'ativa', finalizada = FALSE, fim_sessao = NULL,
             atualizado_em = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [sessaoId, Number(novoUsuario.rows[0].id)],
      );

      await iniciarChatbot(sessionId);

      const resposta =
        "Cadastro concluído! Escreva sua dúvida com suas próprias palavras para eu procurar uma orientação na base de conhecimento.";

      await salvarMensagem(sessaoId, "BOT", resposta, "resposta_usuario");

      return res.status(200).json({
        sessionId,
        resposta,
        tipo: "cadastro_concluido",
        etapa: "resposta_usuario",
        opcoes: {},
      });
    }

    await salvarMensagem(sessaoId, "USUARIO", texto, "resposta_usuario");

    const resultado = await atenderPerguntaLivre({
      sessionId,
      mensagem: texto,
    });

    const respostaEncontrada =
      resultado.respostaEncontrada ?? !resultado.necessitaAgendamento;

    const proximaEtapa = respostaEncontrada
      ? "resposta_usuario"
      : "oferecendo_agendamento";

    const resposta = respostaEncontrada
      ? resultado.resposta
      : "Não encontrei uma orientação suficientemente relacionada à sua dúvida. Você gostaria de solicitar um atendimento presencial no PROCON? Responda sim ou não.";

    await salvarMensagem(sessaoId, "BOT", resposta, proximaEtapa);

    await pool.query(
      `UPDATE sessoes
       SET categoria = NULL, pergunta_atual = $2,
           finalizada = FALSE, status = 'ativa', fim_sessao = NULL,
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [sessaoId, proximaEtapa],
    );

    return res.status(200).json({
      sessionId,
      resposta,
      tipo: respostaEncontrada ? (resultado.tipo ?? "atendimento") : "oferecendo_agendamento",
      opcoes: {},
      categoria: null,
      perguntaAtual: proximaEtapa,
      etapa: proximaEtapa,
      finalizada: false,
      necessitaAgendamento: !respostaEncontrada,
      respostaEncontrada,
      aviso: respostaEncontrada ? resultado.aviso : undefined,
      fonte: respostaEncontrada ? resultado.fonte : null,
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return res.status(409).json({
        erro: mensagemDadosExistentes,
        tipo: "cadastro_existente",
      });
    }

    console.error("Erro ao processar mensagem:", error);

    return res.status(500).json({
      erro: "Não foi possível processar a mensagem. Verifique a conexão com o banco e com o chatbot Python.",
    });
  }
}

export async function obterHistorico(req: Request, res: Response) {
  try {
    const sessionId = req.params.sessionId;

    if (!sessionId) {
      return res.status(400).json({ erro: "Informe o ID da sessão." });
    }

    const sessao = await pool.query(
      "SELECT id FROM sessoes WHERE session_id = $1",
      [sessionId],
    );

    if (!sessao.rows.length) {
      return res.status(404).json({ erro: "Sessão não encontrada." });
    }

    const resultado = await pool.query(
      `SELECT id, tipo, mensagem, etapa, enviada_em
       FROM mensagens WHERE sessao_id = $1
       ORDER BY enviada_em ASC, id ASC`,
      [sessao.rows[0].id],
    );

    return res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("Erro ao recuperar histórico:", error);
    return res.status(500).json({ erro: "Não foi possível recuperar o histórico." });
  }
}

export async function listarConversas(_req: Request, res: Response) {
  try {
    const resultado = await pool.query(`
      SELECT
        s.session_id AS "sessionId",
        COALESCE(u.nome, s.cadastro_nome, 'Novo atendimento') AS nome,
        COALESCE(u.telefone, s.cadastro_telefone, '') AS telefone,
        COALESCE(ultima.mensagem, '') AS "lastMessage",
        ultima.enviada_em AS "lastMessageAt"
      FROM sessoes s
      LEFT JOIN usuarios u ON u.id = s.usuario_id
      LEFT JOIN LATERAL (
        SELECT m.mensagem, m.enviada_em, m.id
        FROM mensagens m
        WHERE m.sessao_id = s.id
        ORDER BY m.enviada_em DESC, m.id DESC
        LIMIT 1
      ) ultima ON TRUE
      ORDER BY ultima.enviada_em DESC NULLS LAST
    `);

    return res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("Erro ao listar conversas:", error);
    return res.status(500).json({ erro: "Não foi possível listar as conversas." });
  }
}
