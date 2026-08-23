import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Agendamentos from './pages/Agendamentos'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import RecuperarSenha from './pages/RecuperarSenha'
import AtendimentoDetalhes from './pages/AtendimentoDetalhes'
import Disponibilidade from './pages/Disponibilidade'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />

      <Route path="/inicio" element={<Layout><Home /></Layout>} />
      <Route path="/agendamentos" element={<Layout><Agendamentos /></Layout>} />
      <Route path="/agendamentos/:id" element={<Layout><AtendimentoDetalhes /></Layout>} />
      <Route path="/disponibilidade" element={<Layout><Disponibilidade /></Layout>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
