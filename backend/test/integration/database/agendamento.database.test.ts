import { describe, it, expect } from "vitest";
import { config } from "dotenv";
import pg from "pg";
import type { PoolClient } from "pg";

config({
  path: ".env.test",
  quiet: true,
});

const EXPECTED_PROJECT = "zldnrnvnuvurfmprlxmb";
const EXPECTED_ENVIRONMENT = "abp6_database_test";

// Obtém a conexão e verifica o identificador do projeto
function obterConnectionString(): string {
  const connectionString = process.env.TEST_DATABASE_URL;

  if (!connectionString) {
    throw new Error("TEST_DATABASE_URL não configurada.");
  }

  const url = new URL(connectionString);

  if (!url.username.endsWith(`.${EXPECTED_PROJECT}`)) {
    throw new Error(
      "Operação bloqueada: conexão não pertence ao Supabase de testes.",
    );
  }

  return connectionString;
}

// Confirma a identidade do ambiente no próprio PostgreSQL
async function validarAmbienteDeTestes(client: PoolClient): Promise<void> {
  const connectionString = obterConnectionString();
  const url = new URL(connectionString);

  if (!url.username.endsWith(`.${EXPECTED_PROJECT}`)) {
    throw new Error(
      "Operação bloqueada: conexão não pertence ao Supabase de testes.",
    );
  }

  const result = await client.query(
    `SELECT environment_name
     FROM public.integration_test_guard
     WHERE id = 1`,
  );

  if (
    result.rowCount !== 1 ||
    result.rows[0].environment_name !== EXPECTED_ENVIRONMENT
  ) {
    throw new Error("Operação bloqueada: ambiente de testes não confirmado.");
  }
}

describe("Segurança do banco de integração", () => {
  it("deve confirmar que a conexão pertence ao banco de testes", async () => {
    const connectionString = obterConnectionString();

    const pool = new pg.Pool({
      connectionString,
      connectionTimeoutMillis: 10000,
      max: 1,
    });

    let client: PoolClient | undefined;

    try {
      client = await pool.connect();

      await validarAmbienteDeTestes(client);

      const result = await client.query(
        `SELECT environment_name
         FROM public.integration_test_guard
         WHERE id = 1`,
      );

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].environment_name).toBe(EXPECTED_ENVIRONMENT);
    } finally {
      client?.release();
      await pool.end();
    }
  });

  it("deve criar e consultar um agendamento real", async () => {
    const pool = new pg.Pool({
      connectionString: obterConnectionString(),
      connectionTimeoutMillis: 10000,
      max: 1,
    });

    const client = await pool.connect();
    let transacaoIniciada = false;

    try {
      await validarAmbienteDeTestes(client);

      await client.query("BEGIN");
      transacaoIniciada = true;

      // Cria um usuário fictício
      const usuario = await client.query(
        `INSERT INTO public.usuarios (nome, telefone)
       VALUES ($1, $2)
       RETURNING id`,
        ["Usuario Teste Integracao", `teste-${crypto.randomUUID().slice(0, 12)}`],
      );

      const usuarioId = usuario.rows[0].id;

      // Cria uma sessão vinculada ao usuário
      const sessao = await client.query(
        `INSERT INTO public.sessoes (session_id, usuario_id)
       VALUES ($1, $2)
       RETURNING id`,
        [`teste-${crypto.randomUUID().slice(0, 12)}`, usuarioId],
      );

      const sessaoId = sessao.rows[0].id;

      // Cria o agendamento
      const agendamento = await client.query(
        `INSERT INTO public.agendamentos (
         usuario_id,
         sessao_id,
         data_agendamento,
         horario
       )
       VALUES ($1, $2, $3, $4)
       RETURNING id, status`,
        [usuarioId, sessaoId, "2027-01-15", "10:00:00"],
      );

      expect(agendamento.rows[0].status).toBe("agendado");

      // Consulta o registro criado
      const consulta = await client.query(
        `SELECT id, status
       FROM public.agendamentos
       WHERE id = $1`,
        [agendamento.rows[0].id],
      );

      expect(consulta.rows).toHaveLength(1);
      expect(consulta.rows[0].status).toBe("agendado");
    } finally {
      try {
        if (transacaoIniciada) {
          await client.query("ROLLBACK");
        }
      } finally {
        client.release();
        await pool.end();
      }
    }
  });

  it("deve impedir dois agendamentos ativos para o mesmo usuário", async () => {
    const pool = new pg.Pool({
      connectionString: obterConnectionString(),
      connectionTimeoutMillis: 10000,
      max: 1,
    });

    let client: pg.PoolClient | undefined;
    let transacaoIniciada = false;

    try {
      client = await pool.connect();

      await validarAmbienteDeTestes(client);

      await client.query("BEGIN");
      transacaoIniciada = true;

      const usuario = await client.query(
        `INSERT INTO public.usuarios (nome, telefone)
       VALUES ($1, $2)
       RETURNING id`,
        ["Usuario Teste Duplicidade", `teste-${crypto.randomUUID().slice(0, 12)}`],
      );

      const usuarioId = usuario.rows[0].id;

      const sessao = await client.query(
        `INSERT INTO public.sessoes (session_id, usuario_id)
       VALUES ($1, $2)
       RETURNING id`,
        [`teste-${crypto.randomUUID().slice(0, 12)}`, usuarioId],
      );

      const sessaoId = sessao.rows[0].id;

      await client.query(
        `INSERT INTO public.agendamentos (
         usuario_id, sessao_id, data_agendamento, horario
       )
       VALUES ($1, $2, $3, $4)`,
        [usuarioId, sessaoId, "2027-01-15", "10:00:00"],
      );

      // Um segundo agendamento ativo deve ser rejeitado.
      try {
        await client.query(
          `INSERT INTO public.agendamentos (
           usuario_id, sessao_id, data_agendamento, horario
         )
         VALUES ($1, $2, $3, $4)`,
          [usuarioId, sessaoId, "2027-01-16", "11:00:00"],
        );

        throw new Error("O banco permitiu um agendamento ativo duplicado.");
      } catch (error) {
        expect(error).toMatchObject({
          code: "23505",
          constraint: "unique_agendamento_ativo_usuario",
        });
      }
    } finally {
      try {
        if (client && transacaoIniciada) {
          await client.query("ROLLBACK");
        }
      } finally {
        client?.release();
        await pool.end();
      }
    }
  });

  it("deve permitir novo agendamento após cancelar o anterior", async () => {
    const pool = new pg.Pool({
      connectionString: obterConnectionString(),
      connectionTimeoutMillis: 10000,
      max: 1,
    });

    let client: pg.PoolClient | undefined;
    let transacaoIniciada = false;

    try {
      client = await pool.connect();

      // Verifica o ambiente antes de qualquer escrita
      await validarAmbienteDeTestes(client);

      await client.query("BEGIN");
      transacaoIniciada = true;

      const usuario = await client.query(
        `INSERT INTO public.usuarios (nome, telefone)
       VALUES ($1, $2)
       RETURNING id`,
        ["Usuario Teste Cancelamento", `teste-${crypto.randomUUID().slice(0, 12)}`],
      );

      const usuarioId = usuario.rows[0].id;

      const sessao = await client.query(
        `INSERT INTO public.sessoes (session_id, usuario_id)
       VALUES ($1, $2)
       RETURNING id`,
        [`teste-${crypto.randomUUID().slice(0, 12)}`, usuarioId],
      );

      const sessaoId = sessao.rows[0].id;

      // Primeiro agendamento
      const primeiro = await client.query(
        `INSERT INTO public.agendamentos (
         usuario_id, sessao_id, data_agendamento, horario
       )
       VALUES ($1, $2, $3, $4)
       RETURNING id, status`,
        [usuarioId, sessaoId, "2027-01-15", "10:00:00"],
      );

      expect(primeiro.rows[0].status).toBe("agendado");

      // Cancela o primeiro agendamento
      const cancelamento = await client.query(
        `UPDATE public.agendamentos
       SET status = 'cancelado'
       WHERE id = $1
       RETURNING status`,
        [primeiro.rows[0].id],
      );

      expect(cancelamento.rows[0].status).toBe("cancelado");

      // Cria um novo agendamento para o mesmo usuário
      const segundo = await client.query(
        `INSERT INTO public.agendamentos (
         usuario_id, sessao_id, data_agendamento, horario
       )
       VALUES ($1, $2, $3, $4)
       RETURNING id, status`,
        [usuarioId, sessaoId, "2027-01-16", "11:00:00"],
      );

      expect(segundo.rows[0].status).toBe("agendado");

      // Confirma os dois registros dentro da transação
      const consulta = await client.query(
        `SELECT status
       FROM public.agendamentos
       WHERE usuario_id = $1
       ORDER BY id`,
        [usuarioId],
      );

      expect(consulta.rows.map((row) => row.status)).toEqual([
        "cancelado",
        "agendado",
      ]);
    } finally {
      try {
        if (client && transacaoIniciada) {
          await client.query("ROLLBACK");
        }
      } finally {
        client?.release();
        await pool.end();
      }
    }
  });

  it("deve rejeitar agendamentos com status inválido", async () => {
    const pool = new pg.Pool({
      connectionString: obterConnectionString(),
      connectionTimeoutMillis: 10000,
      max: 1,
    });

    let client: pg.PoolClient | undefined;
    let transacaoIniciada = false;

    try {
      client = await pool.connect();

      await validarAmbienteDeTestes(client);

      await client.query("BEGIN");
      transacaoIniciada = true;

      const usuario = await client.query(
        `INSERT INTO public.usuarios (nome, telefone)
       VALUES ($1, $2)
       RETURNING id`,
        ["Usuario Teste Status", `teste-${crypto.randomUUID().slice(0, 12)}`],
      );

      const usuarioId = usuario.rows[0].id;

      const sessao = await client.query(
        `INSERT INTO public.sessoes (session_id, usuario_id)
       VALUES ($1, $2)
       RETURNING id`,
        [`teste-${crypto.randomUUID().slice(0, 12)}`, usuarioId],
      );

      const sessaoId = sessao.rows[0].id;

      // O PostgreSQL deve rejeitar esse status
      await expect(
        client.query(
          `INSERT INTO public.agendamentos (
           usuario_id,
           sessao_id,
           data_agendamento,
           horario,
           status
         )
         VALUES ($1, $2, $3, $4, $5)`,
          [usuarioId, sessaoId, "2027-01-17", "14:00:00", "pendente_invalido"],
        ),
      ).rejects.toMatchObject({
        code: "23514",
        constraint: "chk_agendamento_status",
      });
    } finally {
      try {
        if (client && transacaoIniciada) {
          await client.query("ROLLBACK");
        }
      } finally {
        client?.release();
        await pool.end();
      }
    }
  });
});
