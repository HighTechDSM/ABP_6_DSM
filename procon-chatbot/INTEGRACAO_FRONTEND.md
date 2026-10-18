# Integração da interface com o PROCON Chatbot

## Executar localmente

No diretório `procon-chatbot`, com as dependências Python instaladas e o Ollama rodando:

```powershell
ollama list
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Abra `http://127.0.0.1:8000/docs` para testar os endpoints. A interface deve usar `http://127.0.0.1:8000` como URL base da API. Se a interface roda em outra porta, ajuste `FRONTEND_ORIGINS` antes de iniciar o servidor, por exemplo:

```powershell
$env:FRONTEND_ORIGINS="http://localhost:5173,http://localhost:3000"
```

## Contrato da integração

1. Ao abrir um novo chat, gere um identificador UUID no frontend e envie `POST /chat/iniciar` com `{"session_id":"uuid-do-chat"}`. O retorno contém `tipo`, `mensagem`, `aviso` e `opcoes`.
2. Para cada mensagem, envie `POST /chat/mensagem` com `{"session_id":"uuid-do-chat","mensagem":"Comprei um produto com defeito"}`.
3. Exiba o campo `resposta` quando `modo` for `ia`, ou o campo `mensagem` quando `modo` for `fluxo`. Se vier `opcoes`, renderize os botões com os valores das chaves (por exemplo `1`, `2`) e envie a chave escolhida como `mensagem`.
4. Opcionalmente, use `GET /chat/historico/{session_id}` para obter o histórico da sessão.
5. Em erros HTTP, leia `detail` e apresente uma mensagem amigável. `404` indica sessão inexistente; `503` indica IA indisponível. Não exponha mensagens internas detalhadas ao usuário final.

Exemplo de consumo (JavaScript/TypeScript):

```ts
const API_URL = import.meta.env.VITE_CHATBOT_API_URL ?? 'http://127.0.0.1:8000';

export async function iniciarChat(sessionId: string) {
  const response = await fetch(`${API_URL}/chat/iniciar`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId }),
  });
  if (!response.ok) throw new Error(`Erro ao iniciar: ${response.status}`);
  return response.json();
}

export async function enviarMensagem(sessionId: string, mensagem: string) {
  const response = await fetch(`${API_URL}/chat/mensagem`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, mensagem }),
  });
  if (!response.ok) {
    const erro = await response.json().catch(() => ({}));
    throw new Error(erro.detail || `Erro HTTP ${response.status}`);
  }
  return response.json();
}
```

No frontend Vite, crie `.env.local` com `VITE_CHATBOT_API_URL=http://127.0.0.1:8000`.

## Observações para a equipe

- O Ollama roda no computador do backend, não no navegador do usuário.
- `GET /ia/status` informa a configuração, **não** verifica se o Ollama está realmente disponível.
- As sessões são guardadas em memória; desaparecem ao reiniciar a API e não são adequadas a múltiplos processos. Para produção, migrar para armazenamento persistente, adicionar autenticação, limitação de requisições e política de retenção de dados pessoais.
- A base de conhecimento jurídica requer validação antes de uso público.
- A interface estilo WhatsApp **não** foi alterada; esta entrega é somente o backend e o contrato de integração.
