"use server";

import Link from "next/link";
import UserMenu from "./UserMenu";
import styles from "./Header.module.css";
import { createSupabaseServerClient } from "@utils/supabase/server";
import Header_home_svg from "./Header_home_svg";
import Logo_svg from "./Logo_svg";
import Header_topos_svg from "./Header_topos_svg";

const Header = async () => {
  let user = null;
  try {
    const supabase = await createSupabaseServerClient();
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
      <Link href='/' className={styles.logo} aria-label='Ir al inicio'>
        <Logo_svg />
      </Link>
      {/* Navegación principal */}
      <nav className={styles.options} aria-label='Navegación principal'>
        <ul>
          <li>
            <Link href='/' className={styles.navLink} aria-current='page'>
              <div className={styles.navLinkWithIcon}>
                <Header_home_svg width='40px' />
                <span>Inicio</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href='/topos' className={styles.navLink}>
              <div className={styles.navLinkWithIcon}>
                <Header_topos_svg width='40px' />
                <span>Topos</span>
              </div>
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
