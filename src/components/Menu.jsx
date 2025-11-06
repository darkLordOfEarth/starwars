import React from 'react';
import { Link } from 'react-router-dom';
import * as pages from '../pages';

function Menu({ className }) {
  // соответствие технического имени страницы и отображаемого названия
  const titles = {
    Home: 'Головна',
    People: 'Персонажі',
    Films: 'Фільми'
  };

  // порядок вывода (по ключам из pages)
  const order = ['Home', 'People', 'Films'];

  const menuItems = Object.keys(pages)
    .filter((page) => page !== 'NotFound')
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .map((page) => ({
      id: page.toLowerCase(),
      name: titles[page] || page, // отображаемое название
      path: `/${page.toLowerCase() === 'home' ? '' : page.toLowerCase()}`
    }));

  return (
    <ul className={`menu menu__inner-list ${className || ''}`}>
      {menuItems.map((item) => (
        <li key={item.id} className={`menu-item menu-item-${item.id}`}>
          <Link to={item.path}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Menu;
