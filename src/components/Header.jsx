import React from 'react';
import logoHeader from '../assets/images/logo.png';
import burgerIcon from '../assets/images/burger.svg';
import Menu from './Menu';
import BurgerMenu from './BurgerMenu';


function Header() {

  const handleBurgerClick = () => {
    const menu = document.querySelector('.burgerMenu');
    const burger__close = document.querySelector('.burger__close');
    const body = document.body;

    menu.classList.toggle('open');

    if (menu.classList.contains('open')) {
      let overlay = document.createElement('div');
      overlay.classList.add('overlay');
      body.appendChild(overlay);

      burger__close.addEventListener('click', () => {
        menu.classList.remove('open');
        overlay.remove();
        body.classList.remove('no-scroll');
      });
      overlay.addEventListener('click', () => {
        menu.classList.remove('open');
        overlay.remove();
        body.classList.remove('no-scroll');
      });

      body.classList.add('no-scroll');
    } else {
      const overlay = document.querySelector('.overlay');
      if (overlay) overlay.remove();
      body.classList.remove('no-scroll');
    }
  };

  return (
    <header>
      <div className="container">
        <div className="header__content">
          <a href="/" className="logo">
            <img loading="lazy" src={logoHeader} alt="star wars" />
          </a>

          <Menu />
          <BurgerMenu />
          <div className="header__group">
            <button type="button" className="burger" onClick={handleBurgerClick}>
              <img src={burgerIcon} alt="menu" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
