import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'

function Agendamentos() {
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Atendimento presencial" title="Agendamentos" description="Consulte os atendimentos encaminhados pelo chatbot, organizados por data e horário." />

      <section className="panel" aria-labelledby="appointment-filters-title">
        <div className="panel__heading">
          <div><span className="section-kicker">Consulta</span><h2 id="appointment-filters-title">Filtrar agenda</h2></div>
          <p>Os filtros serão aplicados aos dados recebidos pela API.</p>
        </div>
        <form className="filters" onSubmit={(event) => event.preventDefault()}>
          <label><span>Data do atendimento</span><input type="date" name="date" /></label>
          <label><span>Status</span><input type="text" name="status" placeholder="Informe o status" /></label>
          <label className="filters__search">
            <span>Buscar atendimento</span>
            <span className="input-with-icon"><Icon name="search" size={18} /><input type="search" name="query" placeholder="Protocolo ou consumidor" /></span>
          </label>
          <button className="button button--primary" type="submit">Aplicar filtros</button>
        </form>
      </section>

      <section className="panel panel--table" aria-labelledby="appointments-list-title">
        <div className="panel__heading panel__heading--table">
          <div><span className="section-kicker">Agenda</span><h2 id="appointments-list-title">Atendimentos agendados</h2></div>
          <span className="data-source-badge">Aguardando integração</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Data</th><th>Horário</th><th>Consumidor</th><th>Status</th><th><span className="sr-only">Ações</span></th></tr></thead>
            <tbody><tr className="table-empty-row"><td colSpan={5}><EmptyState compact title="Nenhum agendamento carregado" description="A listagem será exibida aqui quando o frontend estiver conectado ao serviço de agendamentos." /></td></tr></tbody>
          </table>
        </div>
      </section>

      <div className="privacy-note"><Icon name="shield" size={18} /><span>Dados pessoais devem permanecer visíveis apenas durante o atendimento necessário.</span></div>
    </div>
  )
}

export default Agendamentos
