'use client';

import { useEffect, useState } from 'react';
import styles from './Message.module.css';

export default function Message({ message, type = 'error', onDismiss, persistent = false }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      
      // Solo configurar el temporizador de auto-cierre si no es persistente
      if (!persistent) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onDismiss?.();
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [message, onDismiss, persistent]);

  // Manejador para cerrar manualmente
  const handleClose = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!message || !isVisible) return null;

  return (
    <div className={`${styles.message} ${styles[type]}`}>
      <div className={styles.messageContent}>
        {message}
      </div>
      <button 
        className={styles.closeButton} 
        onClick={handleClose}
        aria-label="Cerrar mensaje">
        ×
      </button>
    </div>
  );
}
