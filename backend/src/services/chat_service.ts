
export interface ProcessarMensagemInput {
  sessionId: string;
  mensagem: string;
}

export interface RespostaChatbot {
  resposta: string;
  perguntaAtual: string | null;
  categoria: string | null;
  finalizada: boolean;
  necessitaAgendamento: boolean;
  tipo?: string;
  opcoes?: Record<string, unknown> | undefined;
  aviso?: string | undefined;
  respostaEncontrada?: boolean;
  fonte?: {
    id: string;
    assunto: string;
  } | null;
}

interface RespostaPython {
  tipo: string;
  mensagem: string;
  aviso?: string;
  id?: string;
  categoria?: string;
  opcoes?: Record<string, unknown>;
}

interface RespostaPythonAtendimento {
  sucesso: boolean;
  resposta: string;
  resposta_encontrada: boolean;
  aviso?: string;
  fonte?: {
    id: string;
    assunto: string;
  } | null;
  session_id?: string;
}

/**
 * Envia requisições para os endpoints Python dos fluxos antigos.
 */
async function chamarChatbotPython(
  endpoint: string,
  dados: Record<string, string>
): Promise<RespostaPython> {
  const baseUrl = process.env.CHATBOT_API_URL;

  if (!baseUrl) {
    throw new Error(
      "A variável CHATBOT_API_URL não foi configurada no .env."
    );
  }

  const url = `${baseUrl.replace(/\/+$/, "")}${endpoint}`;

  let respostaHttp: Response;

  try {
    respostaHttp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    console.error("Erro ao conectar ao chatbot Python:", error);

    throw new Error(
      "O chatbot Python não está acessível. Verifique se a API está funcionando."
    );
  }

  if (!respostaHttp.ok) {
    const detalhe = await respostaHttp.text();

    console.error(
      `Erro HTTP ${respostaHttp.status} no chatbot Python:`,
      detalhe
    );

    throw new Error(
      `O chatbot Python retornou um erro HTTP (${respostaHttp.status}).`
    );
  }

  const dadosResposta: unknown = await respostaHttp.json();

  if (
    typeof dadosResposta !== "object" ||
    dadosResposta === null ||
    !("tipo" in dadosResposta) ||
    typeof dadosResposta.tipo !== "string" ||
    !("mensagem" in dadosResposta) ||
    typeof dadosResposta.mensagem !== "string"
  ) {
    throw new Error(
      "A resposta da API Python não contém os campos esperados: tipo e mensagem."
    );
  }

  return dadosResposta as RespostaPython;
}

/**
 * Envia perguntas livres para o endpoint Python /chat/atendimento.
 */
async function chamarAtendimentoPython(
  sessionId: string,
  mensagem: string
): Promise<RespostaPythonAtendimento> {
  const baseUrl = process.env.CHATBOT_API_URL;

  if (!baseUrl) {
    throw new Error(
      "A variável CHATBOT_API_URL não foi configurada no .env."
    );
  }

  const url = `${baseUrl.replace(/\/+$/, "")}/chat/atendimento`;

  let respostaHttp: Response;

  try {
    respostaHttp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        mensagem,
      }),
      signal: AbortSignal.timeout(120000),
    });
  } catch (error) {
    console.error(
      "Erro ao conectar ao atendimento livre do chatbot Python:",
      error
    );

    throw new Error(
      "O chatbot Python não está acessível. Verifique se a API está funcionando."
    );
  }

  if (!respostaHttp.ok) {
    const detalhe = await respostaHttp.text();

    console.error(
      `Erro HTTP ${respostaHttp.status} no atendimento Python:`,
      detalhe
    );

    throw new Error(
      `O atendimento Python retornou um erro HTTP (${respostaHttp.status}).`
    );
  }

  const dadosResposta: unknown = await respostaHttp.json();

  if (
    typeof dadosResposta !== "object" ||
    dadosResposta === null ||
    !("sucesso" in dadosResposta) ||
    typeof dadosResposta.sucesso !== "boolean" ||
    !("resposta" in dadosResposta) ||
    typeof dadosResposta.resposta !== "string" ||
    !("resposta_encontrada" in dadosResposta) ||
    typeof dadosResposta.resposta_encontrada !== "boolean"
  ) {
    throw new Error(
      "A resposta do atendimento Python contém campos ausentes ou inválidos."
    );
  }

  return dadosResposta as RespostaPythonAtendimento;
}

/**
 * Inicia uma conversa na API Python.
 * Endpoint: POST /chat/iniciar
 */
export async function iniciarChatbot(
  sessionId: string
): Promise<RespostaPython> {
  return chamarChatbotPython("/chat/iniciar", {
    session_id: sessionId,
  });
}

/**
 * Seleciona uma categoria no fluxo antigo.
 * Endpoint: POST /chat/categoria
 */
export async function selecionarCategoriaChatbot(
  sessionId: string,
  mensagem: string
): Promise<RespostaChatbot> {
  const resultado = await chamarChatbotPython("/chat/categoria", {
    session_id: sessionId,
    mensagem,
  });

  return {
    resposta: resultado.mensagem,
    perguntaAtual: resultado.id ?? null,
    categoria: resultado.categoria ?? null,
    finalizada: resultado.tipo === "final",
    necessitaAgendamento: false,
    tipo: resultado.tipo,
    opcoes: resultado.opcoes,
    aviso: resultado.aviso,
  };
}

/**
 * Processa mensagens no fluxo antigo.
 * Endpoint: POST /chat/mensagem
 */
export async function processarMensagem({
  sessionId,
  mensagem,
}: ProcessarMensagemInput): Promise<RespostaChatbot> {
  const resultado = await chamarChatbotPython("/chat/mensagem", {
    session_id: sessionId,
    mensagem,
  });

  return {
    resposta: resultado.mensagem,
    perguntaAtual: resultado.id ?? null,
    categoria: resultado.categoria ?? null,
    finalizada: resultado.tipo === "final",
    necessitaAgendamento: false,
    tipo: resultado.tipo,
    opcoes: resultado.opcoes,
    aviso: resultado.aviso,
  };
}

/**
 * Processa uma pergunta livre do consumidor.
 * Endpoint: POST /chat/atendimento
 */
export async function atenderPerguntaLivre({
  sessionId,
  mensagem,
}: ProcessarMensagemInput): Promise<RespostaChatbot> {
  const resultado = await chamarAtendimentoPython(
    sessionId,
    mensagem
  );

  return {
    resposta: resultado.resposta,
    perguntaAtual: null,
    categoria: null,
    finalizada: false,
    necessitaAgendamento: !resultado.resposta_encontrada,
    tipo: "atendimento",
    ...(resultado.aviso !== undefined
      ? { aviso: resultado.aviso }
      : {}),
    respostaEncontrada: resultado.resposta_encontrada,
    fonte: resultado.fonte ?? null,
  };
}
