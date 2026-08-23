import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'

function Disponibilidade() {
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Organização da agenda" title="Disponibilidade" description="Prepare os períodos que poderão ser oferecidos para atendimento presencial." />

      <section className="panel" aria-labelledby="availability-form-title">
        <div className="panel__heading">
          <div><span className="section-kicker">Novo período</span><h2 id="availability-form-title">Cadastrar horários</h2></div>
          <p>O envio será habilitado quando o serviço de disponibilidade estiver integrado.</p>
        </div>
        <form className="availability-form" onSubmit={(event) => event.preventDefault()}>
          <div className="field-grid">
            <label className="field-label"><span>Data inicial</span><input type="date" name="startDate" /></label>
            <label className="field-label"><span>Data final</span><input type="date" name="endDate" /></label>
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
          <div className="form-footer">
            <p><Icon name="lock" size={16} /> Nenhum horário será gravado somente no navegador.</p>
            <button className="button button--primary" type="submit" disabled>Cadastrar período</button>
          </div>
        </form>
      </section>

      <section className="panel panel--table" aria-labelledby="availability-list-title">
        <div className="panel__heading panel__heading--table">
          <div><span className="section-kicker">Agenda aberta</span><h2 id="availability-list-title">Períodos cadastrados</h2></div>
          <span className="data-source-badge">Aguardando integração</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Período</th><th>Horário</th><th>Dias</th><th>Situação</th><th><span className="sr-only">Ações</span></th></tr></thead>
            <tbody><tr className="table-empty-row"><td colSpan={5}><EmptyState compact title="Nenhum período carregado" description="Os horários cadastrados serão apresentados aqui após a conexão com o backend." /></td></tr></tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Disponibilidade
