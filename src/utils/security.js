import { AUTH_CONFIG } from '@/config/auth/server/security';

/**
 * Configuración centralizada de seguridad
 */
export const securityConfig = {
  headers: {
    // Headers de seguridad básicos
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      `connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
      "img-src 'self' data: https:",
      "font-src 'self'",
      "object-src 'none'",
      "media-src 'none'",
      "frame-src 'none'"
    ].join('; '),

    // HSTS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  },

  // Configuración de CORS
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 horas
  },

  // Configuración de cookies
  cookies: {
    // Cookies de sesión
    session: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: AUTH_CONFIG.SESSION_TTL
    },
    // Cookies de refresh token
    refresh: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: AUTH_CONFIG.REFRESH_TOKEN_TTL
    }
  },

  // Configuración de rate limiting
  rateLimit: {
    // Ventana global
    global: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100 // Límite de peticiones por ventana
    },
    // Ventana específica para autenticación
    auth: {
      windowMs: 60 * 60 * 1000, // 1 hora
      max: 5 // 5 intentos por hora
    }
  },

  // Validaciones de seguridad
  validation: {
    password: {
      minLength: 6,
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSpecialChars: false,
      maxLength: 128
    },
    email: {
      maxLength: 254, // RFC 5321
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    username: {
      minLength: 3,
      maxLength: 30,
      pattern: /^[a-zA-Z0-9_-]+$/
    }
  },

  // Configuración de sanitización
  sanitization: {
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    allowedAttributes: {
      'a': ['href', 'target']
    }
  },

  // Configuración de encriptación
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    saltLength: 64
  }
};

/**
 * Funciones de utilidad para seguridad
 */
export const securityUtils = {
  /**
   * Valida una contraseña según los criterios de seguridad
   */
  validatePassword(password) {
    const { validation: { password: rules } } = securityConfig;
    const errors = [];

    if (password.length < rules.minLength) {
      errors.push(`Debe tener al menos ${rules.minLength} caracteres.`);
    }

    if (password.length > rules.maxLength) {
      errors.push(`No debe exceder los ${rules.maxLength} caracteres.`);
    }

    if (rules.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una letra mayúscula.');
    }

    if (rules.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una letra minúscula.');
    }

    if (rules.requireNumbers && !/[0-9]/.test(password)) {
      errors.push('Debe contener al menos un número.');
    }

    if (rules.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Debe contener al menos un carácter especial.');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * Sanitiza texto para prevenir XSS
   */
  sanitizeInput(input) {
    // Implementar sanitización según configuración
    return input.replace(/[<>]/g, '');
  },

  /**
   * Genera un token seguro
   */
  generateSecureToken(length = 32) {
    return crypto.getRandomValues(new Uint8Array(length))
      .reduce((acc, val) => acc + val.toString(16).padStart(2, '0'), '');
  }
};

/**
 * Middleware de seguridad
 */
export const securityMiddleware = {
  /**
   * Aplica headers de seguridad
   */
  applySecurityHeaders(req, res) {
    Object.entries(securityConfig.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
  },

  /**
   * Aplica rate limiting
   */
  applyRateLimit(req, res, options = {}) {
    const config = options.auth ? 
      securityConfig.rateLimit.auth : 
      securityConfig.rateLimit.global;

    const store = new Map();
    const key = options.key || req.ip;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Limpiar entradas antiguas
    for (const [storedKey, timestamp] of store.entries()) {
      if (timestamp < windowStart) {
        store.delete(storedKey);
      }
    }

    // Obtener intentos actuales
    const attempts = store.get(key) || [];
    const recentAttempts = attempts.filter(timestamp => timestamp > windowStart);

    if (recentAttempts.length >= config.max) {
      const oldestAttempt = Math.min(...recentAttempts);
      const resetTime = new Date(oldestAttempt + config.windowMs);
      throw new Error(`Rate limit exceeded. Try again after ${resetTime.toISOString()}`);
    }

    // Registrar nuevo intento
    recentAttempts.push(now);
    store.set(key, recentAttempts);

    return {
      limit: config.max,
      remaining: config.max - recentAttempts.length,
      reset: new Date(now + config.windowMs)
    };
  }
};

// Exportar función de rate limit para uso directo
export const rateLimit = (key, options = {}) => {
  return securityMiddleware.applyRateLimit({ ip: key }, null, options);
};
