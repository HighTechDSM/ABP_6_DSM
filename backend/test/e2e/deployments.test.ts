
import { describe, expect, it } from "vitest";

const URLS = {
  frontendChatbot: "https://abp-6-dsm-fa8e.vercel.app/",
  frontendAgendamentos: "https://abp-6-dsm.vercel.app/",
  backend: "https://abp-6-dsm.onrender.com",
  apiPython: "https://api-python-7l6j.onrender.com",
};

async function verificarEndpoint(
  url: string,
  tipoConteudo?: string,
) {
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    signal: AbortSignal.timeout(60000),
  });

  expect(
    response.status,
    `Falha ao acessar ${url}: HTTP ${response.status}`,
  ).toBe(200);

  if (tipoConteudo) {
    expect(response.headers.get("content-type"))
      .toContain(tipoConteudo);
  }
}

describe("Disponibilidade dos sistemas hospedados", () => {
  it("deve acessar o frontend do chatbot", async () => {
    await verificarEndpoint(
      URLS.frontendChatbot,
      "text/html",
    );
  });

  it("deve acessar o frontend de agendamentos", async () => {
    await verificarEndpoint(
      URLS.frontendAgendamentos,
      "text/html",
    );
  });

  it("deve acessar o backend Node.js no Render", async () => {
    await verificarEndpoint(
      `${URLS.backend}/api/health`,
    );
  });

  it("deve acessar a API Python no Render", async () => {
    await verificarEndpoint(
      `${URLS.apiPython}/`,
    );
  });
});
