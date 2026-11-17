
import { describe, it, expect } from "vitest";
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.test" });

describe("Conexão PostgreSQL - Supabase", () => {
  it("deve conectar ao banco de testes", async () => {
    const connectionString = process.env.TEST_DATABASE_URL;

    if (!connectionString) {
      throw new Error("TEST_DATABASE_URL não configurada.");
    }

    const pool = new pg.Pool({
      connectionString,
      connectionTimeoutMillis: 10000,
      max: 2,
    });

    try {
      const resultado = await pool.query(
        "SELECT 1 AS resultado",
      );

      expect(resultado.rows[0].resultado).toBe(1);
    } finally {
      await pool.end();
    }
  });
});
