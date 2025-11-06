import React from 'react';
import Menu from './Menu';
import { Link } from 'react-router-dom';
import logoHeader from '../assets/images/logo.png';
import burgerClose from '../assets/images/close.svg';
function BurgerMenu() {
  return (
    <div className="burgerMenu">
      <div className="burgerMenu__content">
        <div className="burgerMenu__heading">
          <Link to="/" className="logo">
            <img src={logoHeader} alt="star wars" />{' '}
          </Link>

          <Link to="#" className="burger__close">
            <img src={burgerClose} alt="close" />
          </Link>
        </div>

        <Menu className="header__menu" />
      </div>
      <div className="burgerMenu__footer">
      </div>
    </div>
  );
}

export default BurgerMenu;
