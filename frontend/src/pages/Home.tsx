import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'

function Home() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Visão geral"
        title="Central PROCON"
        description="Acesse o canal de orientação ao consumidor e acompanhe os históricos das conversas desta sessão."
      />

      <section className="welcome-panel">
        <div className="welcome-panel__copy">
          <span className="welcome-panel__icon"><Icon name="shield" size={24} /></span>
          <div>
            <span className="section-kicker">Atendimento digital</span>
            <h2>Orientação clara, segura e acessível</h2>
            <p>Converse pelo canal digital do PROCON e consulte separadamente o histórico de cada atendimento.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="quick-access-title">
        <div className="section-heading">
          <div><span className="section-kicker">Acesso rápido</span><h2 id="quick-access-title">Escolha uma área</h2></div>
        </div>

        <div className="quick-grid">
          <Link className="quick-card" to="/conversa">
            <span className="quick-card__icon"><Icon name="message-circle" size={23} /></span>
            <div><h3>Conversa</h3><p>Envie mensagens pelo canal de orientação e acompanhe a comunicação em tempo real.</p></div>
            <Icon name="chevron-right" size={18} />
          </Link>
          <Link className="quick-card" to="/historico">
            <span className="quick-card__icon"><Icon name="history" size={23} /></span>
            <div><h3>Histórico</h3><p>Consulte todas as conversas e visualize as mensagens de cada atendimento.</p></div>
            <Icon name="chevron-right" size={18} />
          </Link>
        </div>
      </section>

    </div>
  )
}

export default Home
