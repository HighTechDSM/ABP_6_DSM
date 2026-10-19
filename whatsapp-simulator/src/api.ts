import type {
  BackendConversation,
  BackendMessage,
  ChatResponse,
  Conversation,
  Message,
} from './types'

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Usa a URL configurada no .env do frontend.
// Se ela não existir, utiliza a porta padrão do backend.
const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:3001'
).replace(/\/+$/, '')

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  const responseText = await response.text()

  if (!response.ok) {
    let detail = responseText

    try {
      const body = JSON.parse(responseText)
      detail = body.erro || body.message || responseText
    } catch {
      // Mantém o texto original caso a resposta não seja JSON.
    }

    throw new Error(
      detail || `Erro da API: ${response.status}`,
    )
  }

  if (!responseText) {
    return undefined as T
  }

  try {
    return JSON.parse(responseText) as T
  } catch {
    throw new Error('A API retornou uma resposta inválida.')
  }
}

function mapConversation(
  item: BackendConversation,
): Conversation {
  return {
    id: item.sessionId,
    name: 'PROCON',
    phone: item.telefone || '',
    lastMessage: item.lastMessage || '',
    lastMessageAt: item.lastMessageAt || undefined,
    avatarColor: '#bdd7cf',
    online: false,
    unread: 0,
    favorite: false,
  }
}

function mapMessage(
  item: BackendMessage,
  conversationId: string,
): Message {
  return {
    id: String(item.id),
    conversationId,
    text: item.mensagem,
    createdAt: item.enviada_em,
    direction: item.tipo === 'BOT' ? 'in' : 'out',
    status: item.tipo === 'USUARIO' ? 'read' : undefined,
  }
}

export const chatApi = {
  async getConversations(): Promise<Conversation[]> {
    const items = await request<BackendConversation[]>(
      '/api/chat/conversas',
    )

    return items.map(mapConversation)
  },

  async getMessages(
    conversationId: string,
  ): Promise<Message[]> {
    const items = await request<BackendMessage[]>(
      `/api/chat/${encodeURIComponent(conversationId)}/historico`,
    )

    return items.map((item) =>
      mapMessage(item, conversationId),
    )
  },

  async createConversation(): Promise<{
    conversation: Conversation
    initialMessages: Message[]
  }> {
    const result = await request<
      ChatResponse & { etapa: string }
    >('/api/chat/iniciar', {
      method: 'POST',
    })

    const conversation: Conversation = {
      id: result.sessionId,
      name: 'PROCON',
      phone: '',
      lastMessage: result.resposta,
      lastMessageAt: new Date().toISOString(),
      avatarColor: '#bdd7cf',
      online: false,
      unread: 0,
      favorite: false,
    }

    // Busca a mensagem inicial persistida no banco.
    const initialMessages = await this.getMessages(
      result.sessionId,
    )

    return {
      conversation,
      initialMessages,
    }
  },

  async sendMessage(
    conversationId: string,
    text: string,
  ): Promise<ChatResponse> {
    return request<ChatResponse>('/api/chat/mensagem', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: conversationId,
        mensagem: text,
      }),
    })
  },
}
