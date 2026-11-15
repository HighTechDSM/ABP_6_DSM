
import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { pool } from "../config/database.js";

const STATUS_ATIVOS = ["agendado", "confirmado"];

const normalizarCpf = (valor: unknown) =>
  String(valor ?? "").replace(/\D/g, "");

const normalizarTelefone = (valor: unknown) =>
  String(valor ?? "").replace(/\D/g, "");

const dataValida = (valor: unknown): valor is string =>
  typeof valor === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(valor) &&
  !Number.isNaN(Date.parse(`${valor}T12:00:00`));

const horarioValido = (valor: unknown): valor is string =>
  typeof valor === "string" && /^\d{2}:\d{2}$/.test(valor);

function mensagemErro(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Ocorreu um erro inesperado.";
}

/**
 * POST /api/agendamentos
 * Cria um agendamento manual para atendimento presencial.
 */
export async function criarAgendamento(req: Request, res: Response) {
  const nome = String(req.body.nome ?? req.body.name ?? "").trim();
  const telefone = normalizarTelefone(req.body.telefone ?? req.body.phone);
  const cpf = normalizarCpf(req.body.cpf);
  const dataAgendamento = req.body.dataAgendamento ?? req.body.date;
  const horario = req.body.horario ?? req.body.time;

  if (!nome || nome.length > 150) {
    return res.status(400).json({
      erro: "Informe o nome completo, com no máximo 150 caracteres.",
    });
  }

  if (telefone.length < 10 || telefone.length > 20) {
    return res.status(400).json({
      erro: "Informe um telefone válido com DDD.",
    });
  }

  if (cpf.length !== 11) {
    return res.status(400).json({
      erro: "O CPF deve conter 11 números.",
    });
  }

  if (!dataValida(dataAgendamento) || !horarioValido(horario)) {
    return res.status(400).json({
      erro: "Informe uma data e um horário válidos.",
    });
  }

  if (horario < "08:00" || horario > "15:15" ||
      (horario >= "11:45" && horario < "12:00")) {
    return res.status(400).json({
      erro: "O horário informado está fora do expediente de atendimento.",
    });
  }

  const dataEscolhida = new Date(`${dataAgendamento}T12:00:00Z`);
  const inicio = new Date("2026-10-26T00:00:00Z");
  const fim = new Date("2026-10-30T23:59:59Z");

  if (dataEscolhida < inicio || dataEscolhida > fim) {
    return res.status(400).json({
      erro: "Os agendamentos desta página devem ocorrer entre 26 e 30 de outubro de 2026.",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Bloqueia alterações concorrentes dos mesmos dados durante a identificação.
    const buscaUsuario = await client.query(
      `SELECT id, nome, telefone, cpf
       FROM usuarios
       WHERE cpf = $1 OR telefone = $2
       FOR UPDATE`,
      [cpf, telefone],
    );

    let usuarioId: number;

    if (buscaUsuario.rows.length > 1) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        erro: "O CPF e o telefone correspondem a cadastros diferentes. Confira os dados antes de agendar.",
      });
    }

    if (buscaUsuario.rows.length === 1) {
      const usuario = buscaUsuario.rows[0];

      if (usuario.cpf !== cpf || usuario.telefone !== telefone) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          erro: "O CPF ou telefone informado já está associado a outro cadastro. Confira os dados.",
        });
      }

      usuarioId = Number(usuario.id);

      // Atualiza o nome caso o funcionário tenha corrigido a informação.
      await client.query(
        `UPDATE usuarios SET nome = $1 WHERE id = $2`,
        [nome, usuarioId],
      );
    } else {
      const novoUsuario = await client.query(
        `INSERT INTO usuarios (nome, telefone, cpf)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [nome, telefone, cpf],
      );

      usuarioId = Number(novoUsuario.rows[0].id);
    }

    const conflitoHorario = await client.query(
      `SELECT id
       FROM agendamentos
       WHERE data_agendamento = $1
         AND horario = $2
         AND status IN ('agendado', 'confirmado')
       LIMIT 1`,
      [dataAgendamento, horario],
    );

    if (conflitoHorario.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        erro: "Este horário acabou de ser ocupado. Atualize a agenda e selecione outro horário.",
      });
    }

    const agendamentoAtivo = await client.query(
      `SELECT id
       FROM agendamentos
       WHERE usuario_id = $1
         AND status IN ('agendado', 'confirmado')
       LIMIT 1`,
      [usuarioId],
    );

    if (agendamentoAtivo.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        erro: "Este cidadão já possui um agendamento ativo.",
      });
    }

    const sessao = await client.query(
      `INSERT INTO sessoes
         (session_id, usuario_id, categoria, pergunta_atual, finalizada, status)
       VALUES ($1, $2, $3, $4, TRUE, 'finalizada')
       RETURNING id`,
      [
        randomUUID(),
        usuarioId,
        "atendimento_presencial",
        "agendamento_manual",
      ],
    );

    const sessaoId = Number(sessao.rows[0].id);

    const resultado = await client.query(
      `INSERT INTO agendamentos
         (usuario_id, sessao_id, data_agendamento, horario, status)
       VALUES ($1, $2, $3, $4, 'agendado')
       RETURNING
         id,
         usuario_id AS "usuarioId",
         sessao_id AS "sessaoId",
         $5::text AS name,
         $6::text AS phone,
         $7::text AS cpf,
         data_agendamento::text AS date,
         TO_CHAR(horario, 'HH24:MI') AS time,
         status,
         criado_em AS "criadoEm"`,
      [usuarioId, sessaoId, dataAgendamento, horario, nome, telefone, cpf],
    );

    await client.query("COMMIT");
    return res.status(201).json(resultado.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");

    const dbError = error as { code?: string };

    if (dbError.code === "23505") {
      return res.status(409).json({
        erro: "Não foi possível concluir: o cidadão ou horário já possui um registro conflitante. Atualize a agenda e tente novamente.",
      });
    }

    console.error("Erro ao criar agendamento:", error);
    return res.status(500).json({
      erro: "Não foi possível criar o agendamento.",
      detalhe: mensagemErro(error),
    });
  } finally {
    client.release();
  }
}

/**
 * GET /api/agendamentos
 * Retorna a agenda persistida no banco.
 */
export async function listarTodosAgendamentos(
  _req: Request,
  res: Response,
) {
  try {
    const resultado = await pool.query(
      `SELECT
         a.id,
         a.usuario_id AS "usuarioId",
         a.sessao_id AS "sessaoId",
         u.nome AS name,
         u.telefone AS phone,
         u.cpf,
         a.data_agendamento::text AS date,
         TO_CHAR(a.horario, 'HH24:MI') AS time,
         a.status,
         a.criado_em AS "criadoEm"
       FROM agendamentos a
       INNER JOIN usuarios u ON u.id = a.usuario_id
       ORDER BY a.data_agendamento ASC, a.horario ASC`,
    );

    return res.json(resultado.rows);
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    return res.status(500).json({
      erro: "Não foi possível carregar os agendamentos.",
    });
  }
}

/**
 * GET /api/agendamentos/usuario/:usuarioId
 */
export async function listarAgendamentosUsuario(
  req: Request,
  res: Response,
) {
  const usuarioId = Number(req.params.usuarioId);

  if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
    return res.status(400).json({ erro: "ID de usuário inválido." });
  }

  try {
    const resultado = await pool.query(
      `SELECT
         id,
         usuario_id AS "usuarioId",
         sessao_id AS "sessaoId",
         data_agendamento::text AS date,
         TO_CHAR(horario, 'HH24:MI') AS time,
         status,
         criado_em AS "criadoEm"
       FROM agendamentos
       WHERE usuario_id = $1
       ORDER BY data_agendamento ASC, horario ASC`,
      [usuarioId],
    );

    return res.json(resultado.rows);
  } catch (error) {
    console.error("Erro ao listar agendamentos do usuário:", error);
    return res.status(500).json({
      erro: "Não foi possível carregar os agendamentos do usuário.",
    });
  }
}

/**
 * PATCH /api/agendamentos/:id/cancelar
 */
export async function cancelarAgendamento(
  req: Request,
  res: Response,
) {
  const id = Number(req.params.id);
  const usuarioId = Number(req.body.usuarioId);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: "ID de agendamento inválido." });
  }

  if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
    return res.status(400).json({ erro: "ID de usuário inválido." });
  }

  try {
    const resultado = await pool.query(
      `UPDATE agendamentos
       SET status = 'cancelado'
       WHERE id = $1
         AND usuario_id = $2
         AND status IN ('agendado', 'confirmado')
       RETURNING id, usuario_id AS "usuarioId", status`,
      [id, usuarioId],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        erro: "Agendamento ativo não encontrado para este cidadão.",
      });
    }

    return res.json({
      mensagem: "Agendamento cancelado com sucesso.",
      agendamento: resultado.rows[0],
    });
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    return res.status(500).json({
      erro: "Não foi possível cancelar o agendamento.",
    });
  }
}
