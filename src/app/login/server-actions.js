'use server';

import AuthService from '@/services/auth.service';
import { AUTH_CONFIG } from '@/config/auth/server/security';
import { ERROR_MESSAGES } from '@/config/auth/server/security';
import { rateLimit } from '@/utils/security';

// Control de intentos de inicio de sesión
const loginAttempts = new Map();

// Función para obtener la IP del cliente
const getClientIP = () => {
  // Implementar lógica para obtener IP del cliente
  return '127.0.0.1';
};

export async function loginAction(formData) {
  const startTime = Date.now();
  const ip = getClientIP();
  const attemptKey = `${ip}:login`;
  
  // Verificar bloqueo por intentos fallidos
  const attempts = loginAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
  if (attempts.count >= AUTH_CONFIG.MAX_ATTEMPTS) {
    const timeElapsed = Date.now() - attempts.lastAttempt;
    if (timeElapsed < AUTH_CONFIG.LOCKOUT_TIME) {
      const minutesLeft = Math.ceil((AUTH_CONFIG.LOCKOUT_TIME - timeElapsed) / 60000);
      return {
        success: false,
        error: `Cuenta bloqueada temporalmente. Intenta de nuevo en ${minutesLeft} minutos.`,
        code: 'ACCOUNT_LOCKED'
      };
    }
    // Resetear intentos si ya pasó el tiempo de bloqueo
    loginAttempts.delete(attemptKey);
  }

  // Validar rate limiting
  try {
    await rateLimit(ip);
  } catch (error) {
    return {
      success: false,
      error: ERROR_MESSAGES.RATE_LIMIT,
      code: 'RATE_LIMIT'
    };
  }

  // Validar datos del formulario
  const email = formData.get('email');
  const password = formData.get('password');
  
  if (!email || !password) {
    return {
      success: false,
      error: 'Email y contraseña son requeridos.',
      code: 'VALIDATION_ERROR'
    };
  }

  try {
    const result = await AuthService.loginWithCredentials({ email, password });

    if (!result.success) {
      // Registrar intento fallido
      const newAttempts = {
        count: attempts.count + 1,
        lastAttempt: Date.now()
      };
      loginAttempts.set(attemptKey, newAttempts);

      // Verificar si debemos bloquear la cuenta
      if (newAttempts.count >= AUTH_CONFIG.MAX_ATTEMPTS) {
        return {
          success: false,
          error: ERROR_MESSAGES.ACCOUNT_LOCKED,
          code: 'ACCOUNT_LOCKED'
        };
      }

      return result;
    }

    // Limpiar intentos fallidos en éxito
    loginAttempts.delete(attemptKey);

    // Asegurar tiempo mínimo de respuesta para prevenir timing attacks
    const elapsed = Date.now() - startTime;
    if (elapsed < AUTH_CONFIG.MIN_AUTH_DELAY) {
      await new Promise(resolve => setTimeout(resolve, AUTH_CONFIG.MIN_AUTH_DELAY - elapsed));
    }

    return result;
  } catch (error) {
    console.error('Error inesperado en login:', error);
    
    return {
      success: false,
      error: ERROR_MESSAGES.SERVER_ERROR,
      code: 'SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
}
