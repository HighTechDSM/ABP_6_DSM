import "dotenv/config";
import { config } from "dotenv";
import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

config({ path: ".env.test", quiet: true });

const { Pool } = pg;

const PROJETO_TESTE = "zldnrnvnuvurfmprlxmb";
const AMBIENTE_TESTE = "abp6_database_test";

const urlTeste = process.env.TEST_DATABASE_URL;

if (!urlTeste) {
  throw new Error("TEST_DATABASE_URL não configurada.");
}

const url = new URL(urlTeste);

if (!url.username.endsWith(`.${PROJETO_TESTE}`)) {
  throw new Error("A conexão não pertence ao projeto Supabase de testes.");
}

// O serviço utiliza DATABASE_URL.
// Configuramos a conexão antes de importá-lo.
process.env.DATABASE_URL = urlTeste;
process.env.DATABASE_SSL = "true";

const poolVerificacao = new Pool({
  connectionString: urlTeste,
  ssl: { rejectUnauthorized: false },
  max: 2,
});

type ServicoAgendamento =
  typeof import("../../../src/services/agendamento_service.js");

let servico: ServicoAgendamento;

let usuarioId: number;
let sessaoId: number;
let agendamentoId: number;

const identificador = crypto.randomUUID().replace(/-/g, "");

const telefoneTeste = `9${identificador.replace(/\D/g, "").padEnd(10, "0").slice(0, 10)}`;

const sessaoTeste = `integration-service-${identificador}`;

// Data futura relativa ao relógio real do Brasil
function obterDataFutura(dias: number): string {
  const hoje = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const data = new Date(`${hoje}T00:00:00Z`);
  data.setUTCDate(data.getUTCDate() + dias);

  return data.toISOString().slice(0, 10);
}

const dataAgendamento = obterDataFutura(5);
const horarioAgendamento = "10:00";

describe.sequential("Integração real do serviço de agendamentos", () => {
  beforeAll(async () => {
    // Confirma o projeto de testes antes de escrever.
    const verificacao = await poolVerificacao.query(
      `SELECT environment_name
         FROM public.integration_test_guard
         WHERE id = 1`,
    );

    if (verificacao.rows[0]?.environment_name !== AMBIENTE_TESTE) {
      throw new Error("Ambiente de testes não confirmado. Execução bloqueada.");
    }

    // Importação dinâmica após configurar DATABASE_URL
    servico = await import("../../../src/services/agendamento_service.js");

    const usuario = await poolVerificacao.query(
      `INSERT INTO usuarios (nome, telefone)
         VALUES ($1, $2)
         RETURNING id`,
      ["Usuário Teste Integração", telefoneTeste],
    );

    usuarioId = Number(usuario.rows[0].id);

    const sessao = await poolVerificacao.query(
      `INSERT INTO sessoes
           (session_id, usuario_id)
         VALUES ($1, $2)
         RETURNING id`,
      [sessaoTeste, usuarioId],
    );

    sessaoId = Number(sessao.rows[0].id);
  });

  afterAll(async () => {
    try {
      if (usuarioId) {
        await poolVerificacao.query(
          "DELETE FROM usuarios WHERE id = $1 AND telefone = $2",
          [usuarioId, telefoneTeste],
        );
      }
    } finally {
      if (servico) {
        const { pool } = await import("../../../src/config/database.js");

        await pool.end();
      }

      await poolVerificacao.end();
    }
  });

  it("deve criar um agendamento real", async () => {
    const resultado = await servico.criarAgendamento({
      usuarioId,
      sessaoId,
      dataAgendamento,
      horario: horarioAgendamento,
    });

    expect(resultado.status).toBe("agendado");
    expect(Number(resultado.usuarioId)).toBe(usuarioId);

    agendamentoId = Number(resultado.id);

    expect(Number.isSafeInteger(agendamentoId)).toBe(true);
    expect(agendamentoId).toBeGreaterThan(0);
  });

  it("deve consultar o agendamento criado", async () => {
    expect(agendamentoId).toBeGreaterThan(0);

    const resultado = await servico.listarAgendamentosUsuario(usuarioId);

    expect(resultado.some((item) => Number(item.id) === agendamentoId)).toBe(
      true,
    );
  });

  it("deve impedir horário já ocupado", async () => {
    await expect(
      servico.criarAgendamento({
        usuarioId,
        sessaoId,
        dataAgendamento,
        horario: horarioAgendamento,
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
    });
  });

  it("deve cancelar o agendamento", async () => {
    expect(agendamentoId).toBeGreaterThan(0);

    const resultado = await servico.cancelarAgendamento(
      agendamentoId,
      usuarioId,
    );

    expect(resultado.status).toBe("cancelado");
  });

  it("deve permitir novo agendamento após cancelar", async () => {
    const resultado = await servico.criarAgendamento({
      usuarioId,
      sessaoId,
      dataAgendamento,
      horario: horarioAgendamento,
    });

    expect(resultado.status).toBe("agendado");
    expect(Number(resultado.id)).not.toBe(agendamentoId);
  });
});
