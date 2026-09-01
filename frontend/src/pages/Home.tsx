import Icon from '../components/Icon'

function Home() {
  return (
    <div className="page-stack">
      <section className="welcome-panel">
        <div className="welcome-panel__copy">
          <span className="welcome-panel__icon"><Icon name="shield" size={24} /></span>
          <div>
            <span className="section-kicker">Área administrativa</span>
            <h2>Central de atendimento presencial</h2>
            <p>Consulte os agendamentos encaminhados pelo chatbot e organize os horários disponíveis para a equipe.</p>
          </div>
        </div>
      </section>

      <section className="chatbot-home" aria-labelledby="chatbot-home-title">
        <h2 id="chatbot-home-title">Chatbot para Orientação ao Consumidor</h2>
        <p>Sistema de orientação inicial ao consumidor.</p>
      </section>
    </div>
  )
}

export default Home
