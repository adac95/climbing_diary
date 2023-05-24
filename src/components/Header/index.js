import React, { useState } from 'react';
import styles from './Header.module.css'; // Importar el archivo CSS module

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
          <li>Inicio</li>
          <li>Acerca de</li>
          <li>Servicios</li>
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
