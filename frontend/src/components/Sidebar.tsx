import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Icon from './Icon'

function Sidebar() {
  const [funcionarioLogado, setFuncionarioLogado] = useState(
    sessionStorage.getItem('funcionarioLogado') === 'true'
  )

  const [agendamentoLiberado, setAgendamentoLiberado] = useState(
    sessionStorage.getItem('agendamentoLiberado') === 'true'
  )

  useEffect(() => {
    function atualizarLoginFuncionario() {
      setFuncionarioLogado(
        sessionStorage.getItem('funcionarioLogado') === 'true'
      )
    }

    function atualizarLiberacao() {
      setAgendamentoLiberado(
        sessionStorage.getItem('agendamentoLiberado') === 'true'
      )
    }

    window.addEventListener(
      'funcionarioLogin',
      atualizarLoginFuncionario
    )

    window.addEventListener(
      'funcionarioLogout',
      atualizarLoginFuncionario
    )

    window.addEventListener(
      'agendamentoLiberado',
      atualizarLiberacao
    )

    window.addEventListener(
      'encerrarSessaoUsuario',
      atualizarLiberacao
    )

    return () => {
      window.removeEventListener(
        'funcionarioLogin',
        atualizarLoginFuncionario
      )

      window.removeEventListener(
        'funcionarioLogout',
        atualizarLoginFuncionario
      )

      window.removeEventListener(
        'agendamentoLiberado',
        atualizarLiberacao
      )

      window.removeEventListener(
        'encerrarSessaoUsuario',
        atualizarLiberacao
      )
    }
  }, [])

  // O acesso à disponibilidade pode ser feito:
  // - pelo usuário comum após informar o código;
  // - pelo funcionário após fazer login.
  const podeAcessarDisponibilidade =
    agendamentoLiberado || funcionarioLogado

  return (
    <aside className="sidebar">
      <nav aria-label="Navegação principal">
        <span className="sidebar__label">
          Menu principal
        </span>

        {/* Início */}
        <NavLink
          to="/inicio"
          className="sidebar__link"
        >
          <Icon name="home" />
          <span>Início</span>
        </NavLink>

        {/* Disponibilidade
            Usuário comum: aparece após código
            Funcionário: aparece após login
        */}
        {podeAcessarDisponibilidade && (
          <NavLink
            to="/disponibilidade"
            className="sidebar__link"
          >
            <Icon name="clock" />
            <span>Agendamentos</span>
          </NavLink>
        )}

        {/* Área exclusiva do funcionário */}
        {funcionarioLogado && (
          <NavLink
            to="/agendamentos"
            className="sidebar__link"
          >
            <Icon name="calendar" />
            <span>Lista</span>
          </NavLink>
        )}

        {/* Login do funcionário */}
        <NavLink
          to="/inicio"
          state={{ abrirLoginFuncionario: true }}
          className="sidebar__link"
        >
          <span>Funcionário</span>
        </NavLink>
      </nav>

      <div className="sidebar__privacy">
        <Icon name="shield" size={20} />

        <div>
          <strong>Dados protegidos</strong>
          <span>
            Acesso sujeito às regras da LGPD.
          </span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar