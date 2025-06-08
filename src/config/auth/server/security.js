// Mensajes de error del servidor
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Credenciales inválidas. Por favor, verifica tus datos.',
  EMAIL_NOT_VERIFIED: 'Por favor, verifica tu correo electrónico antes de iniciar sesión.',
  RATE_LIMIT: 'Demasiados intentos. Por favor, espera unos minutos.',
  ACCOUNT_LOCKED: 'Cuenta bloqueada temporalmente por seguridad.',
  SERVER_ERROR: 'Error del servidor. Por favor, inténtalo más tarde.',
  INVALID_MFA: 'Error en la autenticación de dos factores.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  UNAUTHORIZED: 'No tienes permiso para acceder a este recurso.'
};

// Configuración de autenticación
export const AUTH_CONFIG = {
  MIN_AUTH_DELAY: 500, // ms
  MAX_ATTEMPTS: 5,
  LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutos
  SESSION_TTL: 7 * 24 * 60 * 60, // 7 días
  REFRESH_TOKEN_TTL: 30 * 24 * 60 * 60, // 30 días
};

// Configuración de seguridad
export const SECURITY_CONFIG = {
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_CONFIG.SESSION_TTL
  },
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // Límite de peticiones por ventana
  }
};

// Cache TTLs
export const CACHE_CONFIG = {
  ROLE_CACHE_TTL: 5 * 60 * 1000, // 5 minutos
  SESSION_CACHE_TTL: 60 * 1000, // 1 minuto
  PROFILE_CACHE_TTL: 5 * 60 * 1000 // 5 minutos
}; 