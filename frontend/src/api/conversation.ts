// Define os endpoints que o backend precisa implementar.
import { api } from './client'

export type Message = {
  id: string
  text: string
  time: string
  direction: 'sent' | 'received'
  status?: 'sent' | 'read'
}

export type Conversation = {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: Message[]
}

export const conversationApi = {
  getAll: () => api.get<Conversation[]>('/conversations'),
  create: (data: { text: string }) => api.post<Conversation>('/conversations', data),
  addMessage: (id: string, data: { text: string; direction: 'sent' | 'received' }) => 
    api.post<Message>(`/conversations/${id}/messages`, data),
  delete: (id: string) => api.delete(`/conversations/${id}`)
}