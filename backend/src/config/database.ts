import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "A variável DATABASE_URL não foi configurada no arquivo .env."
  );
}

export const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
  ssl:
    process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: false }
      : undefined,
});

pool.on("error", (error) => {
  console.error("Erro inesperado na conexão PostgreSQL:", error);
});

/**
 * Verifica se o banco está acessível.
 * Pode ser chamada na inicialização do servidor.
 */
export async function testarConexao(): Promise<void> {
  const resultado = await pool.query("SELECT NOW() AS horario");
  console.log(
    "Conexão com PostgreSQL estabelecida:",
    resultado.rows[0].horario
  );
}

/**
 * Encerra o pool de conexões.
 */
export async function fecharConexao(): Promise<void> {
  await pool.end();
}
