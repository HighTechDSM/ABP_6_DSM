import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthPageShell from '../components/AuthPageShell'

function RecuperarSenha() {
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <AuthPageShell
      eyebrow="Recuperação de acesso"
      title="Redefina sua senha"
      description="Informe seu e-mail institucional para receber as instruções de recuperação."
    >
      <Link className="employee-auth__back" to="/login">← Voltar para o login</Link>

      {sent ? (
        <div className="employee-auth__success" role="status">
          <span aria-hidden="true">✓</span>
          <h3>Solicitação enviada</h3>
          <p>Confira seu e-mail institucional. Enviamos as orientações para criar uma nova senha.</p>
          <Link className="employee-auth__primary" to="/login">Retornar ao login</Link>
        </div>
      ) : (
        <form className="employee-auth__form" onSubmit={handleSubmit}>
          <label htmlFor="recovery-email">E-mail institucional</label>
          <div className="employee-auth__field">
            <span aria-hidden="true">@</span>
            <input
              id="recovery-email"
              name="email"
              type="email"
              placeholder="nome@jacarei.sp.gov.br"
              autoComplete="email"
              required
            />
          </div>

          <div className="employee-auth__info">
            <strong>Importante</strong>
            <p>O link de recuperação será enviado somente para o e-mail institucional cadastrado.</p>
          </div>

          <button className="employee-auth__primary" type="submit">
            Enviar instruções <span aria-hidden="true">→</span>
          </button>
        </form>
      )}
    </AuthPageShell>
  )
}

export default RecuperarSenha
