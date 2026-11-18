
import { pool } from "../config/database.js";

// ==========================================
// INTERFACES
// ==========================================

export interface CriarAgendamentoInput {
  usuarioId: number;
  sessaoId: number;
  dataAgendamento: string;
  horario: string;
}

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

export class ErroAgendamento extends Error {
  constructor(
    mensagem: string,
    public readonly statusCode: number,
  ) {
    super(mensagem);
    this.name = "ErroAgendamento";
  }
}

// ==========================================
// CONFIGURAÇÕES DE AGENDAMENTO
// ==========================================

const FUSO_HORARIO = "America/Sao_Paulo";
const DIAS_MAXIMOS_ANTECEDENCIA = 30;

const HORARIO_INICIAL = "08:00";
const HORARIO_FINAL = "15:15";

// ==========================================
// DATA E HORA ATUAIS
// ==========================================

function obterDataHoraAtualBrasil(): {
  data: string;
  horario: string;
} {
  const partes = new Intl.DateTimeFormat("en-GB", {
    timeZone: FUSO_HORARIO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const obter = (tipo: string): string => {
    return (
      partes.find((parte) => parte.type === tipo)?.value ?? ""
    );
  };

  return {
    data: `${obter("year")}-${obter("month")}-${obter("day")}`,
    horario: `${obter("hour")}:${obter("minute")}`,
  };
}

// ==========================================
// VALIDAÇÃO DOS IDENTIFICADORES
// ==========================================

function validarIds(
  usuarioId: number,
  sessaoId?: number,
): void {
  if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
    throw new ErroAgendamento(
      "ID de usuário inválido.",
      400,
    );
  }

  if (
    sessaoId !== undefined &&
    (!Number.isInteger(sessaoId) || sessaoId <= 0)
  ) {
    throw new ErroAgendamento(
      "ID de sessão inválido.",
      400,
    );
  }
}

// ==========================================
// VALIDAÇÃO DA DATA
// ==========================================

function validarData(data: string): void {
  // Verifica o formato AAAA-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    throw new ErroAgendamento(
      "Informe a data no formato AAAA-MM-DD.",
      400,
    );
  }

  // Verifica se a data realmente existe
  const dataObj = new Date(`${data}T00:00:00Z`);

  if (
    Number.isNaN(dataObj.getTime()) ||
    dataObj.toISOString().slice(0, 10) !== data
  ) {
    throw new ErroAgendamento(
      "A data informada é inválida.",
      400,
    );
  }

  const { data: hoje } = obterDataHoraAtualBrasil();

  // Impede datas anteriores ao dia atual
  if (data < hoje) {
    throw new ErroAgendamento(
      "Não é possível agendar para uma data passada.",
      400,
    );
  }

  // Calcula a data máxima de agendamento
  const dataMaxima = new Date(`${hoje}T00:00:00Z`);

  dataMaxima.setUTCDate(
    dataMaxima.getUTCDate() + DIAS_MAXIMOS_ANTECEDENCIA,
  );

  const dataLimite = dataMaxima
    .toISOString()
    .slice(0, 10);

  // Impede datas muito distantes
  if (data > dataLimite) {
    throw new ErroAgendamento(
      `O agendamento deve ser realizado com no máximo ${DIAS_MAXIMOS_ANTECEDENCIA} dias de antecedência.`,
      400,
    );
  }
}

// ==========================================
// VALIDAÇÃO DO HORÁRIO
// ==========================================

function validarHorario(horario: string): void {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)) {
    throw new ErroAgendamento(
      "Informe o horário no formato HH:mm, por exemplo, 14:00.",
      400,
    );
  }

  if (
    horario < HORARIO_INICIAL ||
    horario > HORARIO_FINAL ||
    (horario >= "11:45" && horario < "12:00")
  ) {
    throw new ErroAgendamento(
      "O horário deve respeitar o expediente de atendimento.",
      400,
    );
  }
}

// ==========================================
// VALIDAÇÃO DE HORÁRIOS PASSADOS
// ==========================================

function validarHorarioNaoPassado(
  dataAgendamento: string,
  horario: string,
): void {
  const agora = obterDataHoraAtualBrasil();

  // Verifica se o agendamento é para hoje
  if (dataAgendamento !== agora.data) {
    return;
  }

  // Impede horários anteriores ou iguais
  // ao minuto atual
  if (horario <= agora.horario) {
    throw new ErroAgendamento(
      "Não é possível agendar para um horário que já passou.",
      400,
    );
  }
}

// ==========================================
// VALIDAÇÃO COMPLETA DO AGENDAMENTO
// ==========================================

function validarDadosAgendamento(
  input: CriarAgendamentoInput,
): void {
  const {
    usuarioId,
    sessaoId,
    dataAgendamento,
    horario,
  } = input;

  validarIds(usuarioId, sessaoId);
  validarData(dataAgendamento);
  validarHorario(horario);
  validarHorarioNaoPassado(dataAgendamento, horario);
}

// ==========================================
// CRIAR AGENDAMENTO
// ==========================================

export async function criarAgendamento(
  input: CriarAgendamentoInput,
) {
  const {
    usuarioId,
    sessaoId,
    dataAgendamento,
    horario,
  } = input;

  // Valida os dados antes de acessar o banco
  validarDadosAgendamento(input);

  const client = await pool.connect();

  let transacaoIniciada = false;

  try {
    await client.query("BEGIN");
    transacaoIniciada = true;

    // Serializa tentativas de reservar
    // o mesmo horário
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtext($1))",
      [`${dataAgendamento} ${horario}`],
    );

    // Verifica se a sessão pertence ao usuário
    const sessao = await client.query(
      `SELECT id
       FROM sessoes
       WHERE id = $1
         AND usuario_id = $2
       FOR UPDATE`,
      [sessaoId, usuarioId],
    );

    if (sessao.rows.length === 0) {
      throw new ErroAgendamento(
        "A sessão não existe ou não pertence a esse usuário.",
        404,
      );
    }

    // Verifica a existência do usuário
    const usuario = await client.query(
      `SELECT id
       FROM usuarios
       WHERE id = $1
       FOR UPDATE`,
      [usuarioId],
    );

    if (usuario.rows.length === 0) {
      throw new ErroAgendamento(
        "Usuário não encontrado.",
        404,
      );
    }

    // Verifica se o horário está ocupado
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
      throw new ErroAgendamento(
        "Este horário já está ocupado. Escolha outro horário.",
        409,
      );
    }

    // Verifica se o usuário já possui
    // um agendamento ativo
    const existente = await client.query(
      `SELECT id
       FROM agendamentos
       WHERE usuario_id = $1
         AND status IN ('agendado', 'confirmado')
       LIMIT 1`,
      [usuarioId],
    );

    if (existente.rows.length > 0) {
      throw new ErroAgendamento(
        "Este cidadão já possui um agendamento ativo.",
        409,
      );
    }

    // Insere o agendamento
    const resultado = await client.query(
      `INSERT INTO agendamentos
         (
           usuario_id,
           sessao_id,
           data_agendamento,
           horario,
           status
         )
       VALUES ($1, $2, $3, $4, 'agendado')
       RETURNING
         id,
         usuario_id AS "usuarioId",
         sessao_id AS "sessaoId",
         data_agendamento::text AS "dataAgendamento",
         TO_CHAR(horario, 'HH24:MI') AS horario,
         status,
         criado_em AS "criadoEm"`,
      [
        usuarioId,
        sessaoId,
        dataAgendamento,
        horario,
      ],
    );

    await client.query("COMMIT");
    transacaoIniciada = false;

    return resultado.rows[0];
  } catch (error) {
    if (transacaoIniciada) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error(
          "Erro ao desfazer transação de agendamento:",
          rollbackError,
        );
      }
    }

    throw error;
  } finally {
    client.release();
  }
}

// ==========================================
// LISTAR AGENDAMENTOS DO USUÁRIO
// ==========================================

export async function listarAgendamentosUsuario(
  usuarioId: number,
) {
  validarIds(usuarioId);

  const resultado = await pool.query(
    `SELECT
       id,
       usuario_id,
       sessao_id,
       data_agendamento,
       horario,
       status,
       observacoes,
       criado_em,
       atualizado_em
     FROM agendamentos
     WHERE usuario_id = $1
     ORDER BY data_agendamento DESC, horario DESC`,
    [usuarioId],
  );

  return resultado.rows;
}

// ==========================================
// CANCELAR AGENDAMENTO
// ==========================================

export async function cancelarAgendamento(
  agendamentoId: number,
  usuarioId: number,
) {
  validarIds(usuarioId);

  if (
    !Number.isInteger(agendamentoId) ||
    agendamentoId <= 0
  ) {
    throw new ErroAgendamento(
      "ID de agendamento inválido.",
      400,
    );
  }

  const resultado = await pool.query(
    `UPDATE agendamentos
     SET status = 'cancelado',
         atualizado_em = CURRENT_TIMESTAMP
     WHERE id = $1
       AND usuario_id = $2
       AND status IN ('agendado', 'confirmado')
     RETURNING *`,
    [agendamentoId, usuarioId],
  );

  if (resultado.rows.length === 0) {
    throw new ErroAgendamento(
      "Agendamento ativo não encontrado para esse usuário.",
      404,
    );
  }

  return resultado.rows[0];
}

// ==========================================
// DOCUMENTOS NECESSÁRIOS POR CATEGORIA
// ==========================================

/**
 * Retorna a lista de documentos que o cidadão
 * deve levar ao PROCON, conforme a categoria.
 */
export function obterDocumentosPorCategoria(
  categoria?: string | null,
): string[] {
  const documentosBase = [
    "RG (original e cópia) do consumidor ou procurador (com procuração simples)",
    "Cópia impressa da documentação relacionada ao caso",
  ];

  switch (categoria) {
    case "produto_defeito":
    case "produto_nao_entregue":
      return [
        ...documentosBase,
        "Pedido, nota fiscal ou cupom fiscal",
        "Comprovante de pagamento ou boleto",
        "Folheto/anúncio publicitário (se houver)",
        "Imagem da embalagem do produto (se aplicável)",
      ];

    case "cobranca_indevida":
      return [
        ...documentosBase,
        "Contrato (se houver)",
        "Boleto e comprovante de pagamento",
        "Extrato bancário ou fatura do cartão",
        "Cartas de cobrança (se houver)",
        "Comprovante de negativação (SPC/SERASA), se houver",
        "Boletim de Ocorrência (para clonagem de cartão)",
      ];

    case "servico":
      return [
        ...documentosBase,
        "Conta/Fatura reclamada",
        "Solicitação de serviço (instalação, vistoria, etc.)",
        "Comprovante de pagamento",
        "Termo de parcelamento (se houver)",
      ];

    default:
      return [
        ...documentosBase,
        "Contrato ou pedido",
        "Comprovantes de pagamento (boletos, faturas)",
        "Nota fiscal ou cupom fiscal",
        "Outros documentos que comprovem o problema",
      ];
  }
}
