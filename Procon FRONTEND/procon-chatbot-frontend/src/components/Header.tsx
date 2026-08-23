import logo from '../assets/procon-logo.jpg'
import { Link } from 'react-router-dom'
import Icon from './Icon'

function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <img src={logo} alt="PROCON Jacareí" className="header-logo" />
        <div>
          <strong>PROCON Jacareí</strong>
          <span>Portal do funcionário</span>
        </div>
      </div>

      <div className="header__actions">
        <span className="header__environment"><Icon name="lock" size={15} /> Ambiente interno</span>
        <Link className="header__logout" to="/login"><Icon name="log-out" size={18} /><span>Sair</span></Link>
      </div>
    </header>
  )
}

export default Header
