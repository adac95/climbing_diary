"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
// Iconos SVG inline para evitar dependencias externas
const UserIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
    <circle cx='12' cy='7' r='4'></circle>
  </svg>
);

const SettingsIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='3'></circle>
    <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.4.7.4 1.5 0 2.2v0c.12.24.19.5.2.8a2 2 0 0 1-2 2.2v0a2 2 0 0 1-1.9-2v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.4v0a1.7 1.7 0 0 0 0 2.5v0a1.7 1.7 0 0 0 1.1.6h.1a2 2 0 0 1 1.9 2.1v0a2 2 0 0 1-2 1.9h0a2 2 0 0 1-1.9-1.9v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.4v0a1.7 1.7 0 0 0 0 2.5v0a1.7 1.7 0 0 0 1.1.6h.1a2 2 0 0 1 1.9 2.1v0a2 2 0 0 1-2 1.9h0z'></path>
  </svg>
);

const LogOutIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'></path>
    <polyline points='16 17 21 12 16 7'></polyline>
    <line x1='21' y1='12' x2='9' y2='12'></line>
  </svg>
);

const ChevronDown = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <polyline points='6 9 12 15 18 9'></polyline>
  </svg>
);
import styles from "./Header.module.css";
import { getSupabase } from "@utils/supabase/client";
import { useRouter } from "next/navigation";
import ClientAuth from "@/services/auth.client"; // Usando el nuevo servicio de cliente

export default function UserMenu({ user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [supabase, setSupabase] = useState(null);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Inicializar Supabase solo en el cliente
    try {
      setSupabase(getSupabase());
    } catch (error) {
      console.error("Error al inicializar Supabase:", error);
    }
  }, []);

  // Función para manejar el cierre del menú al hacer clic fuera
  const handleClickOutside = useCallback(
    (event) => {
      // Solo actualizamos el estado si el menú está abierto
      if (
        isDropdownOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    },
    [isDropdownOpen]
  );

  // Configuramos el event listener
  useEffect(() => {
    const handleDocumentClick = (event) => handleClickOutside(event);
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [handleClickOutside]);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const result = await ClientAuth.logout();
      if (result.success) {
        // Redirección explícita después de un logout exitoso
        window.location.href = '/login'; // Usar window.location para forzar recarga completa
      } else {
        // Si AuthService.logout() devuelve un error, lo mostramos
        console.error("Error al cerrar sesión desde ClientAuth:", result.error);
        // Mostrar mensaje de error al usuario
        alert("Error al cerrar sesión. Por favor, intente de nuevo.");
      }
    } catch (error) {
      // Este catch es por si AuthService.logout() mismo lanza una excepción no controlada
      console.error("Error inesperado al cerrar sesión:", error);
      // Mostrar mensaje de error al usuario
      alert("Error al cerrar sesión. Por favor, intente de nuevo.");
    }
  }, []);

  // Obtener la inicial del nombre de usuario o correo
  const getUserInitials = () => {
    if (!user) return "U";
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return user.email ? user.email[0].toUpperCase() : "U";
  };

  return (
    <div className={styles.userMenuContainer} ref={menuRef}>
      <button
        onClick={handleDropdownToggle}
        className={`${styles.userMenuButton} ${
          isDropdownOpen ? styles.active : ""
        }`}
        aria-expanded={isDropdownOpen}
        aria-haspopup='true'
      >
        <div className={styles.userAvatar}>
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={user.email || "Usuario"}
              className={styles.avatarImage}
            />
          ) : (
            <span className={styles.userInitials}>{getUserInitials()}</span>
          )}
        </div>
        <span className={styles.userName}>
          {user
            ? user.user_metadata?.full_name || user.email.split("@")[0]
            : "Iniciar sesión"}
        </span>
        <span
          className={`${styles.chevron} ${
            isDropdownOpen ? styles.chevronUp : ""
          }`}
        >
          <ChevronDown />
        </span>
      </button>

      {isDropdownOpen && (
        <div className={styles.dropdown}>
          {user ? (
            <>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.email}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <span className={styles.userInitials}>
                      {getUserInitials()}
                    </span>
                  )}
                </div>
                <div className={styles.userDetails}>
                  <div className={styles.userName}>
                    {user.user_metadata?.full_name || "Usuario"}
                  </div>
                  <div className={styles.userEmail}>{user.email}</div>
                </div>
              </div>

              <ul className={styles.menuList}>
                <li>
                  <Link
                    href='/profile'
                    className={styles.menuItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <span className={styles.menuIcon}>
                      <UserIcon />
                    </span>
                    <span>Mi perfil</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href='/settings'
                    className={styles.menuItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <span className={styles.menuIcon}>
                      <SettingsIcon />
                    </span>
                    <span>Configuración</span>
                  </Link>
                </li>
                <li className={styles.divider}></li>
                <li>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className={styles.menuItem}
                  >
                    <span className={styles.menuIcon}>
                      <LogOutIcon />
                    </span>
                    <span>Cerrar sesión</span>
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <ul className={styles.menuList}>
              <li>
                <Link
                  href='/login'
                  className={styles.menuItem}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span>Iniciar sesión</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/signup'
                  className={styles.menuItem}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span>Crear cuenta</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
