import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <Link to="/">Início</Link>

        <Link to="/agendamentos">
          Agendamentos
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar