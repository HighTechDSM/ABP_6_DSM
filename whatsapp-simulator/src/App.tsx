import { FormEvent, KeyboardEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { chatApi } from './api'
import type { Conversation, Message } from './types'

type Connection = 'checking' | 'connected' | 'error'
type Filter = 'all' | 'unread' | 'favorites'
type IconName = 'chat' | 'search' | 'plus' | 'more' | 'phone' | 'video' | 'paperclip' | 'smile' | 'send' | 'mic' | 'spark' | 'check' | 'checkDouble' | 'close' | 'back' | 'refresh' | 'pin' | 'dots' | 'arrow'

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const shapes: Record<IconName, ReactNode> = {
    chat: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.4 2.8a2 2 0 0 1-.6 1.7L7 10a16 16 0 0 0 6 6l1.8-1.9a2 2 0 0 1 1.7-.6l2.8.4a2 2 0 0 1 1.7 2Z" /></>,
    video: <><rect x="3" y="5" width="13" height="14" rx="2" /><path d="m16 10 5-3v10l-5-3" /></>,
    paperclip: <><path d="m21.4 11.1-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8l9.2-9.2a3.7 3.7 0 0 1 5.2 5.2l-9.2 9.2a1.8 1.8 0 0 1-2.6-2.6l8.5-8.5" /></>,
    smile: <><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    checkDouble: <><path d="m2 12 4 4L16 6M9 12l4 4L23 6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    back: <><path d="m15 18-6-6 6-6" /></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.5 9a7 7 0 0 1 11.6-2L20 12M4 12l2.9 5a7 7 0 0 0 11.6-2" /></>,
    pin: <><path d="m16 3 5 5-4 1-4 4-1 5-2-2-5 5-2-2 5-5-2-2 5-1 4-4 1-4Z" /></>,
    dots: <><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function parseDate(value?: string): Date | null {
  if (!value) return null

  const normalized = value.trim().replace(' ', 'T')

  // Se a API não informar o fuso, interpreta o valor como UTC.
  const hasTimezone = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i.test(normalized)

  const date = new Date(
    hasTimezone ? normalized : `${normalized}Z`
  )

  return Number.isNaN(date.getTime()) ? null : date
}

function formatMessageTime(value?: string): string {
  const date = parseDate(value)

  if (!date) return ''

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(date)
}

function formatConversationTime(value?: string): string {
  const date = parseDate(value)

  if (!date) return ''

  const dateFormatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const isToday =
    dateFormatter.format(date) ===
    dateFormatter.format(new Date())

  if (isToday) {
    return formatMessageTime(value)
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(date)
}

function Avatar({ conversation, small = false }: { conversation: Conversation; small?: boolean }) {
  return <div className={`avatar ${small ? 'avatar-small' : ''}`} style={{ background: conversation.avatarColor || '#bdd7cf' }}>
    {initials(conversation.name)}{conversation.online && <span className="online-dot" />}
  </div>
}

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [connection, setConnection] = useState<Connection>('checking')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [draft, setDraft] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [notice, setNotice] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const active = conversations.find((item) => item.id === activeId) ?? null
  const activeMessages = activeId ? messages[activeId] ?? [] : []

  useEffect(() => {
    let ignore = false
    chatApi.getConversations().then((items) => {
      if (ignore) return
      setConversations(items)
      setActiveId(items[0]?.id ?? null)
      setConnection('connected')
    }).catch(() => {
      if (ignore) return
      setConversations([])
      setActiveId(null)
      setConnection('error')
    })
    return () => { ignore = true }
  }, [])

  useEffect(() => {
    if (!activeId || connection !== 'connected') return
    let ignore = false
    setIsLoadingMessages(true)
    chatApi.getMessages(activeId).then((items) => {
      if (!ignore) setMessages((current) => ({ ...current, [activeId]: items }))
    }).catch(() => {
      if (ignore) return
      setConnection('error')
      setMessages((current) => ({ ...current, [activeId]: [] }))
      setNotice('Não foi possível carregar as mensagens da API.')
    }).finally(() => { if (!ignore) setIsLoadingMessages(false) })
    return () => { ignore = true }
  }, [activeId, connection])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [activeId, activeMessages.length])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 4200)
    return () => window.clearTimeout(timer)
  }, [notice])

  const filteredConversations = useMemo(() => conversations.filter((conversation) => {
    const matchesQuery = `${conversation.name} ${conversation.phone} ${conversation.lastMessage ?? ''}`.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === 'all' || (filter === 'unread' ? Boolean(conversation.unread) : Boolean(conversation.favorite))
    return matchesQuery && matchesFilter
  }), [conversations, query, filter])

  function selectConversation(conversation: Conversation) {
    setActiveId(conversation.id)
    if (conversation.unread) setConversations((items) => items.map((item) => item.id === conversation.id ? { ...item, unread: 0 } : item))
  }

  function appendMessage(message: Message) {
    setMessages((current) => ({ ...current, [message.conversationId]: [...(current[message.conversationId] ?? []), message] }))
    setConversations((items) => {
      const updated = items.map((item) => item.id === message.conversationId
        ? { ...item, lastMessage: message.text, lastMessageAt: message.createdAt, unread: message.direction === 'in' && item.id !== activeId ? (item.unread ?? 0) + 1 : 0 }
        : item)
      return [...updated].sort((a, b) => new Date(b.lastMessageAt ?? 0).getTime() - new Date(a.lastMessageAt ?? 0).getTime())
    })
  }

  
async function sendMessage(event?: FormEvent) {
  event?.preventDefault()

  const text = draft.trim()

  if (!text || !active || isSending) return

  setIsSending(true)

  try {
    const result = await chatApi.sendMessage(active.id, text)
    const now = new Date().toISOString()

    // Mensagem enviada pelo cidadão.
    appendMessage({
      id: `user-${Date.now()}`,
      conversationId: active.id,
      text,
      createdAt: now,
      direction: 'out',
      status: 'read',
    })

    // Resposta real do chatbot.
    appendMessage({
      id: `bot-${Date.now()}`,
      conversationId: active.id,
      text: result.resposta,
      createdAt: new Date(Date.now() + 1).toISOString(),
      direction: 'in',
    })

    // O backend pode retornar um aviso separado.
    if (result.aviso) {
      appendMessage({
        id: `aviso-${Date.now()}`,
        conversationId: active.id,
        text: result.aviso,
        createdAt: new Date(Date.now() + 2).toISOString(),
        direction: 'in',
      })
    }

    setDraft('')
    setConnection('connected')
    inputRef.current?.focus()
  } catch (error) {
    setNotice(
      error instanceof Error
        ? error.message
        : 'Não foi possível enviar a mensagem.',
    )
  } finally {
    setIsSending(false)
  }
}
  
async function createConversation() {
  try {
    const result = await chatApi.createConversation()

    setConversations((items) => [
      result.conversation,
      ...items.filter((item) => item.id !== result.conversation.id),
    ])

setMessages((items) => ({
  ...items,
  [result.conversation.id]: result.initialMessages,
}))

    setActiveId(result.conversation.id)
    setConnection('connected')
    setModalOpen(false)
    setNotice('')
  } catch (error) {
    setNotice(
      error instanceof Error
        ? error.message
        : 'Não foi possível iniciar a conversa.',
    )
  }
}

  function handleComposerKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  const connectionLabel = connection === 'connected' ? 'API conectada' : connection === 'checking' ? 'Conectando…' : 'API com falha'

  return <main className="app-shell">
    <aside className="rail">
      <div className="brand-mark"><span className="brand-bubble"><Icon name="chat" size={21} /></span></div>
      <button className="rail-button" aria-label="Buscar conversas" onClick={() => document.getElementById('conversation-search')?.focus()}><Icon name="search" /></button>
      <div className="rail-spacer" />
      <button className="rail-button profile-mini" aria-label="Perfil">L</button>
    </aside>

    <section className="inbox-panel">
      <header className="inbox-heading">
        <div>
          <div className="eyebrow">CENTRAL DE CONVERSAS</div>
          <h1>Mensagens</h1>
        </div>
        <button className="new-chat-button" onClick={() => setModalOpen(true)} aria-label="Nova conversa"><Icon name="plus" size={19} /><span>Nova conversa</span></button>
      </header>

      <div className="search-wrap"><Icon name="search" size={18} /><input id="conversation-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar conversa..." /></div>

      <nav className="filter-tabs" aria-label="Filtrar conversas">
        {([['all', 'Todas'], ['unread', 'Não lidas'], ['favorites', 'Favoritas']] as const).map(([id, label]) => <button key={id} className={filter === id ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter(id)}>{label}{id === 'unread' && <span className="tab-count">{conversations.filter((item) => item.unread).length}</span>}</button>)}
      </nav>

      <div className="conversation-scroll">
        <div className="list-label">RECENTES <span>{filteredConversations.length}</span></div>
        {connection === 'checking' && <div className="list-state">Carregando conversas…</div>}
        {filteredConversations.map((conversation) => <button key={conversation.id} className={`conversation-row ${activeId === conversation.id ? 'active' : ''}`} onClick={() => selectConversation(conversation)}>
          <Avatar conversation={conversation} />
          <span className="conversation-copy">
            <span className="conversation-topline"><strong>{conversation.name}</strong><time>{formatConversationTime(conversation.lastMessageAt)}</time></span>
            <span className="conversation-bottomline"><span className="last-message">{conversation.lastMessage || 'Comece uma conversa'}</span>{Boolean(conversation.unread) && <span className="unread-count">{conversation.unread}</span>}</span>
          </span>
        </button>)}
        {!filteredConversations.length && connection !== 'checking' && <div className="empty-filter"><span className="empty-icon"><Icon name={conversations.length ? 'search' : 'chat'} size={20} /></span><strong>{conversations.length ? 'Nenhuma conversa encontrada' : connection === 'error' ? 'API indisponível' : 'Nenhuma conversa ainda'}</strong><span>{conversations.length ? 'Tente outro nome ou filtro.' : connection === 'error' ? 'Verifique o backend e tente novamente.' : 'As conversas da API aparecerão aqui.'}</span></div>}
      </div>

      <footer className="inbox-footer"><span className={`connection-dot ${connection}`} /><span>{connectionLabel}</span><button onClick={() => window.location.reload()} title="Recarregar conversas" aria-label="Recarregar"><Icon name="refresh" size={16} /></button></footer>
    </section>

    <section className="chat-panel">
      {active ? <>
        <header className="chat-header">
          <div className="chat-contact"><button className="mobile-back icon-button" onClick={() => setActiveId(null)} aria-label="Voltar"><Icon name="back" /></button><Avatar conversation={active} small /><div className="contact-copy"><strong>{active.name}</strong></div></div>
        </header>

        {connection === 'error' && <div className="demo-banner error-banner"><span>Não foi possível sincronizar esta conversa com a API.</span><button onClick={() => window.location.reload()}><Icon name="refresh" size={14} /> Tentar novamente</button></div>}
<div className="message-area">
  <div className="privacy-note">
    <span className="lock">◆</span> As mensagens desta conversa são privadas.
  </div>

  {isLoadingMessages && (
    <div className="messages-loading">Buscando mensagens…</div>
  )}

  {activeMessages.map((message) => (
    <div
      key={message.id}
      className={`message-line ${
        message.direction === 'out' ? 'outgoing' : 'incoming'
      }`}
    >
      <div className="message-bubble">
        <p>{message.text}</p>

        <span className="message-meta">
          {formatMessageTime(message.createdAt)}

          {message.direction === 'out' && (
            <span
              className={`message-status ${
                message.status === 'read' ? 'read' : ''
              }`}
            >
              <Icon
                name={message.status === 'sent' ? 'check' : 'checkDouble'}
                size={14}
              />
            </span>
          )}
        </span>
      </div>
    </div>
  ))}

  {!activeMessages.length && !isLoadingMessages && (
    <div className="conversation-empty">
      <span className="empty-icon">
        <Icon name="chat" size={21} />
      </span>
      <strong>Esta conversa está começando</strong>
      <span>Envie uma mensagem para iniciar o papo.</span>
    </div>
  )}

  <div ref={messageEndRef} />
</div>

        <form className="composer" onSubmit={(event) => void sendMessage(event)}>
          <div className="composer-tools"><button type="button" className="icon-button attach-button" aria-label="Anexar arquivo"><Icon name="paperclip" /></button><button type="button" className="icon-button emoji-button" aria-label="Inserir emoji" onClick={() => setDraft((value) => `${value}😊`)}><Icon name="smile" /></button></div>
          <textarea ref={inputRef} rows={1} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleComposerKey} placeholder="Digite uma mensagem" aria-label="Digite uma mensagem" />
          <div className="composer-send">{draft.trim() ? <button type="submit" className="send-button" disabled={isSending} aria-label="Enviar mensagem"><Icon name="send" size={18} /></button> : <button type="button" className="icon-button mic-button" aria-label="Gravar áudio"><Icon name="mic" /></button>}</div>
        </form>
        <div className="composer-hint">Pressione <kbd>Enter</kbd> para enviar <span>·</span> <kbd>Shift + Enter</kbd> para pular linha</div>
      </> : <div className="welcome-panel"><div className="welcome-art"><div className="art-circle circle-one" /><div className="art-circle circle-two" /><div className="art-chat"><Icon name="chat" size={45} /></div><span className="art-spark spark-one">✦</span><span className="art-spark spark-two">✳</span></div><h2>{connection === 'checking' ? 'Carregando conversas…' : connection === 'error' ? 'API indisponível' : conversations.length ? 'Selecione uma conversa' : 'Nenhuma conversa ainda'}</h2><p>{connection === 'error' ? 'Confira se o backend está ativo e tente novamente.' : conversations.length ? 'Selecione uma conversa na lista para ver as mensagens.' : 'As conversas retornadas pela API aparecerão aqui.'}</p>{connection === 'error' ? <button onClick={() => window.location.reload()} className="welcome-button"><Icon name="refresh" size={17} /> Tentar novamente</button> : <button onClick={() => setModalOpen(true)} className="welcome-button"><Icon name="plus" size={17} /> Nova conversa</button>}<div className="welcome-foot"><Icon name="pin" size={14} /> Mensagens carregadas da API</div></div>}
    </section>

    {notice && <div className="toast"><span className="toast-check"><Icon name="check" size={15} /></span>{notice}<button onClick={() => setNotice('')} aria-label="Fechar"><Icon name="close" size={16} /></button></div>}

    
{modalOpen && (
  <div
    className="modal-backdrop"
    role="presentation"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        setModalOpen(false)
      }
    }}
  >
    <div className="new-chat-modal">
      <div className="modal-heading">
        <div>
          <span className="eyebrow">ATENDIMENTO PROCON</span>
          <h2>Começar conversa</h2>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={() => setModalOpen(false)}
          aria-label="Fechar"
        >
          <Icon name="close" />
        </button>
      </div>

      <p className="modal-hint">
        Inicie um atendimento. O chatbot solicitará seus dados
        diretamente nesta conversa.
      </p>

      <div className="modal-actions">
        <button
          type="button"
          className="cancel-button"
          onClick={() => setModalOpen(false)}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="create-button"
          onClick={() => void createConversation()}
        >
          <Icon name="chat" size={16} />
          Iniciar atendimento
        </button>
      </div>
    </div>
  </div>
)}
  </main>
}

export default App
