'use client';

import { useEffect, useState } from 'react';
import styles from './Message.module.css';

export default function Message({ message, type = 'error', onDismiss }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message || !isVisible) return null;

  return (
    <div className={`${styles.message} ${styles[type]}`}>
      {message}
    </div>
  );
}
