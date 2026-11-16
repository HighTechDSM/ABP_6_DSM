import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../src/config/database.js", () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn(),
  },
}));

import { pool } from "../../../src/config/database.js";
import {
  criarAgendamento,
  listarAgendamentosUsuario,
  cancelarAgendamento,
  ErroAgendamento,
} from "../../../src/services/agendamento_service.js";

const queryMock = vi.mocked(pool.query);
const connectMock = vi.mocked(pool.connect);

describe("Serviço de agendamentos", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("Validação de agendamentos", () => {
    it("deve rejeitar um usuário inválido", async () => {
      await expect(
        criarAgendamento({
          usuarioId: 0,
          sessaoId: 1,
          dataAgendamento: "2026-10-26",
          horario: "09:00",
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
      });

      expect(connectMock).not.toHaveBeenCalled();
    });

    it("deve rejeitar uma sessão inválida", async () => {
      await expect(
        criarAgendamento({
          usuarioId: 1,
          sessaoId: -1,
          dataAgendamento: "2026-10-26",
          horario: "09:00",
        }),
      ).rejects.toBeInstanceOf(ErroAgendamento);

      expect(connectMock).not.toHaveBeenCalled();
    });

    it("deve rejeitar uma data fora do período permitido", async () => {
      await expect(
        criarAgendamento({
          usuarioId: 1,
          sessaoId: 2,
          dataAgendamento: "2026-11-16",
          horario: "09:00",
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
      });

      expect(connectMock).not.toHaveBeenCalled();
    });

    it("deve rejeitar um horário fora do expediente", async () => {
      await expect(
        criarAgendamento({
          usuarioId: 1,
          sessaoId: 2,
          dataAgendamento: "2026-10-26",
          horario: "20:00",
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
      });

      expect(connectMock).not.toHaveBeenCalled();
    });
  });

  describe("Consulta de agendamentos", () => {
    it("deve retornar os agendamentos de um usuário", async () => {
      const agendamentos = [
        {
          id: 10,
          usuario_id: 1,
          status: "agendado",
        },
      ];

      queryMock.mockResolvedValueOnce({
        rows: agendamentos,
      } as never);

      const resultado = await listarAgendamentosUsuario(1);

      expect(resultado).toEqual(agendamentos);
      expect(queryMock).toHaveBeenCalledWith(
        expect.stringContaining("FROM agendamentos"),
        [1],
      );
    });

    it("deve rejeitar a consulta com ID inválido", async () => {
      await expect(listarAgendamentosUsuario(-1)).rejects.toMatchObject({
        statusCode: 400,
      });

      expect(queryMock).not.toHaveBeenCalled();
    });
  });

  describe("Cancelamento de agendamentos", () => {
    it("deve cancelar um agendamento existente", async () => {
      const agendamento = {
        id: 10,
        usuario_id: 1,
        status: "cancelado",
      };

      queryMock.mockResolvedValueOnce({
        rows: [agendamento],
      } as never);

      const resultado = await cancelarAgendamento(10, 1);

      expect(resultado).toEqual(agendamento);
      expect(queryMock).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE agendamentos"),
        [10, 1],
      );
    });

    it("deve retornar erro 404 quando o agendamento não existir", async () => {
      queryMock.mockResolvedValueOnce({
        rows: [],
      } as never);

      await expect(cancelarAgendamento(999, 1)).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it("deve rejeitar um ID de agendamento inválido", async () => {
      await expect(cancelarAgendamento(0, 1)).rejects.toMatchObject({
        statusCode: 400,
      });

      expect(queryMock).not.toHaveBeenCalled();
    });

    it("deve propagar erros de consulta ao banco", async () => {
      queryMock.mockRejectedValueOnce(
        new Error("Falha simulada no PostgreSQL"),
      );

      await expect(cancelarAgendamento(10, 1)).rejects.toThrow(
        "Falha simulada no PostgreSQL",
      );
    });
  });

  describe("Transações de criação de agendamentos", () => {
    const input = {
      usuarioId: 1,
      sessaoId: 2,
      dataAgendamento: "2026-10-26",
      horario: "09:00",
    };

    const criarClienteMock = () => {
      const client = {
        query: vi.fn(),
        release: vi.fn(),
      };

      connectMock.mockResolvedValue(client as never);

      return client;
    };

    it("deve confirmar a transação quando o agendamento é criado", async () => {
      const client = criarClienteMock();

      const agendamento = {
        id: 10,
        usuarioId: 1,
        sessaoId: 2,
        status: "agendado",
      };

      client.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // Advisory lock
        .mockResolvedValueOnce({ rows: [{ id: 2 }] }) // Sessão
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Usuário
        .mockResolvedValueOnce({ rows: [] }) // Conflito de horário
        .mockResolvedValueOnce({ rows: [] }) // Agendamento existente
        .mockResolvedValueOnce({ rows: [agendamento] }) // INSERT
        .mockResolvedValueOnce({ rows: [] }); // COMMIT

      const resultado = await criarAgendamento(input);

      expect(resultado).toEqual(agendamento);
      expect(client.query).toHaveBeenCalledWith("COMMIT");
      expect(client.query).not.toHaveBeenCalledWith("ROLLBACK");
      expect(client.release).toHaveBeenCalledOnce();
    });

    it("deve executar ROLLBACK quando a sessão não existe", async () => {
      const client = criarClienteMock();

      client.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // Advisory lock
        .mockResolvedValueOnce({ rows: [] }) // Sessão não encontrada
        .mockResolvedValueOnce({ rows: [] }); // ROLLBACK

      await expect(criarAgendamento(input)).rejects.toMatchObject({
        statusCode: 404,
      });

      expect(client.query).toHaveBeenCalledWith("ROLLBACK");
      expect(client.query).not.toHaveBeenCalledWith("COMMIT");
      expect(client.release).toHaveBeenCalledOnce();
    });

    it("deve impedir a reserva de um horário ocupado", async () => {
      const client = criarClienteMock();

      client.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // Advisory lock
        .mockResolvedValueOnce({ rows: [{ id: 2 }] }) // Sessão
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Usuário
        .mockResolvedValueOnce({ rows: [{ id: 99 }] }) // Conflito
        .mockResolvedValueOnce({ rows: [] }); // ROLLBACK

      await expect(criarAgendamento(input)).rejects.toMatchObject({
        statusCode: 409,
      });

      expect(client.query).toHaveBeenCalledWith("ROLLBACK");
      expect(client.query).not.toHaveBeenCalledWith("COMMIT");
      expect(client.release).toHaveBeenCalledOnce();
    });

    it("deve liberar a conexão após uma falha no banco", async () => {
      const client = criarClienteMock();

      client.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockRejectedValueOnce(new Error("Falha simulada"))
        .mockResolvedValueOnce({ rows: [] }); // ROLLBACK

      await expect(criarAgendamento(input)).rejects.toThrow("Falha simulada");

      expect(client.query).toHaveBeenCalledWith("ROLLBACK");
      expect(client.release).toHaveBeenCalledOnce();
    });
  });
});
