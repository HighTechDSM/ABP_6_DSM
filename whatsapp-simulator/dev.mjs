import { createServer as createViteServer } from 'vite'

const vite = await createViteServer()

await vite.listen()

vite.printUrls()

const shutdown = async () => {
  await vite.close()
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
