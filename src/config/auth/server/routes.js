// Configuración de rutas de la aplicación
export const ROUTES = {
  PUBLIC: [
    '/login',
    '/signup',
    '/auth',
    '/auth/callback',
    '/reset-password',
    '/verify',
    '/',
    '/about'
  ],
  PROTECTED: [
    '/dashboard',
    '/profile',
    '/api/private',
    '/data',
    '/topos',
    '/sessions',
    '/routes'
  ],
  STATIC: [
    '/_next',
    '/favicon.ico',
    '/api/auth',
    '/images',
    '/fonts',
    '/assets'
  ]
}; 