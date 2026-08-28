import { useEffect, useMemo, useRef } from 'react'
import ConversationHeader from '../components/ConversationHeader'
import MessageComposer from '../components/MessageComposer'
import ChatMessage from '../components/ChatMessage'
import Icon from '../components/Icon'
import useConversation from '../hooks/useConversation'

function Conversa() {
  const { activeConversation, sendMessage, startNewConversation, clearActiveConversation } = useConversation()
  const messages = useMemo(() => activeConversation?.messages ?? [], [activeConversation])
  const historyEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  return (
    <div className="conversation-page">
      <header className="conversation-page__intro">
        <div>
          <span className="page-heading__eyebrow">Atendimento digital</span>
          <h1>Conversa</h1>
          <p>Envie mensagens pelo canal de orientação do PROCON e acompanhe o atendimento desta sessão.</p>
        </div>
        {messages.length > 0 && (
          <button className="button button--secondary conversation-page__new" type="button" onClick={startNewConversation}>
            <Icon name="message-circle" size={17} /> Nova conversa
          </button>
        )}
      </header>

      <section className="conversation-shell" aria-label="Canal de conversa do PROCON">
        <ConversationHeader hasMessages={messages.length > 0} onClear={clearActiveConversation} />

        <div className="conversation-history" aria-live="polite" aria-label="Histórico da conversa">
          {messages.length === 0 ? (
            <div className="conversation-empty">
              <span><Icon name="message-circle" size={28} /></span>
              <h3>Nenhuma mensagem nesta sessão</h3>
              <p>Digite uma mensagem no campo abaixo para iniciar o atendimento.</p>
              <small><Icon name="shield" size={14} /> As orientações não substituem o atendimento formal do PROCON.</small>
            </div>
          ) : (
            <div className="conversation-history__content">
              <div className="conversation-day-divider"><span>Hoje</span></div>
              {messages.map((message) => (
                <ChatMessage key={message.id} text={message.text} time={message.time} direction={message.direction} status={message.status} />
              ))}
            </div>
          )}
          <div ref={historyEndRef} />
        </div>

        <MessageComposer onSend={sendMessage} />
      </section>

      <p className="conversation-page__note">Cada nova conversa recebe um histórico próprio na página Histórico.</p>
    </div>
  )
}

export default Conversa
