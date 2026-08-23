import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthPageShell from '../components/AuthPageShell'

function Cadastro() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    if (data.get('password') !== data.get('confirmPassword')) {
      setError('As senhas informadas não são iguais.')
      return
    }

    navigate('/login')
  }

  return (
    <AuthPageShell
      eyebrow="Novo acesso funcional"
      title="Solicite seu cadastro"
      description="Preencha os dados abaixo. O acesso será liberado após validação administrativa."
    >
      <Link className="employee-auth__back" to="/login">← Voltar para o login</Link>

      <form className="employee-auth__form employee-auth__form--compact" onSubmit={handleSubmit}>
        <div className="employee-auth__grid">
          <div>
            <label htmlFor="employee-name">Nome completo</label>
            <div className="employee-auth__field">
              <input id="employee-name" name="name" type="text" placeholder="Nome do funcionário" autoComplete="name" required />
            </div>
          </div>
          <div>
            <label htmlFor="employee-document">CPF</label>
            <div className="employee-auth__field">
              <input id="employee-document" name="document" type="text" placeholder="000.000.000-00" inputMode="numeric" required />
            </div>
          </div>
          <div>
            <label htmlFor="employee-registration">Matrícula</label>
            <div className="employee-auth__field">
              <input id="employee-registration" name="registration" type="text" placeholder="Número funcional" required />
            </div>
          </div>
          <div>
            <label htmlFor="employee-unit">Unidade</label>
            <div className="employee-auth__field">
              <input id="employee-unit" name="unit" type="text" placeholder="Unidade de lotação" required />
            </div>
          </div>
        </div>

        <label htmlFor="employee-email">E-mail institucional</label>
        <div className="employee-auth__field">
          <span aria-hidden="true">@</span>
          <input id="employee-email" name="email" type="email" placeholder="nome@jacarei.sp.gov.br" autoComplete="email" required />
        </div>

        <div className="employee-auth__grid">
          <div>
            <label htmlFor="employee-new-password">Crie uma senha</label>
            <div className="employee-auth__field">
              <input id="employee-new-password" name="password" type="password" placeholder="Mínimo de 8 caracteres" autoComplete="new-password" minLength={8} required />
            </div>
          </div>
          <div>
            <label htmlFor="employee-confirm-password">Confirmar senha</label>
            <div className="employee-auth__field">
              <input id="employee-confirm-password" name="confirmPassword" type="password" placeholder="Repita a senha" autoComplete="new-password" minLength={8} required />
            </div>
          </div>
        </div>

        {error && <p className="employee-auth__error" role="alert">{error}</p>}

        <label className="employee-auth__check">
          <input type="checkbox" required />
          <span>Confirmo que os dados informados são funcionais e estão corretos.</span>
        </label>

        <button className="employee-auth__primary" type="submit">
          Enviar solicitação <span aria-hidden="true">→</span>
        </button>
      </form>

      <p className="employee-auth__switch">
        Já possui acesso? <Link to="/login">Entrar</Link>
      </p>
    </AuthPageShell>
  )
}

export default Cadastro
