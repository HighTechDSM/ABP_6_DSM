import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'

function AtendimentoDetalhes() {
  const { id } = useParams()

  return (
    <div className="page-stack">
      <Link className="back-link" to="/agendamentos"><Icon name="chevron-left" size={17} /> Voltar para agendamentos</Link>
      <PageHeader
        eyebrow="Consulta protegida"
        title="Detalhes do atendimento"
        description={id ? `Estrutura preparada para receber o atendimento ${id} pela API.` : 'Consulte as informações necessárias para preparar o atendimento presencial.'}
        action={<span className="data-source-badge"><Icon name="lock" size={14} /> Acesso controlado</span>}
      />

      <div className="details-grid">
        <section className="panel" aria-labelledby="consumer-data-title">
          <div className="panel__heading"><div><span className="section-kicker">Consumidor</span><h2 id="consumer-data-title">Dados do atendimento</h2></div></div>
          <dl className="data-list">
            <div><dt>Nome</dt><dd>Não carregado</dd></div>
            <div><dt>Contato</dt><dd>Não carregado</dd></div>
            <div><dt>Documento</dt><dd className="protected-value"><Icon name="lock" size={14} /> Dado protegido</dd></div>
            <div><dt>Data e horário</dt><dd>Não carregado</dd></div>
          </dl>
        </section>

        <section className="panel" aria-labelledby="status-title">
          <div className="panel__heading"><div><span className="section-kicker">Andamento</span><h2 id="status-title">Status do atendimento</h2></div></div>
          <label className="field-label"><span>Status atual</span><select disabled defaultValue=""><option value="">Aguardando dados do atendimento</option></select></label>
          <p className="integration-hint">A atualização ficará disponível após a integração com o backend.</p>
          <button className="button button--primary button--full" type="button" disabled>Salvar alteração</button>
        </section>
      </div>

      <section className="panel" aria-labelledby="case-title">
        <div className="panel__heading"><div><span className="section-kicker">Encaminhamento</span><h2 id="case-title">Caso associado</h2></div></div>
        <EmptyState compact title="Caso ainda não carregado" description="O resumo encaminhado pelo chatbot será apresentado neste espaço." />
      </section>

      <section className="panel" aria-labelledby="documents-title">
        <div className="panel__heading"><div><span className="section-kicker">Preparação</span><h2 id="documents-title">Documentos necessários</h2></div></div>
        <EmptyState compact title="Documentos ainda não carregados" description="A relação validada para o caso será exibida após a consulta ao serviço de agendamentos." />
      </section>
    </div>
  )
}

export default AtendimentoDetalhes
