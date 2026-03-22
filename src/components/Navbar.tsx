import { NavLink } from 'react-router-dom'
import { navItems } from '../data/movies'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__logo" aria-label="Netflix Clone">
        NETFLIX
      </div>
      <nav>
        <ul className="navbar__menu">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <button className="navbar__profile">R</button>
    </header>
  )
}

export default Navbar
