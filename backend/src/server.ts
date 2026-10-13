import express from 'express'
import cors from 'cors'
import { env } from './config/env'
import { store } from './data/store'
import { appointmentsRouter } from './routes/appointments'
import { availabilityRouter } from './routes/availability'

const app = express()

app.use(cors({ origin: env.CORS_ORIGIN }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/appointments', appointmentsRouter)
app.use('/api/availability', availabilityRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' })
})

store.init()

app.listen(env.PORT, () => {
  console.log(
    `Backend rodando em http://localhost:${env.PORT} (${env.NODE_ENV})`,
  )
})