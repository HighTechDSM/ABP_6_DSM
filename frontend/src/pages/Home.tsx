import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Icon from '../components/Icon'

function Home() {
  const location = useLocation()
  const navigate = useNavigate()

  const abrirLoginFuncionario =
    location.state?.abrirLoginFuncionario

  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  const [codigo, setCodigo] = useState('')
  const [erroCodigo, setErroCodigo] = useState('')

  const [showSuccessModal, setShowSuccessModal] = useState(false)

  function fazerLogin() {
    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario)

    const senhaValida = /^\d{8}$/.test(senha)

    if (!emailValido) {
      setErro('Digite um e-mail válido.')
      return
    }

    if (!senhaValida) {
      setErro('A senha deve conter 8 dígitos.')
      return
    }

    sessionStorage.setItem('funcionarioLogado', 'true')

    window.dispatchEvent(
      new Event('funcionarioLogin')
    )

    navigate('/agendamentos', { replace: true })
  }

  function liberarAgendamento() {
    if (!/^\d{6}$/.test(codigo)) {
      setErroCodigo(
        'Digite o código de liberação com 6 dígitos.'
      )
      return
    }

    sessionStorage.setItem(
      'agendamentoLiberado',
      'true'
    )

    window.dispatchEvent(
      new Event('agendamentoLiberado')
    )

    setErroCodigo('')
    setShowSuccessModal(true)
  }

  return (
    <div className="page-stack">

      <section className="welcome-panel">

        <div className="welcome-panel__copy">

          <span className="welcome-panel__icon">
            <Icon name="shield" size={24} />
          </span>

          <div>

            <span className="section-kicker">
              Área administrativa
            </span>

            <h2>
              Central de Agendamentos
            </h2>

            <p>
              Acesse aqui a página de agendamentos após o
              atendimento do chatbot.
            </p>

          </div>

        </div>

      </section>

      <div
        className={`home-cards ${
          abrirLoginFuncionario
            ? 'home-cards--login'
            : ''
        }`}
      >

        {abrirLoginFuncionario && (

          <section className="employee-login">

            <span className="section-kicker">
              Acesso do funcionário
            </span>

            <h2>
              Entrar
            </h2>

            <p>
              Informe seu e-mail e senha para acessar os
              atendimentos.
            </p>

            <div className="employee-login__form">

              <label>
                E-mail

                <input
                  type="email"
                  value={usuario}
                  onChange={(e) => {
                    setUsuario(e.target.value)
                    setErro('')
                  }}
                  placeholder="Digite seu e-mail"
                />
              </label>

              <label>
                Senha

                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  value={senha}
                  onChange={(e) => {
                    setSenha(
                      e.target.value.replace(/\D/g, '')
                    )
                    setErro('')
                  }}
                  placeholder="8 dígitos"
                />
              </label>

              {erro && (
                <p className="employee-login__error">
                  {erro}
                </p>
              )}

              <button
                type="button"
                onClick={fazerLogin}
              >
                Entrar
              </button>

            </div>

          </section>

        )}

        <section
          className="chatbot-home"
          aria-labelledby="chatbot-home-title"
        >

          <div className="chatbot-home__content">

            <span className="section-kicker">
              Realizar Agendamento
            </span>

            <h2 id="chatbot-home-title">
              Continue seu agendamento
            </h2>

            <p>
              Informe o código de 6 dígitos recebido ao
              final do atendimento com o chatbot.
            </p>

            <div className="chatbot-home__code">

              <span className="chatbot-home__code-title">
                Código de liberação
              </span>

              <div className="chatbot-home__code-form">

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={codigo}
                  onChange={(e) => {
                    setCodigo(
                      e.target.value.replace(/\D/g, '')
                    )
                    setErroCodigo('')
                  }}
                  placeholder="000000"
                  aria-label="Código de liberação"
                />

                <button
                  type="button"
                  onClick={liberarAgendamento}
                >
                  Continuar
                </button>

              </div>

              {erroCodigo && (
                <p className="chatbot-home__error">
                  {erroCodigo}
                </p>
              )}

            </div>

          </div>

          <div className="chatbot-home__image">

            <img
              src="/chatbot.png"
              alt="Chatbot de orientação ao consumidor"
            />

          </div>

        </section>

      </div>

      {/* MODAL DE AGENDAMENTO LIBERADO */}

      {showSuccessModal && (

        <div className="home-success-modal-overlay">

          <div
            className="home-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-success-modal-title"
          >

            <div className="home-success-modal__image">

              <img
                src="/chatbot__heart.png"
                alt="Chatbot"
              />

            </div>

            <div className="home-success-modal__content">

              <span className="section-kicker">
                Atendimento concluído
              </span>

              <h3 id="home-success-modal-title">
                Tudo certo!
              </h3>

              <p>
                Agora você será direcionado para fazer o
                agendamento.
              </p>

              <button
                type="button"
                className="button button--primary home-success-modal__button"
                onClick={() => {
                  setShowSuccessModal(false)
                  navigate('/disponibilidade')
                }}
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

export default Home
