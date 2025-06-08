import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { ROUTES } from '@/config/auth/server/routes';

// Rutas de assets que siempre deben ser accesibles
const ASSET_ROUTES = ROUTES.STATIC;

export async function updateSession(request) {
  try {
    // Verificar si es una ruta de assets
    const { pathname } = request.nextUrl;
    if (ASSET_ROUTES.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Crear respuesta inicial
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Crear cliente Supabase
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          async get(name) {
            try {
              const cookie = request.cookies.get(name);
              return cookie?.value;
            } catch (error) {
              console.error('Error al leer cookie:', error);
              return null;
            }
          },
          async set(name, value, options) {
            try {
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              });
              response.cookies.set(name, value, {
                ...options,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                path: '/'
              });
            } catch (error) {
              console.error('Error al establecer cookie:', error);
            }
          },
          async remove(name, options) {
            try {
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              });
              response.cookies.set(name, '', {
                ...options,
                maxAge: 0,
                path: '/'
              });
            } catch (error) {
              console.error('Error al eliminar cookie:', error);
            }
          },
        },
        auth: {
          flowType: 'pkce',
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true
        }
      }
    );

    // Obtener usuario actual
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    // Verificar si la ruta requiere autenticación
    const isProtectedRoute = ROUTES.PROTECTED.some(route => pathname.startsWith(route));
    const isPublicRoute = ROUTES.PUBLIC.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
      if (sessionError || !session) {
        // Redirigir a login si no hay sesión válida
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Verificar si la sesión ha expirado
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at < now) {
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirectedFrom', pathname);
        redirectUrl.searchParams.set('error', 'expired_session');
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Actualizar la respuesta con la sesión
    return response;

  } catch (error) {
    console.error('Error en middleware:', error);
    
    // En caso de error, permitir el acceso solo a rutas públicas
    if (ROUTES.PUBLIC.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Redirigir a login para el resto
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('error', 'auth_error');
    return NextResponse.redirect(redirectUrl);
  }
}
