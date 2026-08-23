import logo from '../assets/procon-logo.jpg'

function Header() {
  return (
    <header className="header">
      <img
        src={logo}
        alt="PROCON-SP Jacareí"
        className="header-logo"
      />

      <h1>PROCON Jacareí</h1>
    </header>
  )
}

export default Header