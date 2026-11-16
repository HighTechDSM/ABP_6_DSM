
import { describe, it, expect, vi } from "vitest";
import request from "supertest";

vi.mock("../../../src/config/database.js", () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn(),
  },
}));

import app from "../../../src/app.js";

describe("API de Agendamentos", () => {
  describe("POST /api/agendamentos", () => {
    it("deve rejeitar um nome vazio", async () => {
      const response = await request(app)
        .post("/api/agendamentos")
        .send({
          nome: "",
          telefone: "12999999999",
          cpf: "12345678901",
          dataAgendamento: "2026-10-26",
          horario: "09:00",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("erro");
    });

    it("deve rejeitar um telefone inválido", async () => {
      const response = await request(app)
        .post("/api/agendamentos")
        .send({
          nome: "Maria Silva",
          telefone: "123",
          cpf: "12345678901",
          dataAgendamento: "2026-10-26",
          horario: "09:00",
        });

      expect(response.status).toBe(400);
    });

    it("deve rejeitar um CPF com quantidade incorreta de dígitos", async () => {
      const response = await request(app)
        .post("/api/agendamentos")
        .send({
          nome: "Maria Silva",
          telefone: "12999999999",
          cpf: "123",
          dataAgendamento: "2026-10-26",
          horario: "09:00",
        });

      expect(response.status).toBe(400);
    });

    it("deve rejeitar um horário fora do expediente", async () => {
      const response = await request(app)
        .post("/api/agendamentos")
        .send({
          nome: "Maria Silva",
          telefone: "12999999999",
          cpf: "12345678901",
          dataAgendamento: "2026-10-26",
          horario: "20:00",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/agendamentos/usuario/:usuarioId", () => {
    it("deve rejeitar um ID de usuário inválido", async () => {
      const response = await request(app)
        .get("/api/agendamentos/usuario/abc");

      expect(response.status).toBe(400);
    });
  });

  describe("PATCH /api/agendamentos/:id/cancelar", () => {
    it("deve rejeitar um ID de agendamento inválido", async () => {
      const response = await request(app)
        .patch("/api/agendamentos/abc/cancelar")
        .send({ usuarioId: 1 });

      expect(response.status).toBe(400);
    });

    it("deve rejeitar um ID de usuário inválido", async () => {
      const response = await request(app)
        .patch("/api/agendamentos/10/cancelar")
        .send({ usuarioId: -1 });

      expect(response.status).toBe(400);
    });
  });
});
