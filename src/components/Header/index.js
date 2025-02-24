'use client'
import React, { useState } from 'react';
import styles from './Header.module.css'; // Importar el archivo CSS module
import Link from 'next/link';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={styles.header}> {/* Aplicar la clase CSS del archivo module */}
      <div className={styles.logo}>
        <img src="/path/to/logo.png" alt="Logo" />
      </div>
      <nav className={styles.options}>
        <ul>
          <Link href='/' >Inicio</Link>
          <Link href='/topos'>topos</Link>
          <Link href='/data'>data</Link>
        </ul>
      </nav>
      <div className={styles['user-management']}>
        <button onClick={handleDropdownToggle}>Usuarios</button>
        {isDropdownOpen && (
          <div className={styles.dropdown}>
            <ul>
              <li>Perfil</li>
              <li>Configuración</li>
              <li>Cerrar sesión</li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
