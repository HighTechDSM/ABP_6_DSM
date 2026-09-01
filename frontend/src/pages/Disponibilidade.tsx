import { useState } from 'react'
import EmptyState from '../components/EmptyState'
import MonthCalendar from '../components/MonthCalendar'
import PageHeader from '../components/PageHeader'

function Disponibilidade() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  return (
    <div className="page-stack">
      <PageHeader eyebrow="Organização da agenda" title="Disponibilidade" description="Prepare os períodos que poderão ser oferecidos para atendimento presencial." />

      <section className="panel" aria-labelledby="availability-form-title">
        <div className="panel__heading">
          <div><span className="section-kicker">Novo período</span><h2 id="availability-form-title">Cadastrar horários</h2></div>
        </div>
        <form className="availability-form" onSubmit={(event) => event.preventDefault()}>
          <div className="field-grid">
            <label className="field-label"><span>Data inicial</span><input type="date" name="startDate" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label>
            <label className="field-label"><span>Data final</span><input type="date" name="endDate" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label>
            <label className="field-label"><span>Horário inicial</span><input type="time" name="startTime" /></label>
            <label className="field-label"><span>Horário final</span><input type="time" name="endTime" /></label>
          </div>
          <fieldset className="weekdays">
            <legend>Dias da semana</legend>
            <label><input type="checkbox" name="weekday" value="monday" /> Segunda</label>
            <label><input type="checkbox" name="weekday" value="tuesday" /> Terça</label>
            <label><input type="checkbox" name="weekday" value="wednesday" /> Quarta</label>
            <label><input type="checkbox" name="weekday" value="thursday" /> Quinta</label>
            <label><input type="checkbox" name="weekday" value="friday" /> Sexta</label>
          </fieldset>
          <div className="form-footer form-footer--end">
            <button className="button button--primary" type="submit" disabled>Cadastrar período</button>
          </div>
        </form>
      </section>

      <section className="panel" aria-labelledby="availability-calendar-title">
        <div className="panel__heading">
          <div><span className="section-kicker">Visão mensal</span><h2 id="availability-calendar-title">Calendário de disponibilidade</h2></div>
          <p>Selecione no calendário o início e o fim do período.</p>
        </div>
        <MonthCalendar
          compact
          selectionMode="range"
          rangeStart={startDate}
          rangeEnd={endDate}
          onRangeChange={(start, end) => {
            setStartDate(start)
            setEndDate(end)
          }}
        />
      </section>

      <section className="panel panel--table" aria-labelledby="availability-list-title">
        <div className="panel__heading panel__heading--table">
          <div><span className="section-kicker">Agenda aberta</span><h2 id="availability-list-title">Períodos cadastrados</h2></div>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Período</th><th>Horário</th><th>Dias</th><th>Situação</th><th><span className="sr-only">Ações</span></th></tr></thead>
            <tbody><tr className="table-empty-row"><td colSpan={5}><EmptyState compact title="Nenhum período carregado" /></td></tr></tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Disponibilidade
