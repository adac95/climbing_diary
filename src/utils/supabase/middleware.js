import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { ROUTES } from '@/config/auth/server/routes';

// Opciones predeterminadas para cookies
const DEFAULT_COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true
};

/**
 * Actualiza la sesión de Supabase en middleware de Next.js
 * - Maneja cookies de autenticación
 * - Redirecciona a login cuando una ruta protegida es accedida sin autenticación
 * - Limpia cookies inválidas o expiradas
 */
export async function updateSession(request) {
  try {
    const { pathname } = request.nextUrl;
    
    // Inicializar respuesta
    const response = NextResponse.next({
      request: { headers: request.headers },
    });
    
    // Detectar casos especiales
    const isLogoutRequest = pathname === '/api/auth/logout';
    const isAuthCallback = pathname.startsWith('/auth/callback');
    
    // Crear cliente Supabase para el middleware
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name) => request.cookies.get(name)?.value,
          set: (name, value, options) => {
            // Si es logout o el valor está vacío, eliminar la cookie
            if (!value || isLogoutRequest && value === '') {
              response.cookies.set(name, '', {
                ...DEFAULT_COOKIE_OPTIONS,
                maxAge: 0
              });
            } else {
              // Para cookies normales
              response.cookies.set(name, value, {
                ...DEFAULT_COOKIE_OPTIONS,
                ...options
              });
            }
          },
          remove: (name) => {
            response.cookies.set(name, '', {
              ...DEFAULT_COOKIE_OPTIONS,
              maxAge: 0
            });
          }
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      }
    );
    
    // Para logout, simplemente devolver la respuesta
    if (isLogoutRequest) return response;
    
    // Para callbacks de auth, dejar que el handler se encargue
    if (isAuthCallback) return response;
    
    // Rutas de autenticación específicas donde usuarios ya autenticados no deben acceder
    const isAuthRoute = pathname === '/signup' || pathname === '/login' || pathname === '/register';
    
    // Verificar si la ruta es protegida
    const isProtectedRoute = ROUTES.PROTECTED.some(route => pathname.startsWith(route));
    
    // Realizar verificación de autenticación para rutas protegidas o rutas de autenticación
    if (isProtectedRoute || isAuthRoute) {
      // Inicializar sesión
      await supabase.auth.getSession();
      
      // Verificar si el usuario está autenticado
      const { data, error } = await supabase.auth.getUser();
      
      // Verificar si el usuario existe o no
      const userAuthenticated = data?.user && !error;
      
      // CASO 1: Usuario NO autenticado intentando acceder a rutas protegidas
      if (isProtectedRoute && !userAuthenticated) {
        // Limpiar todas las cookies de autenticación
        [
          'sb-access-token',
          'sb-refresh-token',
          'sb-provider-token',
          'sb-provider-refresh-token'
        ].forEach(cookieName => {
          if (request.cookies.has(cookieName)) {
            response.cookies.set(cookieName, '', {
              ...DEFAULT_COOKIE_OPTIONS,
              maxAge: 0
            });
          }
        });
        
        // Redirigir a login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectedFrom', pathname);
        loginUrl.searchParams.set('error', error ? 'auth_error' : 'session_expired');
        return NextResponse.redirect(loginUrl);
      }
      
      // CASO 2: Usuario autenticado intentando acceder a rutas de autenticación
      if (isAuthRoute && userAuthenticated) {
        // Redirigir al dashboard o página principal
        return NextResponse.redirect(new URL('/', request.url));
      }
    } else {
      // Para rutas no protegidas, solo inicializar la sesión sin verificación adicional
      await supabase.auth.getSession();
    }
    
    // Todo en orden, devolver respuesta con cookies actualizadas
    return response;
    
  } catch (error) {
    console.error('Error en middleware:', error);
    
    // En caso de error, permitir acceso a rutas públicas
    const pathname = request.nextUrl.pathname;
    if (ROUTES.PUBLIC.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }
    
    // Para el resto, redirigir a login
    return NextResponse.redirect(
      new URL(`/login?error=auth_error`, request.url)
    );
  }
}
