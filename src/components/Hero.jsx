import React from 'react';
import { Link } from 'react-router-dom';
function Hero() {
  return (
    <main className="main">
      <div className="container">
        <div className="main__content">
          <div className="main__top">
            <h1>Ласкаво просимо до всесвіту зоряних війн!</h1>
            <div className="main__top-group">
              <div className="text">
                Оберіть пункт меню щоб переглянути інформацію
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Hero;
