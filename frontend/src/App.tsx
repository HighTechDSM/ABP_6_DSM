import { Navigate, Route, Routes } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Agendamentos from './pages/Agendamentos'
import AtendimentoDetalhes from './pages/AtendimentoDetalhes'
import Disponibilidade from './pages/Disponibilidade'

function RotaFuncionario({ children }: PropsWithChildren) {
  const funcionarioLogado =
    sessionStorage.getItem('funcionarioLogado') === 'true'

  if (!funcionarioLogado) {
    return <Navigate to="/inicio" replace />
  }

  return children
}

/**
 * Protege a página de disponibilidade.
 *
 * Existem dois tipos de acesso:
 *
 * 1. Usuário comum:
 *    precisa ter recebido/digitado o código de liberação.
 *
 * 2. Funcionário:
 *    pode acessar diretamente após fazer login.
 *
 * Assim, o funcionário possui acesso às duas áreas,
 * enquanto o usuário comum continua tendo acesso
 * somente à disponibilidade.
 */
function RotaAgendamento({ children }: PropsWithChildren) {
  const agendamentoLiberado =
    sessionStorage.getItem('agendamentoLiberado') === 'true'

  const funcionarioLogado =
    sessionStorage.getItem('funcionarioLogado') === 'true'

  if (!agendamentoLiberado && !funcionarioLogado) {
    return <Navigate to="/inicio" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      {/* Rota inicial */}
      <Route
        path="/"
        element={<Navigate to="/inicio" replace />}
      />

      {/* Página inicial / login */}
      <Route
        path="/inicio"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      {/* ================================
          ÁREA DO FUNCIONÁRIO
          ================================ */}

      {/* Lista de agendamentos */}
      <Route
        path="/agendamentos"
        element={
          <RotaFuncionario>
            <Layout>
              <Agendamentos />
            </Layout>
          </RotaFuncionario>
        }
      />

      {/* Detalhes de um atendimento */}
      <Route
        path="/agendamentos/:id"
        element={
          <RotaFuncionario>
            <Layout>
              <AtendimentoDetalhes />
            </Layout>
          </RotaFuncionario>
        }
      />

      {/* ================================
          DISPONIBILIDADE
          ================================ */}

      {/* 
        Pode ser acessada:
        - pelo usuário comum após informar o código;
        - pelo funcionário após fazer login.
      */}
      <Route
        path="/disponibilidade"
        element={
          <RotaAgendamento>
            <Layout>
              <Disponibilidade />
            </Layout>
          </RotaAgendamento>
        }
      />

      {/* Qualquer rota inexistente volta para o início */}
      <Route
        path="*"
        element={<Navigate to="/inicio" replace />}
      />
    </Routes>
  )
}

export default App