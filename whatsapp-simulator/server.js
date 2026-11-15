import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const directory = path.dirname(fileURLToPath(import.meta.url))
const dataDirectory = path.join(directory, 'data')
const dataFile = process.env.CHAT_DATA_FILE || path.join(dataDirectory, 'chat-store.json')
export const port = Number(process.env.PORT || 3001)
const emptyStore = () => ({ conversations: [], messages: {} })

await mkdir(path.dirname(dataFile), { recursive: true })

let store
try {
  store = JSON.parse(await readFile(dataFile, 'utf8'))
  if (!Array.isArray(store.conversations) || typeof store.messages !== 'object' || store.messages === null) {
    throw new Error(`Formato inválido no arquivo ${dataFile}`)
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error
  store = emptyStore()
  await writeFile(dataFile, JSON.stringify(store, null, 2), 'utf8')
}

let saveQueue = Promise.resolve()
function persist() {
  const snapshot = JSON.stringify(store, null, 2)
  saveQueue = saveQueue.then(() => writeFile(dataFile, snapshot, 'utf8'))
  return saveQueue
}

function send(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify(data))
}

async function readJson(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > 1024 * 1024) throw Object.assign(new Error('Corpo da requisição muito grande.'), { status: 413 })
    chunks.push(chunk)
  }
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw Object.assign(new Error('JSON inválido.'), { status: 400 })
  }
}

function findConversation(id) {
  return store.conversations.find((conversation) => conversation.id === id)
}

function makeMessage(conversationId, text, direction) {
  return {
    id: randomUUID(),
    conversationId,
    text,
    createdAt: new Date().toISOString(),
    direction,
    ...(direction === 'out' ? { status: 'sent' } : {}),
  }
}

async function handle(request, response) {
  const origin = request.headers.origin
  if (origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000') {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Vary', 'Origin')
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
  if (request.method === 'OPTIONS') {
    response.writeHead(204)
    response.end()
    return
  }

  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
  if (request.method === 'GET' && url.pathname === '/api/health') {
    send(response, 200, { status: 'ok', service: 'whatsapp-chat-simulator' })
    return
  }

  if (request.method === 'GET' && url.pathname === '/api/chat/conversations') {
    const conversations = [...store.conversations].sort((a, b) =>
      new Date(b.lastMessageAt || b.createdAt).getTime() - new Date(a.lastMessageAt || a.createdAt).getTime(),
    )
    send(response, 200, conversations)
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/chat/conversations') {
    const body = await readJson(request)
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    if (!name || !phone) {
      send(response, 400, { error: 'Informe nome e telefone.' })
      return
    }
    const conversation = {
      id: randomUUID(),
      name,
      phone,
      unread: 0,
      favorite: false,
      createdAt: new Date().toISOString(),
    }
    store.conversations.push(conversation)
    store.messages[conversation.id] = []
    await persist()
    send(response, 201, conversation)
    return
  }

  const conversationRoute = url.pathname.match(/^\/api\/chat\/conversations\/([^/]+)\/(messages|simulate-reply)$/)
  if (conversationRoute) {
    const id = decodeURIComponent(conversationRoute[1])
    const action = conversationRoute[2]
    const conversation = findConversation(id)
    if (!conversation) {
      send(response, 404, { error: 'Conversa não encontrada.' })
      return
    }

    if (request.method === 'GET' && action === 'messages') {
      conversation.unread = 0
      await persist()
      send(response, 200, store.messages[id] || [])
      return
    }

    if (request.method === 'POST' && (action === 'messages' || action === 'simulate-reply')) {
      const body = await readJson(request)
      const text = typeof body.text === 'string' ? body.text.trim() : ''
      if (!text) {
        send(response, 400, { error: 'O texto da mensagem é obrigatório.' })
        return
      }
      const direction = action === 'simulate-reply' ? 'in' : 'out'
      const message = makeMessage(id, text, direction)
      store.messages[id] = [...(store.messages[id] || []), message]
      conversation.lastMessage = text
      conversation.lastMessageAt = message.createdAt
      if (direction === 'in') conversation.unread = (conversation.unread || 0) + 1
      await persist()
      send(response, 201, message)
      return
    }
  }

  send(response, 404, { error: 'Rota não encontrada.' })
}

export const server = createServer((request, response) => {
  handle(request, response).catch((error) => {
    console.error(error)
    if (!response.headersSent) {
      send(response, error.status || 500, { error: error.status ? error.message : 'Erro interno do servidor.' })
    } else {
      response.end()
    }
  })
})

export function startServer() {
  return new Promise((resolve, reject) => {
    const onError = (error) => reject(error)
    server.once('error', onError)
    server.listen(port, 'localhost', () => {
      server.off('error', onError)
      resolve(server)
    })
  })
}

export function closeServer(target = server) {
  return new Promise((resolve, reject) => {
    if (!target.listening) return resolve()
    target.close((error) => error ? reject(error) : resolve())
  })
}

const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMainModule) {
  try {
    await startServer()
    console.log(`API do simulador: http://localhost:${port}`)
    console.log(`Dados persistidos em: ${dataFile}`)
    const shutdown = () => { void closeServer().then(() => process.exit(0)) }
    process.once('SIGINT', shutdown)
    process.once('SIGTERM', shutdown)
  } catch (error) {
    console.error(`Não foi possível iniciar a API na porta ${port}:`, error)
    process.exitCode = 1
  }
}
