import type { Request, Response } from "express";
import { pool } from "../config/database.js";

function validarCPF(cpf: string): boolean {
  const numeros = cpf.replace(/\D/g, "");

  if (numeros.length !== 11) {
    return false;
  }

  // Rejeita CPFs formados pelo mesmo dígito repetido.
  if (/^(\d)\1{10}$/.test(numeros)) {
    return false;
  }

  const calcularDigito = (base: string, pesoInicial: number): number => {
    let soma = 0;

    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * (pesoInicial - i);
    }

    const resto = (soma * 10) % 11;

    return resto === 10 ? 0 : resto;
  };

  const primeiroDigito = calcularDigito(numeros.slice(0, 9), 10);
  const segundoDigito = calcularDigito(numeros.slice(0, 10), 11);

  return (
    primeiroDigito === Number(numeros[9]) &&
    segundoDigito === Number(numeros[10])
  );
}

export async function criarUsuario(req: Request, res: Response) {
  try {
    const { nome, telefone, cpf } = req.body;

    if (
      typeof nome !== "string" ||
      !nome.trim() ||
      typeof telefone !== "string" ||
      !telefone.trim() ||
      typeof cpf !== "string" ||
      !cpf.trim()
    ) {
      return res.status(400).json({
        erro: "Nome, telefone e CPF são obrigatórios.",
      });
    }

    const nomeNormalizado = nome.trim();
    const telefoneNormalizado = telefone.trim();
    const cpfNormalizado = cpf.replace(/\D/g, "");

    if (!validarCPF(cpfNormalizado)) {
      return res.status(400).json({
        erro: "CPF inválido. Confira os 11 dígitos informados.",
      });
    }

    // Procura cadastros que já utilizem o telefone ou o CPF.
    const existente = await pool.query(
      `SELECT id, nome, telefone, cpf, criado_em, atualizado_em
       FROM usuarios
       WHERE telefone = $1 OR cpf = $2`,
      [telefoneNormalizado, cpfNormalizado]
    );

    if (existente.rows.length > 0) {
      const usuario = existente.rows[0];

      // Não permite associar um telefone ou CPF a outra pessoa.
      const mesmosDados =
        existente.rows.length === 1 &&
        usuario.telefone === telefoneNormalizado &&
        usuario.cpf === cpfNormalizado;

      if (!mesmosDados) {
        return res.status(409).json({
          erro:
            "O telefone ou CPF informado já está associado a outro cadastro. Confira os dados.",
        });
      }

      return res.status(200).json(usuario);
    }

    const resultado = await pool.query(
      `INSERT INTO usuarios (nome, telefone, cpf)
       VALUES ($1, $2, $3)
       RETURNING id, nome, telefone, cpf, criado_em, atualizado_em`,
      [nomeNormalizado, telefoneNormalizado, cpfNormalizado]
    );

    return res.status(201).json(resultado.rows[0]);
  } catch (error: unknown) {
    // Trata duplicidades que possam ocorrer em cadastros simultâneos.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return res.status(409).json({
        erro: "Já existe um cadastro com esse telefone ou CPF.",
      });
    }

    // Não registra os dados pessoais do usuário nos logs.
    console.error("Erro ao cadastrar usuário.");

    return res.status(500).json({
      erro: "Não foi possível cadastrar o usuário.",
    });
  }
}

export async function obterUsuario(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: "ID de usuário inválido.",
      });
    }

    const resultado = await pool.query(
      `SELECT id, nome, telefone, cpf, criado_em, atualizado_em
       FROM usuarios
       WHERE id = $1`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        erro: "Usuário não encontrado.",
      });
    }

    return res.status(200).json(resultado.rows[0]);
  } catch (error: unknown) {
    console.error("Erro ao consultar usuário.");

    return res.status(500).json({
      erro: "Não foi possível consultar o usuário.",
    });
  }
}
