import type { ReactNode } from 'react'
import logo from '../assets/procon-logo.jpg'
import '../styles/auth.css'

interface AuthPageShellProps {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}

function AuthPageShell({ eyebrow, title, description, children }: AuthPageShellProps) {
  return (
    <div className="employee-auth">
      <section className="employee-auth__intro" aria-label="Portal interno do PROCON">
        <div className="employee-auth__brand">
          <img src={logo} alt="PROCON Jacareí" />
          <div>
            <strong>PROCON Jacareí</strong>
            <span>Portal interno</span>
          </div>
        </div>

        <div className="employee-auth__intro-copy">
          <span className="employee-auth__tag">Acesso exclusivo para funcionários</span>
          <h1>Atendimento ao consumidor com organização e segurança.</h1>
          <p>
            Consulte atendimentos, agendamentos e informações internas em um único ambiente de trabalho.
          </p>

          <div className="employee-auth__security">
            <span aria-hidden="true">✓</span>
            <div>
              <strong>Ambiente institucional protegido</strong>
              <small>Use somente suas credenciais funcionais para entrar.</small>
            </div>
          </div>
        </div>

        <small className="employee-auth__copyright">HighTech · 2026</small>
      </section>

      <main className="employee-auth__content">
        <div className="employee-auth__mobile-brand">
          <img src={logo} alt="" />
          <div><strong>PROCON Jacareí</strong><span>Portal interno</span></div>
        </div>

        <section className="employee-auth__card">
          <header className="employee-auth__heading">
            <span>{eyebrow}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </header>
          {children}
        </section>

        <p className="employee-auth__support">
          Problemas para acessar? Procure o administrador do sistema.
        </p>
      </main>
    </div>
  )
}

export default AuthPageShell
