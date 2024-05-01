import React, { useState } from "react";
import { NavLink, useLocation, useHistory } from "react-router-dom";
import logo from "../images/logo.png";

function Header({ loggedIn, userEmail, onLogout }) {
  const location = useLocation();
  const history = useHistory();
  const [menuOpen, setMenuOpen] = useState(false);

  const inLoginPage = location.pathname === "/signin";
  const inRegisterPage = location.pathname === "/signup";
  const inHomePage = location.pathname === "/";

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem('jwt');
    history.push('/signin');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); 
  };

  return (
    <header className={`header ${menuOpen ? 'menu-open' : ''}`}>
        <div className="header__logo-container">
        <img className="header__logo" src={logo} alt="Ao redor dos EUA Logo" />
        {(loggedIn && inHomePage) && (
        <div className="menu-button" onClick={toggleMenu}>
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>
        )}
        {inLoginPage && (
        <NavLink to="/signup" className="header__link">
          Registrar
        </NavLink>
      )}
      {inRegisterPage && (
        <NavLink to="/signin" className="header__link">
          Faça o Login
        </NavLink>
      )}
      </div>
      {(loggedIn && inHomePage) && (
        <div className={`header__user-items ${menuOpen ? 'menu-open' : ''}`}>
          <span className="header__user-email">{userEmail}</span>
          <button className="header__logout-button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;