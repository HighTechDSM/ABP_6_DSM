import { pool } from "../config/database.js";

export interface CriarAgendamentoInput {
  usuarioId: number;
  sessaoId: number;
  dataAgendamento: string;
  horario: string;
}

export class ErroAgendamento extends Error {
  constructor(
    mensagem: string,
    public readonly statusCode: number,
  ) {
    super(mensagem);
    this.name = "ErroAgendamento";
  }
}

const DATA_INICIAL = "2026-10-26";
const DATA_FINAL = "2026-10-30";

function validarIds(usuarioId: number, sessaoId?: number) {
  if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
    throw new ErroAgendamento("ID de usuário inválido.", 400);
  }

  if (
    sessaoId !== undefined &&
    (!Number.isInteger(sessaoId) || sessaoId <= 0)
  ) {
    throw new ErroAgendamento("ID de sessão inválido.", 400);
  }
}

function validarData(data: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    throw new ErroAgendamento(
      "Informe a data no formato AAAA-MM-DD.",
      400,
    );
  }

  const dataObj = new Date(`${data}T00:00:00Z`);

  if (
    Number.isNaN(dataObj.getTime()) ||
    dataObj.toISOString().slice(0, 10) !== data
  ) {
    throw new ErroAgendamento("A data informada é inválida.", 400);
  }

  if (data < DATA_INICIAL || data > DATA_FINAL) {
    throw new ErroAgendamento(
      "Escolha uma data entre 26 e 30 de outubro de 2026.",
      400,
    );
  }
}

function validarHorario(horario: string) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)) {
    throw new ErroAgendamento(
      "Informe o horário no formato HH:mm, por exemplo, 14:00.",
      400,
    );
  }

  if (
    horario < "08:00" ||
    horario > "15:15" ||
    (horario >= "11:45" && horario < "12:00")
  ) {
    throw new ErroAgendamento(
      "O horário deve respeitar o expediente de atendimento.",
      400,
    );
  }
}

export async function criarAgendamento(
  input: CriarAgendamentoInput,
) {
  const { usuarioId, sessaoId, dataAgendamento, horario } = input;

  validarIds(usuarioId, sessaoId);
  validarData(dataAgendamento);
  validarHorario(horario);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Serializa as tentativas de reservar o mesmo horário.
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtext($1))",
      [`${dataAgendamento} ${horario}`],
    );

    const sessao = await client.query(
      `SELECT id
       FROM sessoes
       WHERE id = $1 AND usuario_id = $2
       FOR UPDATE`,
      [sessaoId, usuarioId],
    );

    if (sessao.rows.length === 0) {
      throw new ErroAgendamento(
        "A sessão não existe ou não pertence a esse usuário.",
        404,
      );
    }

    const usuario = await client.query(
      `SELECT id
       FROM usuarios
       WHERE id = $1
       FOR UPDATE`,
      [usuarioId],
    );

    if (usuario.rows.length === 0) {
      throw new ErroAgendamento("Usuário não encontrado.", 404);
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
      throw new ErroAgendamento(
        "Este horário já está ocupado. Escolha outro horário.",
        409,
      );
    }

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

    const resultado = await client.query(
      `INSERT INTO agendamentos
         (usuario_id, sessao_id, data_agendamento, horario, status)
       VALUES ($1, $2, $3, $4, 'agendado')
       RETURNING
         id,
         usuario_id AS "usuarioId",
         sessao_id AS "sessaoId",
         data_agendamento::text AS "dataAgendamento",
         TO_CHAR(horario, 'HH24:MI') AS horario,
         status,
         criado_em AS "criadoEm"`,
      [usuarioId, sessaoId, dataAgendamento, horario],
    );

    await client.query("COMMIT");

    return resultado.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function listarAgendamentosUsuario(usuarioId: number) {
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

export async function cancelarAgendamento(
  agendamentoId: number,
  usuarioId: number,
) {
  validarIds(usuarioId);

  if (!Number.isInteger(agendamentoId) || agendamentoId <= 0) {
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
