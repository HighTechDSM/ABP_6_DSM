import { describe, it, expect } from "vitest";

const API_URL = "https://api-python-7l6j.onrender.com";

describe("Testes funcionais da API Python", () => {
  it("deve identificar uma reclamação de produto com defeito", async () => {
    const response = await fetch(`${API_URL}/ia/classificar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        texto: "Comprei um celular que apresentou defeito depois de uma semana. Quais são meus direitos?",
      }),
      signal: AbortSignal.timeout(60000),
    });

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data.intencao).toBe("produto_defeito");
    expect(data.confianca).toBeGreaterThanOrEqual(0);
    expect(data.confianca).toBeLessThanOrEqual(1);
  });

  it("deve rejeitar requisições sem o campo texto", async () => {
    const response = await fetch(`${API_URL}/ia/classificar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      signal: AbortSignal.timeout(60000),
    });

    expect(response.status).toBe(422);
  });

  it("deve retornar uma resposta estruturada na busca de conhecimento", async () => {
    const response = await fetch(
      `${API_URL}/ia/buscar-conhecimento`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texto: "Qual é o prazo de garantia de um produto eletrônico?",
        }),
        signal: AbortSignal.timeout(60000),
      },
    );

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(typeof data.encontrado).toBe("boolean");
    expect(typeof data.mensagem).toBe("string");
    expect(typeof data.similaridade).toBe("number");
  });
});