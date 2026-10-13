import { Router, type Request, type Response } from 'express'
import { availabilityService } from '../services/availability.service'

export const availabilityRouter = Router()

availabilityRouter.get('/', (_req, res) => {
  res.json(availabilityService.list())
})

availabilityRouter.get('/range', (req: Request, res: Response) => {
  const { startDate, endDate } = req.query
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate e endDate obrigatórios.' })
  }
  res.json(
    availabilityService.getByRange(startDate as string, endDate as string),
  )
})

availabilityRouter.post('/', (req: Request, res: Response) => {
  try {
    res.status(201).json(availabilityService.create(req.body))
  } catch (e) {
    res.status(400).json({ error: (e as Error).message })
  }
})

availabilityRouter.put('/:id', (req: Request, res: Response) => {
  try {
    res.json(availabilityService.update(req.params.id, req.body))
  } catch (e) {
    res.status(404).json({ error: (e as Error).message })
  }
})

availabilityRouter.patch('/:id/toggle', (req: Request, res: Response) => {
  try {
    res.json(availabilityService.toggleStatus(req.params.id))
  } catch (e) {
    res.status(404).json({ error: (e as Error).message })
  }
})

availabilityRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    res.json(availabilityService.delete(req.params.id))
  } catch (e) {
    res.status(404).json({ error: (e as Error).message })
  }
})