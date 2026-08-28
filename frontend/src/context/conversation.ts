import { createContext } from 'react'

export interface ConversationMessage {
  id: string
  text: string
  time: string
  direction: 'sent' | 'received'
  status?: 'sent' | 'read'
}

export interface ConversationSession {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: ConversationMessage[]
}

export interface ConversationContextValue {
  conversations: ConversationSession[]
  activeConversation: ConversationSession | null
  activeConversationId: string | null
  sendMessage: (text: string) => void
  receiveMessage: (text: string) => void
  startNewConversation: () => void
  selectConversation: (conversationId: string) => void
  clearActiveConversation: () => void
}

const ConversationContext = createContext<ConversationContextValue | undefined>(undefined)

export default ConversationContext
