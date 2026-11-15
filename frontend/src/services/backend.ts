
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";


// TRATAMENTO DAS RESPOSTAS DA API
const handleResponse = async <T>(
  response: Response,
): Promise<T> => {
  if (!response.ok) {
    const errorData: unknown = await response
      .json()
      .catch(() => ({}));

    let mensagem = `Erro ${response.status}: ${response.statusText}`;

    if (typeof errorData === "object" && errorData !== null) {
      const dados = errorData as Record<string, unknown>;

      const descricao =
        dados.erro ?? dados.error ?? dados.message;

      if (typeof descricao === "string" && descricao) {
        mensagem = descricao;
      }
    }

    throw new Error(mensagem);
  }

  // Respostas sem conteúdo
  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
};


// REQUISIÇÕES HTTP
const fetchWithError = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  try {
    const response = await fetch(url, options);

    return await handleResponse<T>(response);
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
};


// CONFIGURAÇÕES PARA ENVIO DE JSON
const jsonOptions = (
  method: string,
  body: unknown,
): RequestInit => ({
  method,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});


// TIPOS DOS AGENDAMENTOS
export type NovoAgendamento = {
  name: string;
  phone: string;
  cpf: string;
  date: string;
  time: string;
};

export type Agendamento = {
  id: string | number;
  usuarioId: number;
  sessaoId?: number;
  name: string;
  phone: string;
  cpf: string;
  date: string;
  time: string;
  status: string;
  criadoEm?: string;
};

// SERVIÇOS DA API
export const backend = {

  // AGENDAMENTOS
  agendamentos: {
    // Listar todos os agendamentos
    list: async (): Promise<Agendamento[]> => {
      return fetchWithError<Agendamento[]>(
        `${API_URL}/agendamentos`,
      );
    },

    // Criar um novo agendamento
    create: async (
      data: NovoAgendamento,
    ): Promise<Agendamento> => {
      return fetchWithError<Agendamento>(
        `${API_URL}/agendamentos`,
        jsonOptions("POST", data),
      );
    },

    // Cancelar um agendamento existente
    cancel: async (
      id: string | number,
      usuarioId: number,
    ): Promise<unknown> => {
      return fetchWithError<unknown>(
        `${API_URL}/agendamentos/${id}/cancelar`,
        jsonOptions("PATCH", { usuarioId }),
      );
    },
  },

  // DISPONIBILIDADE
  availability: {
    // Listar todas as disponibilidades
    list: async (): Promise<unknown> => {
      return fetchWithError<unknown>(
        `${API_URL}/availability`,
      );
    },

    // Consultar disponibilidade por período
    getByRange: async (
      startDate: string,
      endDate: string,
    ): Promise<unknown> => {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });

      return fetchWithError<unknown>(
        `${API_URL}/availability/range?${params.toString()}`,
      );
    },

    // Criar uma nova disponibilidade
    create: async (
      data: unknown,
    ): Promise<unknown> => {
      return fetchWithError<unknown>(
        `${API_URL}/availability`,
        jsonOptions("POST", data),
      );
    },

    // Atualizar uma disponibilidade existente
    update: async (
      id: string,
      data: unknown,
    ): Promise<unknown> => {
      return fetchWithError<unknown>(
        `${API_URL}/availability/${id}`,
        jsonOptions("PUT", data),
      );
    },

    // Alternar o status de disponibilidade
    toggleStatus: async (
      id: string,
    ): Promise<unknown> => {
      return fetchWithError<unknown>(
        `${API_URL}/availability/${id}/toggle`,
        {
          method: "PATCH",
        },
      );
    },

    // Excluir uma disponibilidade
    delete: async (
      id: string,
    ): Promise<unknown> => {
      return fetchWithError<unknown>(
        `${API_URL}/availability/${id}`,
        {
          method: "DELETE",
        },
      );
    },
  },
};
