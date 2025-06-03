'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './server-actions';
import styles from "./login.module.css";

// Componente de mensaje de error
function ErrorMessage({ error, code }) {
  if (!error && !code) return null;
  
  const errorMessages = {
    'MISSING_CREDENTIALS': 'Por favor ingresa tu correo y contraseña.',
    'INVALID_EMAIL': 'El formato del correo electrónico no es válido.',
    'INVALID_CREDENTIALS': 'Correo electrónico o contraseña incorrectos.',
    'EMAIL_NOT_VERIFIED': 'Por favor, verifica tu correo electrónico antes de iniciar sesión.',
    'TOO_MANY_ATTEMPTS': 'Demasiados intentos fallidos. Por favor, espera un momento antes de intentar de nuevo.',
    'RATE_LIMIT_EXCEEDED': 'Demasiados intentos. Por favor, espera un momento antes de intentar de nuevo.',
    'SERVER_ERROR': 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.',
    'DEFAULT': 'Error al iniciar sesión. Por favor, inténtalo de nuevo.'
  };

  return (
    <div className={styles.errorMessage}>
      <p>{error || errorMessages[code] || errorMessages['DEFAULT']}</p>
      {process.env.NODE_ENV === 'development' && code && (
        <small className={styles.errorCode}>Código: {code}</small>
      )}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  
  // Generar token CSRF al montar el componente
  useEffect(() => {
    // Función segura para generar el token CSRF
    const generateCsrfToken = () => {
      try {
        // Usar crypto.getRandomValues si está disponible (navegadores modernos)
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
          const array = new Uint8Array(32);
          crypto.getRandomValues(array);
          return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        }
        // Fallback para entornos donde crypto no está disponible
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
      } catch (error) {
        console.error('Error generando token CSRF:', error);
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
      }
    };
    
    setCsrfToken(generateCsrfToken());
  }, []);
  
  // Obtener la IP del cliente
  const getClientIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch (error) {
      console.error('Error al obtener la IP:', error);
      return 'unknown';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica del lado del cliente
    if (!email || !password) {
      setFormError({
        message: 'Por favor ingresa tu correo y contraseña.',
        code: 'MISSING_CREDENTIALS'
      });
      return;
    }
    
    setIsLoading(true);
    setFormError(null);
    setFormSuccess(false);
    
    try {
      // Obtener información del cliente
      let ip = 'unknown';
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ip = data.ip || 'unknown';
      } catch (ipError) {
        console.error('Error al obtener la IP:', ipError);
      }
      
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
      
      // Crear FormData con los datos del formulario
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      if (csrfToken) {
        formData.append('_csrf', csrfToken);
      }
      formData.append('_ip', ip);
      formData.append('_ua', userAgent);
      
      // Llamar a la acción del servidor
      const result = await loginAction(formData);
      
      if (result?.success) {
        setFormSuccess(true);
        // Usar router.push para una navegación más limpia
        router.push('/');
      } else {
        setFormError({
          message: result?.error || 'Error al iniciar sesión',
          code: result?.code || 'AUTH_ERROR'
        });
      }
    } catch (error) {
      console.error('Error en el formulario:', error);
      setFormError({
        message: 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.',
        code: 'SERVER_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Eliminamos la función getClientIp ya que la hemos movido dentro de handleSubmit
  // para evitar problemas con el renderizado en el servidor

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Iniciar Sesión</h1>
          <p className={styles.subtitle}>Ingresa tus credenciales para continuar</p>
        </div>

        {/* Mostrar mensaje de error si existe */}
        {formError && (
          <div className={styles.errorMessage}>
            <p>{formError.message}</p>
            {formError.details && process.env.NODE_ENV === 'development' && (
              <pre className={styles.errorDetails}>
                {JSON.stringify(formError.details, null, 2)}
              </pre>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="tucorreo@ejemplo.com"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label htmlFor="password" className={styles.label}>Contraseña</label>
              <a href="/forgot-password" className={styles.forgotPassword}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              className={styles.loginButton} 
              disabled={isLoading}
              aria-busy={isLoading}
              aria-live="polite"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
            <button 
              type="button" 
              className={styles.signupButton}
              onClick={() => router.push('/signup')}
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              Crear cuenta
            </button>
          </div>
          
          <div className={styles.divider}>
            <span>o</span>
          </div>
          
          <button 
            type="button" 
            className={styles.googleButton}
            disabled={isLoading}
          >
            <svg className={styles.googleIcon} viewBox="0 0 24 24" width="18" height="18">
              <path 
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path 
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path 
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path 
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar con Google
          </button>
        </form>
      </div>
    </div>
  );
}
