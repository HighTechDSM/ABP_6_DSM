
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))

    throw new Error(
      errorData.erro ||
        errorData.error ||
        errorData.message ||
        `Erro ${response.status}: ${response.statusText}`,
    )
  }

  if (response.status === 204) return null

  return response.json()
}

const fetchWithError = async (
  url: string,
  options?: RequestInit,
): Promise<any> => {
  try {
    const response = await fetch(url, options)
    return await handleResponse(response)
  } catch (error) {
    console.error('Erro na requisição:', error)
    throw error
  }
}

const jsonOptions = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export type NovoAgendamento = {
  name: string
  phone: string
  cpf: string
  date: string
  time: string
}

export type Agendamento = {
  id: string | number
  usuarioId: number
  sessaoId?: number
  name: string
  phone: string
  cpf: string
  date: string
  time: string
  status: string
  criadoEm?: string
}

export const backend = {
  agendamentos: {
    list: async (): Promise<Agendamento[]> => {
      return fetchWithError(`${API_URL}/agendamentos`)
    },

    create: async (data: NovoAgendamento): Promise<Agendamento> => {
      return fetchWithError(
        `${API_URL}/agendamentos`,
        jsonOptions('POST', data),
      )
    },

    cancel: async (
      id: string | number,
      usuarioId: number,
    ): Promise<unknown> => {
      return fetchWithError(
        `${API_URL}/agendamentos/${id}/cancelar`,
        jsonOptions('PATCH', { usuarioId }),
      )
    },
  },

  availability: {
    list: async (): Promise<any> => {
      return fetchWithError(`${API_URL}/availability`)
    },

    getByRange: async (
      startDate: string,
      endDate: string,
    ): Promise<any> => {
      const params = new URLSearchParams({ startDate, endDate })

      return fetchWithError(
        `${API_URL}/availability/range?${params.toString()}`,
      )
    },

    create: async (data: unknown): Promise<any> => {
      return fetchWithError(
        `${API_URL}/availability`,
        jsonOptions('POST', data),
      )
    },

    update: async (id: string, data: unknown): Promise<any> => {
      return fetchWithError(
        `${API_URL}/availability/${id}`,
        jsonOptions('PUT', data),
      )
    },

    toggleStatus: async (id: string): Promise<any> => {
      return fetchWithError(
        `${API_URL}/availability/${id}/toggle`,
        { method: 'PATCH' },
      )
    },

    delete: async (id: string): Promise<any> => {
      return fetchWithError(
        `${API_URL}/availability/${id}`,
        { method: 'DELETE' },
      )
    },
  },
}
