// Serviço para conectar com o backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Função auxiliar para tratar erros
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.error || errorData.message || `Erro ${response.status}: ${response.statusText}`
    throw new Error(errorMessage)
  }
  return response.json()
}

// Função auxiliar para fazer requisições com try/catch
const fetchWithError = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options)
    return await handleResponse(response)
  } catch (error) {
    console.error('🔴 Erro na requisição:', error)
    throw error
  }
}

export const backend = {
  appointments: {
    // Listar agendamentos com filtros
    list: async (filters?: any) => {
      try {
        const params = filters ? '?' + new URLSearchParams(filters).toString() : ''
        return await fetchWithError(`${API_URL}/appointments${params}`)
      } catch (error) {
        console.error('❌ Erro ao listar agendamentos:', error)
        throw error
      }
    },

    // Buscar agendamento por ID
    getById: async (id: string) => {
      try {
        return await fetchWithError(`${API_URL}/appointments/${id}`)
      } catch (error) {
        console.error(`❌ Erro ao buscar agendamento ${id}:`, error)
        throw error
      }
    },

    // Criar novo agendamento
    create: async (data: any) => {
      try {
        return await fetchWithError(`${API_URL}/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
      } catch (error) {
        console.error('❌ Erro ao criar agendamento:', error)
        throw error
      }
    },

    // Atualizar agendamento completo
    update: async (id: string, data: any) => {
      try {
        return await fetchWithError(`${API_URL}/appointments/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
      } catch (error) {
        console.error(`❌ Erro ao atualizar agendamento ${id}:`, error)
        throw error
      }
    },

    // Atualizar apenas o status do agendamento
    updateStatus: async (id: string, status: string) => {
      try {
        return await fetchWithError(`${API_URL}/appointments/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        })
      } catch (error) {
        console.error(`❌ Erro ao atualizar status do agendamento ${id}:`, error)
        throw error
      }
    },

    // Remover agendamento
    delete: async (id: string) => {
      try {
        return await fetchWithError(`${API_URL}/appointments/${id}`, {
          method: 'DELETE'
        })
      } catch (error) {
        console.error(`❌ Erro ao remover agendamento ${id}:`, error)
        throw error
      }
    }
  },

  availability: {
    // Listar todas as disponibilidades
    list: async () => {
      try {
        return await fetchWithError(`${API_URL}/availability`)
      } catch (error) {
        console.error('❌ Erro ao listar disponibilidade:', error)
        throw error
      }
    },

    // Buscar disponibilidade por período
    getByRange: async (startDate: string, endDate: string) => {
      try {
        const params = new URLSearchParams({ startDate, endDate }).toString()
        return await fetchWithError(`${API_URL}/availability/range?${params}`)
      } catch (error) {
        console.error(`❌ Erro ao buscar disponibilidade por período (${startDate} - ${endDate}):`, error)
        throw error
      }
    },

    // Criar período de disponibilidade
    create: async (data: any) => {
      try {
        return await fetchWithError(`${API_URL}/availability`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
      } catch (error) {
        console.error('❌ Erro ao criar período de disponibilidade:', error)
        throw error
      }
    },

    // Atualizar período de disponibilidade
    update: async (id: string, data: any) => {
      try {
        return await fetchWithError(`${API_URL}/availability/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
      } catch (error) {
        console.error(`❌ Erro ao atualizar período ${id}:`, error)
        throw error
      }
    },

    // Alternar status do período (ativo/inativo)
    toggleStatus: async (id: string) => {
      try {
        return await fetchWithError(`${API_URL}/availability/${id}/toggle`, {
          method: 'PATCH'
        })
      } catch (error) {
        console.error(`❌ Erro ao alternar status do período ${id}:`, error)
        throw error
      }
    },

    // Remover período de disponibilidade
    delete: async (id: string) => {
      try {
        return await fetchWithError(`${API_URL}/availability/${id}`, {
          method: 'DELETE'
        })
      } catch (error) {
        console.error(`❌ Erro ao remover período ${id}:`, error)
        throw error
      }
    }
  }
}

