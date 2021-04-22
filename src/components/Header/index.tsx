import React from 'react';
import styles from './styles.module.scss'
// import { Container } from './styles';

const Header: React.FC = () => {
  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr"/>
      <p>O melhor para você ouvir sempre</p>
      <span>Quinta, 8 Abril</span>
    </header>  
  );
}

export default Header;