import logo from '../assets/procon-logo.jpg'
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
      </div>
    </header>
  )
}

export default Header
