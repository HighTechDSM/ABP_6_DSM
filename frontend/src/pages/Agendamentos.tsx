import { useState } from 'react'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'

type Agendamento = {
  id: number
  name: string
  date: string
  time: string
  status: string
}

const AGENDAMENTOS_INICIAIS: Agendamento[] = [
  {
    id: 1,
    name: 'Ana Beatriz Souza',
    date: '14/09/2026',
    time: '08:00',
    status: 'Agendado',
  },
  {
    id: 2,
    name: 'Carlos Eduardo Lima',
    date: '14/09/2026',
    time: '08:45',
    status: 'Agendado',
  },
  {
    id: 3,
    name: 'Mariana Oliveira',
    date: '15/09/2026',
    time: '09:15',
    status: 'Agendado',
  },
  {
    id: 4,
    name: 'João Pedro Santos',
    date: '15/09/2026',
    time: '10:30',
    status: 'Agendado',
  },
  {
    id: 5,
    name: 'Beatriz Fernandes',
    date: '16/09/2026',
    time: '08:15',
    status: 'Agendado',
  },
  {
    id: 6,
    name: 'Rafael Almeida',
    date: '16/09/2026',
    time: '11:00',
    status: 'Agendado',
  },
  {
    id: 7,
    name: 'Juliana Martins',
    date: '17/09/2026',
    time: '09:00',
    status: 'Agendado',
  },
  {
    id: 8,
    name: 'Lucas Rodrigues',
    date: '17/09/2026',
    time: '13:15',
    status: 'Agendado',
  },
  {
    id: 9,
    name: 'Camila Ferreira',
    date: '18/09/2026',
    time: '10:15',
    status: 'Agendado',
  },
  {
    id: 10,
    name: 'Gabriel Costa',
    date: '18/09/2026',
    time: '14:00',
    status: 'Agendado',
  },
  {
    id: 11,
    name: 'Larissa Mendes',
    date: '19/09/2026',
    time: '08:30',
    status: 'Agendado',
  },
  {
    id: 12,
    name: 'Felipe Martins',
    date: '19/09/2026',
    time: '12:45',
    status: 'Agendado',
  },
  {
    id: 13,
    name: 'Amanda Ribeiro',
    date: '20/09/2026',
    time: '09:45',
    status: 'Agendado',
  },
  {
    id: 14,
    name: 'Bruno Carvalho',
    date: '21/09/2026',
    time: '13:30',
    status: 'Agendado',
  },
  {
    id: 15,
    name: 'Isabela Rocha',
    date: '22/09/2026',
    time: '10:00',
    status: 'Agendado',
  },
  {
    id: 16,
    name: 'Matheus Barbosa',
    date: '22/09/2026',
    time: '15:15',
    status: 'Agendado',
  },
]

function ListaAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(
    AGENDAMENTOS_INICIAIS,
  )

  const cancelarAgendamento = (id: number) => {
    setAgendamentos((current) =>
      current.filter((agendamento) => agendamento.id !== id),
    )
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Atendimento presencial"
        title="Lista de Agendamentos"
        description="Lista de atendimentos agendados, organizados por pessoa, data e horário."
      />

      <section
        className="panel panel--table"
        aria-labelledby="appointments-list-title"
      >
        <div className="panel__heading panel__heading--table">
          <div>
            <h2 id="appointments-list-title">
              Atendimentos agendados
            </h2>
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Data do agendamento</th>
                <th>Horário</th>
                <th>Situação</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {agendamentos.length > 0 ? (
                agendamentos.map((agendamento) => (
                  <tr key={agendamento.id}>
                    <td>{agendamento.name}</td>
                    <td>{agendamento.date}</td>
                    <td>{agendamento.time}</td>
                    <td>{agendamento.status}</td>
                    <td>
                      <button
                        type="button"
                        className="button button--secondary"
                        onClick={() =>
                          cancelarAgendamento(agendamento.id)
                        }
                      >
                        Cancelar Agendamento
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="table-empty-row">
                  <td colSpan={5}>
                    <EmptyState
                      compact
                      title="Nenhum agendamento carregado"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default ListaAgendamentos