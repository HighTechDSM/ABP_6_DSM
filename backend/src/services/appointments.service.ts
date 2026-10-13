import { store, type Agendamento, type AgendamentoStatus } from '../data/store'
import { gerarCodigo6Digitos, expiracaoEmHoras } from '../utils/code'

export const appointmentsService = {
  list(filters?: { date?: string; status?: string }) {
    let items = store.agendamentos
    if (filters?.date) items = items.filter(a => a.date === filters.date)
    if (filters?.status) items = items.filter(a => a.status === filters.status)
    return items
  },

  getById(id: string) {
    return store.agendamentos.find(a => a.id === id) ?? null
  },

  create(data: Omit<Agendamento, 'id' | 'status' | 'criadoEm'>) {
    const conflito = store.agendamentos.some(
      a =>
        a.date === data.date &&
        a.time === data.time &&
        a.status === 'agendado',
    )

    if (conflito) throw new Error('Horário já ocupado.')

    const novo: Agendamento = {
      ...data,
      id: crypto.randomUUID(),
      status: 'agendado',
      criadoEm: new Date().toISOString(),
    }

    store.agendamentos.push(novo)
    return novo
  },

  updateStatus(id: string, status: AgendamentoStatus) {
    const item = store.agendamentos.find(a => a.id === id)
    if (!item) throw new Error('Agendamento não encontrado.')
    item.status = status
    return item
  },

  delete(id: string) {
    const idx = store.agendamentos.findIndex(a => a.id === id)
    if (idx === -1) throw new Error('Agendamento não encontrado.')
    store.agendamentos.splice(idx, 1)
    return { ok: true }
  },

  gerarCodigoLiberacao(sessionId: string) {
    const codigo = gerarCodigo6Digitos()
    store.codigos.push({
      codigo,
      sessionId,
      expiraEm: expiracaoEmHoras(24),
      usado: false,
    })
    return codigo
  },

  validarCodigoLiberacao(codigo: string) {
    const item = store.codigos.find(
      c =>
        c.codigo === codigo &&
        !c.usado &&
        new Date(c.expiraEm) > new Date(),
    )

    if (!item) return false

    item.usado = true
    return true
  },
}