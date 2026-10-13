import { store, type Disponibilidade } from '../data/store'

export const availabilityService = {
  list() {
    return store.disponibilidade.filter(d => d.ativo)
  },

  getByRange(startDate: string, endDate: string) {
    return store.disponibilidade.filter(
      d => d.ativo && d.data >= startDate && d.data <= endDate,
    )
  },

  create(data: Omit<Disponibilidade, 'id'>) {
    const nova: Disponibilidade = { ...data, id: crypto.randomUUID() }
    store.disponibilidade.push(nova)
    return nova
  },

  update(id: string, data: Partial<Disponibilidade>) {
    const item = store.disponibilidade.find(d => d.id === id)
    if (!item) throw new Error('Período não encontrado.')
    Object.assign(item, data)
    return item
  },

  toggleStatus(id: string) {
    const item = store.disponibilidade.find(d => d.id === id)
    if (!item) throw new Error('Período não encontrado.')
    item.ativo = !item.ativo
    return item
  },

  delete(id: string) {
    const idx = store.disponibilidade.findIndex(d => d.id === id)
    if (idx === -1) throw new Error('Período não encontrado.')
    store.disponibilidade.splice(idx, 1)
    return { ok: true }
  },
}