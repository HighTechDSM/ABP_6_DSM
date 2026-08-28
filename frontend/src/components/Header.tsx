import logo from '../assets/procon-logo.jpg'
import Icon from './Icon'

function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <img src={logo} alt="PROCON Jacareí" className="header-logo" />
        <div>
          <strong>PROCON Jacareí</strong>
          <span>Orientação ao consumidor</span>
        </div>
      </div>

      <div className="header__actions">
        <span className="header__environment"><Icon name="shield" size={15} /> Ambiente protegido</span>
        <span className="header__context"><span aria-hidden="true" /> Canal digital</span>
      </div>
    </header>
  )
}

export default Header
