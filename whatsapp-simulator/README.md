# Zap Simulador

Página de conversas em React + TypeScript. O front-end usa `fetch` para consumir a API `/api/chat/*`. Conversas e mensagens são exibidas somente quando retornadas pela API; se ela estiver indisponível, a interface mostra o estado de erro e não cria conteúdo de demonstração.

## Executar

```bash
npm install
npm run dev
```

`npm run dev` inicia o backend e o Vite juntos. A página abre em `http://localhost:3000`; a API escuta em `http://localhost:3001`. O backend grava os dados em `data/chat-store.json` e começa vazio, sem contatos ou mensagens de exemplo.

## Contrato da API

O front-end espera respostas JSON. As listas retornam arrays diretamente.

| Método | Rota | Corpo | Resposta |
| --- | --- | --- | --- |
| `GET` | `/api/chat/conversations` | — | `Conversation[]` |
| `GET` | `/api/chat/conversations/:id/messages` | — | `Message[]` |
| `POST` | `/api/chat/conversations` | `{ "name": "...", "phone": "..." }` | `Conversation` criado |
| `POST` | `/api/chat/conversations/:id/messages` | `{ "text": "..." }` | `Message` criado |
| `POST` | `/api/chat/conversations/:id/simulate-reply` | `{ "text": "..." }` | `Message` recebido |

Tipos esperados:

```ts
type Conversation = {
  id: string
  name: string
  phone: string
  avatarColor?: string
  online?: boolean
  unread?: number
  favorite?: boolean
  lastMessage?: string
  lastMessageAt?: string // ISO 8601
}

type Message = {
  id: string
  conversationId: string
  text: string
  createdAt: string // ISO 8601
  direction: 'in' | 'out'
  status?: 'sent' | 'delivered' | 'read'
}
```

O botão “Simular resposta” pede o texto recebido e salva esse texto pela API; ele não inventa respostas. Este backend é local para o simulador e não envia mensagens para a plataforma WhatsApp. Para integrar ao WhatsApp real, conecte as rotas de envio e recebimento à API oficial e configure as credenciais no servidor.
