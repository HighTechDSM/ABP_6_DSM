export type AgendamentoStatus = 'agendado' | 'cancelado' | 'concluido'

export type Agendamento = {
  id: string
  name: string
  cpf: string
  birthDate: string
  date: string
  time: string
  status: AgendamentoStatus
  criadoEm: string
}

export type Disponibilidade = {
  id: string
  data: string
  horarios: string[]
  ativo: boolean
}

export type CodigoLiberacao = {
  codigo: string
  sessionId: string
  expiraEm: string
  usado: boolean
}

export const store = {
  agendamentos: [] as Agendamento[],
  disponibilidade: [] as Disponibilidade[],
  codigos: [] as CodigoLiberacao[],

  init() {
    const dias = [
      '2026-09-14', '2026-09-15', '2026-09-16',
      '2026-09-17', '2026-09-18', '2026-09-21',
      '2026-09-22',
    ]

    const horarios: string[] = []

    for (let m = 8 * 60; m <= 11 * 60 + 45; m += 15) {
      horarios.push(
        `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`,
      )
    }

    for (let m = 12 * 60; m <= 15 * 60 + 15; m += 15) {
      horarios.push(
        `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`,
      )
    }

    this.disponibilidade = dias.map((data, i) => ({
      id: `disp-${i + 1}`,
      data,
      horarios,
      ativo: true,
    }))
  },
}