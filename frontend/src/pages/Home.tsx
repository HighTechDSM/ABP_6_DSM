import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Icon from '../components/Icon'

function Home() {
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function fazerLogin() {
    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario)

    const senhaValida = senha.trim().length >= 8

    if (!emailValido) {
      setErro('Digite um e-mail válido.')
      return
    }

    if (!senhaValida) {
      setErro('A senha deve conter pelo menos 8 caracteres.')
      return
    }

    sessionStorage.setItem('funcionarioLogado', 'true')

    window.dispatchEvent(new Event('funcionarioLogin'))

    navigate('/agendamentos', { replace: true })
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

            <h2>Central de Agendamentos</h2>

            <p>
              Acesse o sistema para gerenciar os atendimentos.
            </p>
          </div>
        </div>
      </section>

      <div className="home-cards home-cards--login">
        <section className="employee-login">
          <span className="section-kicker">
            Acesso do funcionário
          </span>

          <h2>Entrar</h2>

          <p>
            Informe seu e-mail e senha para acessar os
            atendimentos.
          </p>

          <form
            className="employee-login__form"
            onSubmit={(e) => {
              e.preventDefault()
              fazerLogin()
            }}
          >
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
                autoComplete="username"
                required
              />
            </label>

            <label>
              Senha

              <input
                type="password"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value)
                  setErro('')
                }}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                minLength={8}
                required
              />
            </label>

            {erro && (
              <p className="employee-login__error">
                {erro}
              </p>
            )}

            <button type="submit">
              Entrar
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Home