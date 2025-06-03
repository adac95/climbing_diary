import { NextResponse } from 'next/server';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/signup', '/forgot-password', '/api/auth/callback'];

// Rutas protegidas que requieren autenticación
const protectedRoutes = ['/dashboard', '/profile', '/api/private'];

export async function middleware(request) {
  const requestUrl = new URL(request.url);
  const pathname = requestUrl.pathname;
  
  // Clonar los headers para modificarlos
  const requestHeaders = new Headers(request.headers);
  
  const isPublic = publicRoutes.some(route => pathname.startsWith(route));
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  // Si la ruta es pública o no es protegida, continúa sin verificar sesión
  if (isPublic || !isProtected) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  try {
    // Obtener la cookie de sesión directamente de los headers
    const sessionCookie = request.cookies.get('sb-access-token')?.value;
    
    // Si no hay cookie de sesión, redirigir al login
    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // No verificar la sesión aquí, solo dejar pasar si hay token
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (error) {
    // No exponer errores en producción
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'session_error');
    return NextResponse.redirect(loginUrl);
  }
}

// Configuración del middleware: evita archivos estáticos
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
