import { useContext } from 'react'
import ConversationContext from '../context/conversation'

function useConversation() {
  const context = useContext(ConversationContext)

  if (!context) {
    throw new Error('useConversation deve ser usado dentro de ConversationProvider')
  }

  return context
}

export default useConversation
