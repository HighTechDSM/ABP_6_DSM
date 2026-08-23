import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Agendamentos from './pages/Agendamentos'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/agendamentos"
          element={<Agendamentos />}
        />
      </Routes>
    </Layout>
  )
}

export default App