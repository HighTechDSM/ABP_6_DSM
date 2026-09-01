// Faz as requisições HTTP (GET, POST, DELETE) para o backend.
import { API_BASE_URL } from '../config'

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return response.json()
  },

  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return response.json()
  },

  delete: async (endpoint: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE' })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  }
}