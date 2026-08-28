import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Conversa from './pages/Conversa'
import Historico from './pages/Historico'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inicio" replace />} />
      <Route path="/inicio" element={<Layout><Home /></Layout>} />
      <Route path="/conversa" element={<Layout><Conversa /></Layout>} />
      <Route path="/historico" element={<Layout><Historico /></Layout>} />
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  )
}

export default App
