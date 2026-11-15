export type MessageStatus = 'sent' | 'delivered' | 'read'

export type Message = {
  id: string
  conversationId: string
  text: string
  createdAt: string
  direction: 'in' | 'out'
  status?: MessageStatus
}

export type Conversation = {
  id: string
  name: string
  phone: string
  avatarColor?: string
  online?: boolean
  unread?: number
  favorite?: boolean
  lastMessage?: string
  lastMessageAt?: string
}

export type BackendConversation = {
  sessionId: string
  nome: string
  telefone: string
  lastMessage: string
  lastMessageAt: string | null
}

export type BackendMessage = {
  id: number | string
  tipo: 'BOT' | 'USUARIO'
  mensagem: string
  etapa: string
  enviada_em: string
}

export type ChatResponse = {
  sessionId: string
  resposta: string
  aviso?: string | null
  tipo?: string
  etapa?: string
  perguntaAtual?: string
  categoria?: string | null
  finalizada?: boolean
  necessitaAgendamento?: boolean
  opcoes?: Record<string, unknown>
}
