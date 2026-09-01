// Depois com o backend pronto, a lógica de adicionar mensagens e conversas será feita no backend.

import { useCallback, useMemo, useState, type ReactNode } from 'react'
import ConversationContext, { type ConversationMessage, type ConversationSession } from '../context/conversation'

interface ConversationProviderProps {
  children: ReactNode
}

function createMessage(text: string, direction: ConversationMessage['direction']): ConversationMessage {
  const now = new Date()

  return {
    id: crypto.randomUUID(),
    text,
    direction,
    status: direction === 'sent' ? 'sent' : undefined,
    time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  }
}

function createConversation(text: string, direction: ConversationMessage['direction']): ConversationSession {
  const timestamp = Date.now()
  const normalizedTitle = text.replace(/\s+/g, ' ').trim()
  const title = normalizedTitle.length > 44 ? `${normalizedTitle.slice(0, 44)}…` : normalizedTitle

  return {
    id: crypto.randomUUID(),
    title,
    createdAt: timestamp,
    updatedAt: timestamp,
    messages: [createMessage(text, direction)],
  }
}

function ConversationProvider({ children }: ConversationProviderProps) {
  const [conversations, setConversations] = useState<ConversationSession[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  const addMessage = useCallback((text: string, direction: ConversationMessage['direction']) => {
    if (!activeConversationId) {
      const conversation = createConversation(text, direction)
      setConversations((current) => [conversation, ...current])
      setActiveConversationId(conversation.id)
      return
    }

    setConversations((current) => {
      const message = createMessage(text, direction)
      const updatedAt = Date.now()

      return current
        .map((conversation) => conversation.id === activeConversationId
          ? { ...conversation, updatedAt, messages: [...conversation.messages, message] }
          : conversation)
        .sort((first, second) => second.updatedAt - first.updatedAt)
    })
  }, [activeConversationId])

  const sendMessage = useCallback((text: string) => addMessage(text, 'sent'), [addMessage])

  const receiveMessage = useCallback((text: string) => addMessage(text, 'received'), [addMessage])

  const startNewConversation = useCallback(() => setActiveConversationId(null), [])

  const selectConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId)
  }, [])

  const clearActiveConversation = useCallback(() => {
    if (!activeConversationId) return

    setConversations((current) => current.filter((conversation) => conversation.id !== activeConversationId))
    setActiveConversationId(null)
  }, [activeConversationId])

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  )
  const value = useMemo(
    () => ({
      conversations,
      activeConversation,
      activeConversationId,
      sendMessage,
      receiveMessage,
      startNewConversation,
      selectConversation,
      clearActiveConversation,
    }),
    [conversations, activeConversation, activeConversationId, sendMessage, receiveMessage, startNewConversation, selectConversation, clearActiveConversation],
  )

  return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>
}

export default ConversationProvider

