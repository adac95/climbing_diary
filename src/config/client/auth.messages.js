// Mensajes de error para el cliente
export const CLIENT_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Credenciales inválidas. Por favor, verifica tus datos.',
  EMAIL_NOT_VERIFIED: 'Por favor, verifica tu correo electrónico antes de iniciar sesión.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  UNAUTHORIZED: 'No tienes permiso para acceder a este recurso.',
  SERVER_ERROR: 'Error del servidor. Por favor, inténtalo más tarde.',
};

// Rutas públicas que el cliente necesita conocer
export const CLIENT_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  HOME: '/',
  ABOUT: '/about',
};

// Roles visibles al cliente
export const CLIENT_ROLES = {
  USER: 'user',
  GUEST: 'guest'
}; 