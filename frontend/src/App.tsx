import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Agendamentos from './pages/Agendamentos'
import AtendimentoDetalhes from './pages/AtendimentoDetalhes'
import Disponibilidade from './pages/Disponibilidade'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inicio" replace />} />
      <Route path="/inicio" element={<Layout><Home /></Layout>} />
      <Route path="/agendamentos" element={<Layout><Agendamentos /></Layout>} />
      <Route path="/agendamentos/:id" element={<Layout><AtendimentoDetalhes /></Layout>} />
      <Route path="/disponibilidade" element={<Layout><Disponibilidade /></Layout>} />
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  )
}

export default App
