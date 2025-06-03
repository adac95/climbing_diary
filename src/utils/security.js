// Configuración de seguridad centralizada

export const securityHeaders = {
  // Prevención de clickjacking
  frameOptions: 'DENY',
  
  // Prevención de MIME type sniffing
  contentTypeOptions: 'nosniff',
  
  // Política de referer estricta
  referrerPolicy: 'strict-origin-when-cross-origin',
  
  // Política de permisos
  permissionsPolicy: 'camera=(), microphone=(), geolocation=()',
  
  // Configuración de CORS
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
  
  // Configuración de cookies seguras
  cookies: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 semana
  },
  
  // Configuración de rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por ventana
    message: 'Demasiadas peticiones desde esta IP, por favor inténtalo de nuevo más tarde.'
  }
};

// Validación de email
export function isValidEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

// Validación de contraseña
export function isStrongPassword(password) {
  // Al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
}

// Generador de tokens CSRF
export function generateCsrfToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Middleware de seguridad para rutas de API
export async function secureApiRoute(handler) {
  return async (req, res) => {
    // Verificar el método HTTP
    if (req.method !== 'POST' && req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Método no permitido' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar el encabezado Content-Type para solicitudes POST
    if (req.method === 'POST' && !req.headers.get('content-type')?.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Content-Type debe ser application/json' }),
        { status: 415, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Aplicar encabezados de seguridad
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-Content-Type-Options': securityHeaders.contentTypeOptions,
      'X-Frame-Options': securityHeaders.frameOptions,
      'Referrer-Policy': securityHeaders.referrerPolicy,
      'Permissions-Policy': securityHeaders.permissionsPolicy,
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    });

    try {
      // Ejecutar el manejador de la ruta
      const response = await handler(req);
      
      // Aplicar los encabezados de seguridad a la respuesta
      for (const [key, value] of headers.entries()) {
        response.headers.set(key, value);
      }
      
      return response;
    } catch (error) {
      console.error('Error en la ruta de la API:', error);
      return new Response(
        JSON.stringify({ error: 'Error interno del servidor' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}
