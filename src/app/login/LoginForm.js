'use client';

import { useState } from 'react';
import styles from './login.module.css';
import Message from '@components/Message';
import { login, signup } from './actions';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('error');
  const router = useRouter();

  async function handleAction(formData, action) {
    const result = await action(formData);
    
    if (result?.error) {
      setMessageType('error');
      setMessage(result.error);
    } else if (result?.success) {
      setMessageType('success');
      setMessage(result.success);
    } else {
      // Si no hay error ni mensaje de éxito, significa que el login fue exitoso
      // y ya fuimos redirigidos
      router.refresh();
    }
  }

  return (
    <div className={styles.loginCard}>
      <div className={styles.header}>
        <h2 className={styles.title}>Climbing Diary</h2>
        <p className={styles.subtitle}>Inicia sesión o regístrate para continuar</p>
      </div>

      {message && (
        <Message 
          message={message} 
          type={messageType}
          onDismiss={() => setMessage(null)}
        />
      )}

      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={styles.input}
            placeholder="tu@email.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className={styles.input}
            placeholder="••••••••"
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            formAction={(formData) => handleAction(formData, login)}
            className={styles.loginButton}
          >
            Iniciar sesión
          </button>
          <button
            type="submit"
            formAction={(formData) => handleAction(formData, signup)}
            className={styles.signupButton}
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  );
}
