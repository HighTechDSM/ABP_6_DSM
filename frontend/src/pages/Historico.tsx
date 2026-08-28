import { useState } from 'react'
import { Link } from 'react-router-dom'
import ChatMessage from '../components/ChatMessage'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import useConversation from '../hooks/useConversation'

function formatConversationTime(timestamp: number) {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(timestamp)
}

function Historico() {
  const { conversations, activeConversationId, selectConversation, startNewConversation } = useConversation()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(activeConversationId)
  const selectedConversation = conversations.find((conversation) => conversation.id === selectedConversationId) ?? conversations[0] ?? null

  return (
    <div className="page-stack history-page">
      <PageHeader
        eyebrow="Sessão atual"
        title="Histórico"
        description="Consulte separadamente as mensagens enviadas e recebidas em cada conversa."
        action={<Link className="button button--primary history-page__new" to="/conversa" onClick={startNewConversation}><Icon name="message-circle" size={17} /> Nova conversa</Link>}
      />

      {conversations.length === 0 ? (
        <section className="history-panel" aria-label="Histórico da sessão">
          <div className="history-empty">
            <span><Icon name="history" size={27} /></span>
            <h3>O histórico está vazio</h3>
            <p>As mensagens aparecerão aqui depois que uma conversa for iniciada.</p>
          </div>
        </section>
      ) : (
        <div className="history-workspace">
          <aside className="history-conversations" aria-label="Conversas da sessão">
            <header>
              <div><span className="section-kicker">Atendimentos</span><h2>Conversas</h2></div>
              <span>{conversations.length}</span>
            </header>
            <div className="history-conversations__list">
              {conversations.map((conversation, index) => {
                const isSelected = conversation.id === selectedConversation.id
                return (
                  <button
                    className={`history-conversation-card${isSelected ? ' active' : ''}`}
                    key={conversation.id}
                    type="button"
                    onClick={() => setSelectedConversationId(conversation.id)}
                    aria-pressed={isSelected}
                  >
                    <span className="history-conversation-card__index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="history-conversation-card__content">
                      <strong>{conversation.title}</strong>
                      <small>{conversation.messages.length} {conversation.messages.length === 1 ? 'mensagem' : 'mensagens'} · {formatConversationTime(conversation.updatedAt)}</small>
                    </span>
                    <Icon name="chevron-right" size={16} />
                  </button>
                )
              })}
            </div>
          </aside>

          <section className="history-detail" aria-label={`Mensagens de ${selectedConversation.title}`}>
            <header className="history-detail__header">
              <div>
                <span className="history-panel__icon"><Icon name="message-circle" size={20} /></span>
                <div><span className="section-kicker">Conversa selecionada</span><h2>{selectedConversation.title}</h2></div>
              </div>
              <Link className="history-detail__continue" to="/conversa" onClick={() => selectConversation(selectedConversation.id)}>Continuar conversa <Icon name="chevron-right" size={15} /></Link>
            </header>
            <div className="history-list">
              <div className="conversation-day-divider"><span>Hoje</span></div>
              {selectedConversation.messages.map((message) => (
                <ChatMessage key={message.id} text={message.text} time={message.time} direction={message.direction} status={message.status} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default Historico
