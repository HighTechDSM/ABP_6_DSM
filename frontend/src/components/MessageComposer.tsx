import { useState, type FormEvent, type KeyboardEvent } from 'react'
import Icon from './Icon'

interface MessageComposerProps {
  onSend: (message: string) => void
}

function MessageComposer({ onSend }: MessageComposerProps) {
  const [message, setMessage] = useState('')
  const normalizedMessage = message.trim()

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!normalizedMessage) return

    onSend(normalizedMessage)
    setMessage('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <form className="message-composer" onSubmit={submitMessage}>
      <label className="message-composer__field" htmlFor="chat-message">
        <span className="sr-only">Digite uma mensagem</span>
        <textarea
          id="chat-message"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          maxLength={1200}
          placeholder="Digite uma mensagem"
        />
      </label>
      <button className="message-composer__send" type="submit" disabled={!normalizedMessage} aria-label="Enviar mensagem">
        <Icon name="send" size={21} />
      </button>
    </form>
  )
}

export default MessageComposer
