import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/procon-logo.jpg'

function Header() {
  const navigate = useNavigate()

  const [funcionarioLogado, setFuncionarioLogado] = useState(
    sessionStorage.getItem('funcionarioLogado') === 'true'
  )

  const [usuarioLogado, setUsuarioLogado] = useState(
    sessionStorage.getItem('agendamentoLiberado') === 'true'
  )

  useEffect(() => {
    function atualizarFuncionario() {
      setFuncionarioLogado(
        sessionStorage.getItem('funcionarioLogado') === 'true'
      )
    }

    function atualizarUsuario() {
      setUsuarioLogado(
        sessionStorage.getItem('agendamentoLiberado') === 'true'
      )
    }

    window.addEventListener(
      'funcionarioLogin',
      atualizarFuncionario
    )

    window.addEventListener(
      'funcionarioLogout',
      atualizarFuncionario
    )

    window.addEventListener(
      'agendamentoLiberado',
      atualizarUsuario
    )

    window.addEventListener(
      'encerrarSessaoUsuario',
      atualizarUsuario
    )

    return () => {
      window.removeEventListener(
        'funcionarioLogin',
        atualizarFuncionario
      )

      window.removeEventListener(
        'funcionarioLogout',
        atualizarFuncionario
      )

      window.removeEventListener(
        'agendamentoLiberado',
        atualizarUsuario
      )

      window.removeEventListener(
        'encerrarSessaoUsuario',
        atualizarUsuario
      )
    }
  }, [])

  function encerrarSessao() {
    if (funcionarioLogado) {
      sessionStorage.removeItem('funcionarioLogado')

      window.dispatchEvent(
        new Event('funcionarioLogout')
      )
    }

    if (usuarioLogado) {
      sessionStorage.removeItem('agendamentoLiberado')

      window.dispatchEvent(
        new Event('encerrarSessaoUsuario')
      )
    }

    navigate('/inicio', { replace: true })
  }

  const mostrarEncerrarSessao =
    funcionarioLogado || usuarioLogado

  return (
    <header className="header">
      <div className="header__brand">
        <img
          src={logo}
          alt="PROCON Jacareí"
          className="header-logo"
        />

        <div>
          <strong>PROCON Jacareí</strong>
          <span>Portal de Agendamentos</span>
        </div>
      </div>

      {mostrarEncerrarSessao && (
        <button
          type="button"
          className="header__logout"
          onClick={encerrarSessao}
        >
          Encerrar sessão
        </button>
      )}
    </header>
  )
}

export default Header
