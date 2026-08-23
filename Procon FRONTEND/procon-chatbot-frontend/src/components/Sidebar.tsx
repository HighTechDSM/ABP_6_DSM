import { NavLink } from 'react-router-dom'
import Icon from './Icon'

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav aria-label="Navegação principal">
        <span className="sidebar__label">Menu principal</span>
        <NavLink to="/inicio"><Icon name="home" /> <span>Início</span></NavLink>
        <NavLink to="/agendamentos"><Icon name="calendar" /> <span>Agendamentos</span></NavLink>
        <NavLink to="/disponibilidade"><Icon name="clock" /> <span>Disponibilidade</span></NavLink>
      </nav>

      <div className="sidebar__privacy">
        <Icon name="shield" size={20} />
        <div><strong>Dados protegidos</strong><span>Acesso sujeito às regras da LGPD.</span></div>
      </div>
    </aside>
  )
}

export default Sidebar
