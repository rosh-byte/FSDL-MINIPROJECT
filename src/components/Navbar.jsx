import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <NavLink to="/" className="navbar__logo">
          <span className="navbar__logo-icon">♻</span>
          <span className="navbar__logo-text">
            Junk<span className="navbar__logo-accent">to</span>Gem
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="navbar__links">
          <NavLink to="/"          className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>Browse</NavLink>
          <NavLink to="/add"       className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>+ List Item</NavLink>
          <NavLink to="/profile"   className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>Profile</NavLink>
        </nav>

        {/* CTA */}
        <NavLink to="/add" className="navbar__cta">
          Donate or Request
        </NavLink>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          id="nav-hamburger"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`navbar__drawer${menuOpen ? ' open' : ''}`}>
        <NavLink to="/"        className="navbar__drawer-link">Browse Listings</NavLink>
        <NavLink to="/add"     className="navbar__drawer-link">+ List an Item</NavLink>
        <NavLink to="/profile" className="navbar__drawer-link">My Profile</NavLink>
      </div>
    </header>
  );
}
