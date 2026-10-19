import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import { backend } from '../services/backend.ts'

type Agendamento = {
  id: string | number
  usuarioId: number
  name: string
  date: string
  time: string
  status: string
  criadoEm: string
}

function ListaAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    backend.agendamentos
      .list()
      .then((data: Agendamento[]) => {
        setAgendamentos(data)
        setErro('')
      })
      .catch((error: unknown) => {
        console.error('Erro ao listar agendamentos:', error)
        setErro('Não foi possível carregar os agendamentos.')
      })
      .finally(() => {
        setCarregando(false)
      })
  }, [])

  const cancelarAgendamento = async (
    id: string | number,
    usuarioId: number,
  ) => {
    const confirmar = window.confirm(
      'Deseja realmente cancelar este agendamento?',
    )

    if (!confirmar) return

    try {
      await backend.agendamentos.delete(String(id))

      setAgendamentos((atuais) =>
        atuais.map((agendamento) =>
          String(agendamento.id) === String(id)
            ? { ...agendamento, status: 'cancelado' }
            : agendamento,
        ),
      )
    } catch (error: unknown) {
      const mensagem =
        error instanceof Error
          ? error.message
          : 'Não foi possível cancelar o agendamento.'

      window.alert(mensagem)
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
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan={5}>Carregando agendamentos...</td>
                </tr>
              ) : erro ? (
                <tr>
                  <td colSpan={5}>{erro}</td>
                </tr>
              ) : agendamentos.length > 0 ? (
                agendamentos.map((agendamento) => (
                  <tr key={agendamento.id}>
                    <td>{agendamento.name}</td>
                    <td>{formatarData(agendamento.date)}</td>
                    <td>{agendamento.time}</td>
                    <td>{agendamento.status}</td>
                    <td>
                      {agendamento.status !== 'cancelado' && (
                        <button
                          type="button"
                          className="button button--secondary"
                          onClick={() =>
                            cancelarAgendamento(
                              agendamento.id,
                              agendamento.usuarioId,
                            )
                          }
                        >
                          Cancelar Agendamento
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="table-empty-row">
                  <td colSpan={5}>
                    <EmptyState
                      compact
                      title="Nenhum agendamento encontrado"
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
