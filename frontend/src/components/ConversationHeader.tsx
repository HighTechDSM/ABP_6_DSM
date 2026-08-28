import logo from '../assets/procon-logo.jpg'
import Icon from './Icon'

interface ConversationHeaderProps {
  hasMessages: boolean
  onClear: () => void
}

function ConversationHeader({ hasMessages, onClear }: ConversationHeaderProps) {
  return (
    <header className="conversation-header">
      <div className="conversation-header__identity">
        <span className="conversation-header__avatar"><img src={logo} alt="" /></span>
        <div>
          <h2>Assistente PROCON</h2>
          <p><span aria-hidden="true" /> Canal de orientação</p>
        </div>
      </div>

      <button
        className="conversation-header__action"
        type="button"
        onClick={onClear}
        disabled={!hasMessages}
        title={hasMessages ? 'Limpar mensagens desta conversa' : 'Não há mensagens para limpar'}
      >
        <Icon name="more-vertical" size={21} />
        <span className="sr-only">Limpar conversa</span>
      </button>
    </header>
  )
}

export default ConversationHeader
