
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";

describe("GET /api/health", () => {
  it("deve retornar status 200 e confirmar que a API está funcionando", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "ok",
      message: "API do chatbot PROCON funcionando!",
    });
  });
});
