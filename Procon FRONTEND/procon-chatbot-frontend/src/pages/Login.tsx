import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthPageShell from '../components/AuthPageShell'

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate('/inicio')
  }

  return (
    <AuthPageShell
      eyebrow="Portal do funcionário"
      title="Bem-vindo de volta"
      description="Entre com suas credenciais funcionais para acessar o sistema."
    >
      <form className="employee-auth__form" onSubmit={handleSubmit}>
        <label htmlFor="employee-login">E-mail institucional ou matrícula</label>
        <div className="employee-auth__field">
          <span aria-hidden="true">@</span>
          <input
            id="employee-login"
            name="login"
            type="text"
            placeholder="nome@jacarei.sp.gov.br"
            autoComplete="username"
            required
          />
        </div>

        <div className="employee-auth__label-row">
          <label htmlFor="employee-password">Senha</label>
          <Link to="/recuperar-senha">Esqueci minha senha</Link>
        </div>
        <div className="employee-auth__field">
          <span aria-hidden="true">●</span>
          <input
            id="employee-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Digite sua senha"
            autoComplete="current-password"
            required
          />
          <button
            className="employee-auth__show-password"
            type="button"
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        <label className="employee-auth__check">
          <input type="checkbox" />
          <span>Manter meu acesso neste computador</span>
        </label>

        <button className="employee-auth__primary" type="submit">
          Entrar no sistema <span aria-hidden="true">→</span>
        </button>
      </form>

      <p className="employee-auth__switch">
        Primeiro acesso? <Link to="/cadastro">Solicitar cadastro</Link>
      </p>
    </AuthPageShell>
  )
}

export default Login
