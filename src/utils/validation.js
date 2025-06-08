import { securityConfig, securityUtils } from './security';

// Expresiones regulares para validación
const REGEX = {
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
  NAME: /^[a-zA-ZÀ-ÿ\s]{2,100}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
};

// Función general de sanitización
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Eliminar caracteres potencialmente peligrosos
    .slice(0, 1000); // Limitar longitud
};

/**
 * Validadores centralizados
 */
export const validators = {
  /**
   * Valida un email
   */
  email(email) {
    const { validation: { email: rules } } = securityConfig;
    
    if (!email || typeof email !== 'string') {
      return {
        isValid: false,
        errors: ['El email es requerido']
      };
    }

    const sanitizedEmail = email.trim().toLowerCase();
    
    return {
      isValid: 
        sanitizedEmail.length <= rules.maxLength &&
        rules.pattern.test(sanitizedEmail),
      errors: []
    };
  },

  /**
   * Valida un nombre de usuario
   */
  username(username) {
    const { validation: { username: rules } } = securityConfig;
    
    if (!username || typeof username !== 'string') {
      return {
        isValid: false,
        errors: ['El nombre de usuario es requerido']
      };
    }

    const sanitizedUsername = username.trim();
    
    return {
      isValid: 
        sanitizedUsername.length >= rules.minLength &&
        sanitizedUsername.length <= rules.maxLength &&
        rules.pattern.test(sanitizedUsername),
      errors: []
    };
  },

  /**
   * Valida una contraseña
   */
  password: securityUtils.validatePassword,

  /**
   * Valida un perfil de usuario
   */
  userProfile(profile) {
    const errors = [];

    if (!profile) {
      return { 
        isValid: false, 
        errors: ['Perfil no válido'] 
      };
    }

    // Validar nombre de usuario
    const usernameValidation = this.username(profile.username);
    if (!usernameValidation.isValid) {
      errors.push(...usernameValidation.errors);
    }

    // Validar email
    const emailValidation = this.email(profile.email);
    if (!emailValidation.isValid) {
      errors.push(...emailValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  name: (name) => {
    if (!name || typeof name !== 'string') {
      return { isValid: false, error: 'El nombre es requerido' };
    }
    const sanitized = sanitizeInput(name);
    return {
      isValid: REGEX.NAME.test(sanitized) && sanitized.length >= 2 && sanitized.length <= 100,
      error: REGEX.NAME.test(sanitized) ? null : 'El nombre solo debe contener letras y espacios (2-100 caracteres)',
      sanitized
    };
  },

  url: (url) => {
    if (!url || typeof url !== 'string') return { isValid: false, error: 'La URL es requerida' };
    const sanitized = sanitizeInput(url);
    return {
      isValid: REGEX.URL.test(sanitized),
      error: REGEX.URL.test(sanitized) ? null : 'URL inválida',
      sanitized
    };
  },

  // Validador genérico para campos de texto
  text: (text, { minLength = 1, maxLength = 1000, required = true } = {}) => {
    if (!text && required) return { isValid: false, error: 'Campo requerido' };
    if (!text && !required) return { isValid: true, sanitized: '' };
    
    const sanitized = sanitizeInput(text);
    const isValid = sanitized.length >= minLength && sanitized.length <= maxLength;
    
    return {
      isValid,
      error: isValid ? null : `El texto debe tener entre ${minLength} y ${maxLength} caracteres`,
      sanitized
    };
  },

  // Validador para números
  number: (value, { min = null, max = null, required = true } = {}) => {
    if (value === '' && !required) return { isValid: true, sanitized: null };
    if (value === '' && required) return { isValid: false, error: 'Campo requerido' };
    
    const number = Number(value);
    if (isNaN(number)) return { isValid: false, error: 'Debe ser un número válido' };
    
    const isValid = (min === null || number >= min) && (max === null || number <= max);
    return {
      isValid,
      error: isValid ? null : `El número debe estar entre ${min} y ${max}`,
      sanitized: number
    };
  }
};

/**
 * Validadores específicos de negocio
 */
export const businessValidators = {
  /**
   * Valida una sesión de escalada
   */
  climbingSession(session) {
    const errors = [];

    if (!session) {
      return { 
        isValid: false, 
        errors: ['Sesión no válida'] 
      };
    }

    // Validar fecha
    if (!session.date || !(new Date(session.date)).getTime()) {
      errors.push('La fecha es requerida y debe ser válida');
    }

    // Validar ubicación
    if (!session.location?.trim()) {
      errors.push('La ubicación es requerida');
    }

    // Validar grado de dificultad
    if (session.grade && !isValidGrade(session.grade)) {
      errors.push('El grado de dificultad no es válido');
    }

    // Validar tipo de escalada
    if (session.type && !['boulder', 'sport', 'trad', 'top-rope'].includes(session.type)) {
      errors.push('El tipo de escalada no es válido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Valida los datos de un topo
   * @param {Object} topo - Datos del topo
   * @returns {Object} - { isValid: boolean, errors: string[] }
   */
  topo: (topo) => {
    const errors = [];

    if (!topo) {
      return { isValid: false, errors: ['Topo no válido'] };
    }

    // Validar nombre
    if (!topo.name?.trim()) {
      errors.push('El nombre del topo es requerido');
    }

    // Validar descripción
    if (topo.description && topo.description.length > 1000) {
      errors.push('La descripción no puede exceder los 1000 caracteres');
    }

    // Validar imagen
    if (topo.image && !isValidImageUrl(topo.image)) {
      errors.push('La URL de la imagen no es válida');
    }

    // Validar coordenadas
    if (topo.coordinates && !isValidCoordinates(topo.coordinates)) {
      errors.push('Las coordenadas no son válidas');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

/**
 * Funciones auxiliares
 */
function isValidGrade(grade) {
  // Implementar validación de grados de escalada
  const validGrades = ['5a', '5b', '5c', '6a', '6b', '6c', '7a', '7b', '7c', '8a', '8b', '8c'];
  return validGrades.includes(grade);
}

const isValidImageUrl = (url) => {
  try {
    new URL(url);
    return url.match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null;
  } catch {
    return false;
  }
};

const isValidCoordinates = (coordinates) => {
  if (!coordinates?.latitude || !coordinates?.longitude) {
    return false;
  }
  
  const lat = parseFloat(coordinates.latitude);
  const lon = parseFloat(coordinates.longitude);
  
  return !isNaN(lat) && !isNaN(lon) && 
         lat >= -90 && lat <= 90 && 
         lon >= -180 && lon <= 180;
}; 