import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import { backend } from '../services/backend'

type Agendamento = {
  id: string
  name: string
  birthDate: string
  cpf: string
  date: string
  time: string
  status: string
  criadoEm: string
}

function ListaAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])

  useEffect(() => {
    backend.appointments
      .list()
      .then((data: Agendamento[]) => setAgendamentos(data))
      .catch((e) => {
        console.error('Erro ao listar agendamentos:', e)
      })
  }, [])

  const cancelarAgendamento = async (id: string) => {
    try {
      await backend.appointments.delete(id)

      setAgendamentos((current) =>
        current.filter((agendamento) => agendamento.id !== id),
      )
    } catch (e) {
      alert((e as Error).message)
    }
  }

  const formatarData = (date: string) => {
    if (!date) return ''
    const [ano, mes, dia] = date.split('-')
    return `${dia}/${mes}/${ano}`
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
                    <td>{formatarData(agendamento.date)}</td>
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