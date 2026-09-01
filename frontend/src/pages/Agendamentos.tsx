import { useState } from 'react'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import MonthCalendar from '../components/MonthCalendar'
import PageHeader from '../components/PageHeader'

function Agendamentos() {
  const [selectedDate, setSelectedDate] = useState('')

  return (
    <div className="page-stack">
      <PageHeader eyebrow="Atendimento presencial" title="Agendamentos" description="Consulte os atendimentos encaminhados pelo chatbot, organizados por data e horário." />

      <section className="panel" aria-labelledby="appointment-filters-title">
        <div className="panel__heading">
          <div><span className="section-kicker">Consulta</span><h2 id="appointment-filters-title">Filtrar agenda</h2></div>
        </div>
        <form className="filters" onSubmit={(event) => event.preventDefault()}>
          <label><span>Data do atendimento</span><input type="date" name="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></label>
          <label><span>Status</span><input type="text" name="status" placeholder="Informe o status" /></label>
          <label className="filters__search">
            <span>Buscar atendimento</span>
            <span className="input-with-icon"><Icon name="search" size={18} /><input type="search" name="query" placeholder="Protocolo ou consumidor" /></span>
          </label>
          <button className="button button--primary" type="submit">Aplicar filtros</button>
        </form>
      </section>

      <section className="panel" aria-labelledby="appointments-calendar-title">
        <div className="panel__heading">
          <div><span className="section-kicker">Visão mensal</span><h2 id="appointments-calendar-title">Calendário de agendamentos</h2></div>
          <p>Selecione uma data para consultar a agenda do dia.</p>
        </div>
        <MonthCalendar compact selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </section>

      <section className="panel panel--table" aria-labelledby="appointments-list-title">
        <div className="panel__heading panel__heading--table">
          <div><span className="section-kicker">Agenda</span><h2 id="appointments-list-title">Atendimentos agendados</h2></div>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Data</th><th>Horário</th><th>Consumidor</th><th>Status</th><th><span className="sr-only">Ações</span></th></tr></thead>
            <tbody><tr className="table-empty-row"><td colSpan={5}><EmptyState compact title="Nenhum agendamento carregado" /></td></tr></tbody>
          </table>
        </div>
      </section>

    </div>
  )
}

export default Agendamentos
