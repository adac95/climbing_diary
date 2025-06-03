'use server';

import { createClient } from '@utils/supabase/server';
import { isValidEmail, isStrongPassword } from '@utils/security';

// Tiempo mínimo de espera para prevenir ataques de fuerza bruta (en ms)
const MIN_AUTH_DELAY = 500;

// Control de intentos de inicio de sesión
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

export const loginAction = async (formData) => {
  const startTime = Date.now();
  const ip = formData.get('_ip') || 'unknown';
  const userAgent = formData.get('_ua') || 'unknown';
  
  // Validar datos de entrada
  const email = formData.get('email')?.toString().trim() || '';
  const password = formData.get('password')?.toString() || '';
  
  // Validaciones básicas
  if (!email || !password) {
    return { 
      success: false, 
      error: 'Email y contraseña son requeridos',
      code: 'MISSING_CREDENTIALS'
    };
  }
  
  if (!isValidEmail(email)) {
    return { 
      success: false, 
      error: 'El formato del correo electrónico no es válido',
      code: 'INVALID_EMAIL'
    };
  }
  
  // Verificar intentos fallidos
  const attemptKey = `${ip}:${email}`;
  const attempts = loginAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
  
  // Limpiar intentos antiguos
  if (Date.now() - attempts.lastAttempt > LOCKOUT_TIME) {
    loginAttempts.delete(attemptKey);
  } else if (attempts.count >= MAX_ATTEMPTS) {
    const timeLeft = Math.ceil((attempts.lastAttempt + LOCKOUT_TIME - Date.now()) / 60000);
    return { 
      success: false, 
      error: `Demasiados intentos fallidos. Intenta de nuevo en ${timeLeft} minutos.`,
      code: 'TOO_MANY_ATTEMPTS'
    };
  }
  
  try {
    // Crear cliente Supabase
    const supabase = await createClient();
    if (!supabase) {
      throw new Error('No se pudo inicializar el cliente de Supabase');
    }
    
    // Intentar autenticación
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Manejar errores de autenticación
    if (error) {
      // Registrar intento fallido
      const newAttempts = {
        count: attempts.count + 1,
        lastAttempt: Date.now()
      };
      loginAttempts.set(attemptKey, newAttempts);
      
      // Mensajes de error específicos
      let errorMessage = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
      let errorCode = 'AUTH_ERROR';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Correo electrónico o contraseña incorrectos.';
        errorCode = 'INVALID_CREDENTIALS';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor, verifica tu correo electrónico antes de iniciar sesión.';
        errorCode = 'EMAIL_NOT_VERIFIED';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Demasiados intentos. Por favor, espera un momento antes de intentar de nuevo.';
        errorCode = 'RATE_LIMIT_EXCEEDED';
      }
      
      return { 
        success: false, 
        error: errorMessage,
        code: errorCode
      };
    }
    
    // Verificar sesión
    if (!data?.session) {
      return { 
        success: false, 
        error: 'No se pudo iniciar sesión. Por favor, inténtalo de nuevo.',
        code: 'SESSION_ERROR'
      };
    }
    
    // Limpiar intentos fallidos en éxito
    loginAttempts.delete(attemptKey);
    
    // Registrar inicio de sesión exitoso
    console.log(`✅ Inicio de sesión exitoso para ${email} desde ${ip}`);
    
    // Asegurar un tiempo mínimo de respuesta para prevenir ataques de tiempo
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_AUTH_DELAY) {
      await new Promise(resolve => setTimeout(resolve, MIN_AUTH_DELAY - elapsed));
    }
    
    return { 
      success: true,
      userId: data.user.id,
      email: data.user.email
    };
    
  } catch (error) {
    console.error('Error en la autenticación:', {
      error: error.message,
      stack: error.stack,
      email,
      ip,
      userAgent
    });
    
    return { 
      success: false, 
      error: 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.',
      code: 'SERVER_ERROR'
    };
  }
};
