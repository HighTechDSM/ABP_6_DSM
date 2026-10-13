import { Router, type Request, type Response } from 'express'
import { appointmentsService } from '../services/appointments.service'

export const appointmentsRouter = Router()

appointmentsRouter.post('/gerar-codigo', (req: Request, res: Response) => {
  const { sessionId } = req.body
  if (!sessionId) return res.status(400).json({ error: 'sessionId obrigatório.' })
  const codigo = appointmentsService.gerarCodigoLiberacao(sessionId)
  res.json({ codigo })
})

appointmentsRouter.post('/validar-codigo', (req: Request, res: Response) => {
  const { codigo } = req.body
  const ok = appointmentsService.validarCodigoLiberacao(codigo)
  if (!ok) return res.status(400).json({ error: 'Código inválido ou expirado.' })
  res.json({ ok: true })
})

appointmentsRouter.get('/', (req: Request, res: Response) => {
  const { date, status } = req.query
  res.json(
    appointmentsService.list({
      date: date as string | undefined,
      status: status as string | undefined,
    }),
  )
})

appointmentsRouter.get('/:id', (req: Request, res: Response) => {
  const item = appointmentsService.getById(req.params.id)
  if (!item) return res.status(404).json({ error: 'Agendamento não encontrado.' })
  res.json(item)
})

appointmentsRouter.post('/', (req: Request, res: Response) => {
  try {
    res.status(201).json(appointmentsService.create(req.body))
  } catch (e) {
    res.status(400).json({ error: (e as Error).message })
  }
})

appointmentsRouter.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body
    res.json(appointmentsService.updateStatus(req.params.id, status))
  } catch (e) {
    res.status(404).json({ error: (e as Error).message })
  }
})

appointmentsRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    res.json(appointmentsService.delete(req.params.id))
  } catch (e) {
    res.status(404).json({ error: (e as Error).message })
  }
})