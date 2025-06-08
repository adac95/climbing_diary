import { NextResponse } from 'next/server';
import { updateSession } from '@utils/supabase/middleware';
import { ROUTES } from '@/config/auth/server/routes';

// Cache de rutas para optimizar el rendimiento
const routeCache = new Map();

// Función auxiliar para verificar rutas con cache
const matchesRoute = (pathname, routes) => {
  const cacheKey = `${pathname}:${routes.join(',')}`;
  
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey);
  }
  
  const result = routes.some(route => pathname.startsWith(route));
  routeCache.set(cacheKey, result);
  
  // Limpiar cache si es muy grande
  if (routeCache.size > 1000) {
    routeCache.clear();
  }
  
  return result;
};

export async function middleware(request) {
  try {
    const { pathname } = request.nextUrl;

    // 1. Permitir rutas estáticas sin procesar
    if (matchesRoute(pathname, ROUTES.STATIC) || 
        pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp)$/)) {
      return NextResponse.next();
    }

    // 2. Determinar tipo de ruta
    const isProtectedRoute = matchesRoute(pathname, ROUTES.PROTECTED);
    const isPublicRoute = matchesRoute(pathname, ROUTES.PUBLIC);

    // 3. Actualizar sesión de Supabase
    const response = await updateSession(request);

    // 4. Si es una ruta pública o no protegida, permitir acceso
    if (!isProtectedRoute || isPublicRoute) {
      return response;
    }

    // 5. Verificar sesión
    const hasValidSession = request.cookies.has('sb-access-token') && 
                          request.cookies.has('sb-refresh-token');

    if (!hasValidSession) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return response;

  } catch (error) {
    console.error('Error en middleware:', error);
    
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('error', 'session_error');
    return NextResponse.redirect(redirectUrl);
  }
}

// Configuración optimizada del middleware
export const config = {
  matcher: [
    // Rutas protegidas
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    // Rutas públicas que necesitan middleware
    '/login',
    '/register',
    '/reset-password',
    // Excluir archivos estáticos
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};
