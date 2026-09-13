import { useState } from 'react'
import EmptyState from '../components/EmptyState'
import MonthCalendar from '../components/MonthCalendar'
import PageHeader from '../components/PageHeader'

type Agendamento = {
  id: number
  name: string
  birthDate: string
  cpf: string
  date: string
  time: string
}

const DIAS_DISPONIVEIS = [
  '2026-09-14',
  '2026-09-15',
  '2026-09-16',
  '2026-09-17',
  '2026-09-18',
  '2026-09-21',
  '2026-09-22',
]

const gerarHorarios = (inicio: number, fim: number) => {
  const horarios: string[] = []

  for (let minutos = inicio; minutos <= fim; minutos += 15) {
    const hora = Math.floor(minutos / 60)
    const minuto = minutos % 60

    horarios.push(
      `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`,
    )
  }

  return horarios
}

const HORARIOS_MANHA = gerarHorarios(8 * 60, 11 * 60 + 45)
const HORARIOS_TARDE = gerarHorarios(12 * 60, 15 * 60 + 15)

function Disponibilidade() {
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [cpf, setCpf] = useState('')

  const [selectedDate, setSelectedDate] = useState('')

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(() => {
    const agendamentoSalvo =
      sessionStorage.getItem('agendamentoRealizado')

    if (!agendamentoSalvo) {
      return []
    }

    try {
      return [JSON.parse(agendamentoSalvo)]
    } catch {
      sessionStorage.removeItem('agendamentoRealizado')
      sessionStorage.removeItem('agendamentoConcluido')
      return []
    }
  })

  const [showUnavailableModal, setShowUnavailableModal] =
    useState(false)

  const [showSuccessModal, setShowSuccessModal] =
    useState(false)

  const [agendamentoConcluido, setAgendamentoConcluido] =
    useState<Agendamento | null>(() => {
      const agendamentoSalvo =
        sessionStorage.getItem('agendamentoRealizado')

      const concluido =
        sessionStorage.getItem('agendamentoConcluido') === 'true'

      if (!agendamentoSalvo || !concluido) {
        return null
      }

      try {
        return JSON.parse(agendamentoSalvo)
      } catch {
        return null
      }
    })

  const pessoaIdentificada =
    name.trim() !== '' &&
    birthDate !== '' &&
    cpf.trim() !== ''

  const horariosDoDia = agendamentos
    .filter(
      (agendamento) =>
        agendamento.date === selectedDate,
    )
    .map((agendamento) => agendamento.time)

  const selecionarHorario = (time: string) => {
    if (!selectedDate || !pessoaIdentificada) return

    // Impede que o usuário faça mais de um agendamento
    const agendamentoExistente =
      sessionStorage.getItem('agendamentoRealizado')

    if (agendamentoExistente) {
      return
    }

    const jaAgendado = agendamentos.some(
      (agendamento) =>
        agendamento.date === selectedDate &&
        agendamento.time === time,
    )

    if (jaAgendado) return

    const novoAgendamento: Agendamento = {
      id: Date.now(),
      name: name.trim(),
      birthDate,
      cpf,
      date: selectedDate,
      time,
    }

    // Salva o agendamento
    sessionStorage.setItem(
      'agendamentoRealizado',
      JSON.stringify(novoAgendamento),
    )

    // Marca que o agendamento foi realmente concluído
    sessionStorage.setItem(
      'agendamentoConcluido',
      'true',
    )

    setAgendamentos([novoAgendamento])

    setAgendamentoConcluido(novoAgendamento)
    setShowSuccessModal(true)
  }

  const cancelarAgendamento = (id: number) => {
    setAgendamentos((current) =>
      current.filter(
        (agendamento) =>
          agendamento.id !== id,
      ),
    )

    sessionStorage.removeItem(
      'agendamentoRealizado',
    )

    sessionStorage.removeItem(
      'agendamentoConcluido',
    )

    setAgendamentoConcluido(null)
  }

  const formatarData = (date: string) => {
    if (!date) return ''

    const [ano, mes, dia] = date.split('-')

    return `${dia}/${mes}/${ano}`
  }

  const renderHorarios = (horarios: string[]) => (
    <div className="availability-times">
      {horarios.map((time) => {
        const selecionado =
          horariosDoDia.includes(time)

        return (
          <button
            key={time}
            type="button"
            className={`availability-time ${
              selecionado
                ? 'availability-time--selected'
                : ''
            }`}
            disabled={
              selecionado ||
              !!agendamentoConcluido
            }
            onClick={() =>
              selecionarHorario(time)
            }
          >
            {time}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Agendamento de atendimento presencial"
        title="Agendamentos"
        description="Informe seus dados e selecione um dia e horário para realizar o atendimento."
      />

      {/* IDENTIFICAÇÃO */}
      <section className="panel">
        <div className="panel__heading">
          <div>
            <span className="section-kicker">
              Identificação
            </span>

            <h2>Dados do usuário</h2>
          </div>
        </div>

        <div className="field-grid">
          <label className="field-label">
            <span>Nome completo</span>

            <input
              type="text"
              value={name}
              placeholder="Digite o nome completo"
              onChange={(e) =>
                setName(e.target.value)
              }
              disabled={!!agendamentoConcluido}
            />
          </label>

          <label className="field-label">
            <span>Data de nascimento</span>

            <input
              type="date"
              value={birthDate}
              onChange={(e) =>
                setBirthDate(e.target.value)
              }
              disabled={!!agendamentoConcluido}
            />
          </label>

          <label className="field-label">
            <span>CPF</span>

            <input
              type="text"
              value={cpf}
              placeholder="Digite o CPF"
              maxLength={14}
              onChange={(e) =>
                setCpf(e.target.value)
              }
              disabled={!!agendamentoConcluido}
            />
          </label>
        </div>

        {!pessoaIdentificada && !agendamentoConcluido && (
          <p className="availability-identification-hint">
            Preencha os três campos para liberar a marcação do atendimento.
          </p>
        )}
      </section>

      {/* CALENDÁRIO */}
      <section className="panel">
        <div className="panel__heading">
          <div>
            <span className="section-kicker">
              Visão mensal
            </span>

            <h2>Calendário de disponibilidade</h2>
          </div>
        </div>

        <MonthCalendar
          compact
          selectionMode="single"
          selectedDate={selectedDate}
          bookedDates={[]}
          availableDates={DIAS_DISPONIVEIS}
          onDateChange={(date) => {
            setSelectedDate(date)
          }}
          onUnavailableDate={() => {
            setShowUnavailableModal(true)
          }}
        />

        {/* MODAL DE DIA INDISPONÍVEL */}
        {showUnavailableModal && (
          <div className="availability-modal-overlay">
            <div
              className="availability-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="availability-modal-title"
            >
              <span className="section-kicker">
                Atenção
              </span>

              <h3 id="availability-modal-title">
                Este dia não está disponível para atendimentos!
              </h3>

              <p>
                Selecione um dia disponível para o agendamento
                (dias que estão na cor azul).
              </p>

              <button
                type="button"
                className="button button--primary availability-modal__button"
                onClick={() =>
                  setShowUnavailableModal(false)
                }
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* HORÁRIOS */}
        {selectedDate && pessoaIdentificada && (
          <div className="availability-schedule">
            <div className="availability-schedule__header">
              <div>
                <span className="section-kicker">
                  Horários disponíveis
                </span>

                <h3>
                  {formatarData(selectedDate)}
                </h3>
              </div>

              <span className="availability-schedule__hint">
                {agendamentoConcluido
                  ? 'Você já possui um agendamento'
                  : 'Clique em um horário para marcar o atendimento'}
              </span>
            </div>

            <div className="availability-schedule__columns">
              {/* MANHÃ */}
              <div className="availability-period">
                <div className="availability-period__header">
                  <strong>Manhã</strong>
                  <span>08:00 às 11:45</span>
                </div>

                {renderHorarios(HORARIOS_MANHA)}
              </div>

              {/* TARDE */}
              <div className="availability-period">
                <div className="availability-period__header">
                  <strong>Tarde</strong>
                  <span>12:00 às 15:15</span>
                </div>

                {renderHorarios(HORARIOS_TARDE)}
              </div>
            </div>
          </div>
        )}

        {/* AVISO DE IDENTIFICAÇÃO */}
        {selectedDate && !pessoaIdentificada && (
          <div className="availability-warning">
            Preencha os dados do usuário acima para visualizar os horários
            disponíveis.
          </div>
        )}
      </section>

      {/* AGENDA */}
      <section className="panel panel--table">
        <div className="panel__heading">
          <div>
            <span className="section-kicker">
              Atendimentos marcados
            </span>

            <h2>Agenda</h2>
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Situação</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {agendamentos.length > 0 ? (
                agendamentos.map((agendamento) => (
                  <tr key={agendamento.id}>
                    <td>
                      {agendamento.name}
                    </td>

                    <td>
                      {formatarData(
                        agendamento.date,
                      )}
                    </td>

                    <td>
                      {agendamento.time}
                    </td>

                    <td>Agendado</td>

                    <td>
                      <button
                        type="button"
                        className="button button--secondary"
                        onClick={() =>
                          cancelarAgendamento(
                            agendamento.id,
                          )
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
                      title="Nenhum atendimento marcado"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL DE AGENDAMENTO CONCLUÍDO */}
      {showSuccessModal && agendamentoConcluido && (
        <div className="home-success-modal-overlay">
          <div
            className="home-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-success-modal-title"
          >
            <div className="home-success-modal__image">
              <img
                src="/chatbot_happy.png"
                alt="Chatbot"
              />
            </div>

            <div className="home-success-modal__content">
              <span className="section-kicker">
                Agendamento concluído
              </span>

              <h3 id="home-success-modal-title">
                Seu agendamento foi concluído com sucesso!
              </h3>

              <p>
                Compareça no dia{' '}
                <strong>
                  {formatarData(
                    agendamentoConcluido.date,
                  )}
                </strong>{' '}
                às{' '}
                <strong>
                  {agendamentoConcluido.time}
                </strong>
                .
                <br />
                <br />

                Não se esqueça de levar os seguintes documentos:
                <br />
                <br />

                • RG ou CNH
                <br />
                • Comprovante de residência dos últimos 3 meses
              </p>

              <button
                type="button"
                className="button button--primary home-success-modal__button"
                onClick={() =>
                  setShowSuccessModal(false)
                }
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Disponibilidade
