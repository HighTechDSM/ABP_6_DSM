export interface ChatMessageProps {
  text: string
  time: string
  direction: 'sent' | 'received'
  status?: 'sent' | 'read'
}

function ChatMessage({ text, time, direction, status }: ChatMessageProps) {
  const isSent = direction === 'sent'

  return (
    <article className={`chat-message chat-message--${direction}`} aria-label={isSent ? 'Mensagem enviada' : 'Mensagem recebida'}>
      <p>{text}</p>
      <footer>
        <time>{time}</time>
        {isSent && (
          <span className={`chat-message__status${status === 'read' ? ' chat-message__status--read' : ''}`} aria-label={status === 'read' ? 'Mensagem lida' : 'Mensagem enviada'}>
            <svg aria-hidden="true" fill="none" height="13" viewBox="0 0 19 13" width="19">
              <path d="m1.5 6.7 3 3L10.8 3.4M8.1 8.8l1 1 7.1-7.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </span>
        )}
      </footer>
    </article>
  )
}

export function SentMessage(props: Omit<ChatMessageProps, 'direction'>) {
  return <ChatMessage {...props} direction="sent" />
}

export function ReceivedMessage(props: Omit<ChatMessageProps, 'direction' | 'status'>) {
  return <ChatMessage {...props} direction="received" />
}

export default ChatMessage
