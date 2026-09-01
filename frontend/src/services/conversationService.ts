// Chama a API e trata erros (fallback).
import { conversationApi, type Conversation, type Message, } from '../api/conversation'

class ConversationService {
  async loadAll(): Promise<Conversation[]> {
    try {
      return await conversationApi.getAll()
    } catch {
      return [] // Fallback: backend offline
    }
  }

  async create(text: string): Promise<Conversation | null> {
    try {
      return await conversationApi.create({ text })
    } catch {
      return null // Fallback: backend offline
    }
  }

  async sendMessage(conversationId: string, text: string, direction: 'sent' | 'received'): Promise<Message | null> {
    try {
      return await conversationApi.addMessage(conversationId, { text, direction })
    } catch {
      return null // Fallback: backend offline
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await conversationApi.delete(id)
    } catch {
      // Silently fail
    }
  }
}

export const conversationService = new ConversationService()