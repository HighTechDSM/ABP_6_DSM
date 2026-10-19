import { pool } from "../config/database.js";

export interface CriarUsuarioInput {
  nome: string;
  telefone: string;
}

export class ErroUsuario extends Error {
  constructor(
    mensagem: string,
    public readonly statusCode: number
  ) {
    super(mensagem);
    this.name = "ErroUsuario";
  }
}

export async function criarOuObterUsuario(input: CriarUsuarioInput) {
  const nome = input.nome.trim();
  const telefone = input.telefone.trim();

  if (!nome || !telefone) {
    throw new ErroUsuario("Nome e telefone são obrigatórios.", 400);
  }

  if (nome.length > 150) {
    throw new ErroUsuario(
      "O nome deve ter no máximo 150 caracteres.",
      400
    );
  }

  if (telefone.length > 20) {
    throw new ErroUsuario(
      "O telefone deve ter no máximo 20 caracteres.",
      400
    );
  }

  // Reutiliza o cadastro quando o telefone já existe.
  const existente = await pool.query(
    `SELECT id, nome, telefone, criado_em, atualizado_em
     FROM usuarios
     WHERE telefone = $1`,
    [telefone]
  );

  if (existente.rows.length > 0) {
    return {
      usuario: existente.rows[0],
      criado: false,
    };
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO usuarios (nome, telefone)
       VALUES ($1, $2)
       RETURNING id, nome, telefone, criado_em, atualizado_em`,
      [nome, telefone]
    );

    return {
      usuario: resultado.rows[0],
      criado: true,
    };
  } catch (error) {
    // Duas requisições simultâneas podem tentar cadastrar
    // o mesmo telefone. A restrição UNIQUE do banco protege os dados.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      const repetido = await pool.query(
        `SELECT id, nome, telefone, criado_em, atualizado_em
         FROM usuarios
         WHERE telefone = $1`,
        [telefone]
      );

      if (repetido.rows.length > 0) {
        return {
          usuario: repetido.rows[0],
          criado: false,
        };
      }
    }

    throw error;
  }
}

export async function buscarUsuarioPorId(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ErroUsuario("ID de usuário inválido.", 400);
  }

  const resultado = await pool.query(
    `SELECT id, nome, telefone, criado_em, atualizado_em
     FROM usuarios
     WHERE id = $1`,
    [id]
  );

  if (resultado.rows.length === 0) {
    throw new ErroUsuario("Usuário não encontrado.", 404);
  }

  return resultado.rows[0];
}
