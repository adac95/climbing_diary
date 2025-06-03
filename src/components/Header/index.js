"use server";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "./UserMenu";
import styles from "./Header.module.css";
import logoImg from "../../public/assets/image.png";
import { createClient } from "@utils/supabase/server";

const Header = async () => {
  let user = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      // Opcional: loguear el error en un sistema externo
      user = null;
    } else {
      user = data?.user || null;
    }
  } catch (e) {
    // Manejo de error seguro
    user = null;
  }

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} aria-label="Ir al inicio">
        <Image 
          src={logoImg} 
          alt="Logo de la aplicación" 
          width={120} 
          height={40}
          priority
        />
      </Link>
      {/* Navegación principal */}
      <nav className={styles.options} aria-label="Navegación principal">
        <ul>
          <li>
            <Link href="/" className={styles.navLink} aria-current="page">
              Inicio
            </Link>
          </li>
          <li>
            <Link href="/topos" className={styles.navLink}>
              Topos
            </Link>
          </li>
          <li>
            <Link href="/data" className={styles.navLink}>
              Datos
            </Link>
          </li>
        </ul>
      </nav>
      <div className={styles.userManagement}>
        <UserMenu user={user} />
      </div>
    </header>
  );
};

export default Header;
