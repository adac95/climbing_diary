import { NextResponse } from "next/server";
import { updateSession } from "@utils/supabase/middleware";
import { ROUTES } from "@/config/auth/server/routes";

// Función auxiliar para verificar rutas (simplificada)
const matchesRoute = (pathname, routes) => {
  return routes.some((route) => pathname.startsWith(route));
};

export async function middleware(request) {
  try {
    const { pathname } = request.nextUrl;

    // 1. Permitir acceso directo a archivos estáticos
    if (pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp)$/)) {
      return NextResponse.next();
    }

    // 2. Rutas estáticas definidas en configuración
    if (matchesRoute(pathname, ROUTES.STATIC)) {
      return NextResponse.next();
    }
    
    // 3. Actualizar sesión en Supabase y obtener respuesta con cookies actualizadas
    // La función updateSession ya maneja la redirección para rutas protegidas
    // cuando el usuario no está autenticado
    const response = await updateSession(request);
    
    // 4. Añadir cabeceras de seguridad básicas
    const securityHeaders = {
      "X-XSS-Protection": "1; mode=block",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff"
    };
    
    // Añadir todas las cabeceras de seguridad
    Object.entries(securityHeaders).forEach(([header, value]) => {
      response.headers.set(header, value);
    });
    
    // Añadir HSTS solo en producción
    if (process.env.NODE_ENV === "production") {
      response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
      );
    }
    
    // 5. Devolver la respuesta (updateSession ya hizo todo lo necesario)
    return response;
    
  } catch (error) {
    console.error("Error en middleware:", error);
    
    // En caso de error, redirigir al login
    return NextResponse.redirect(
      new URL(`/login?error=session_error`, request.url)
    );
  }
}

// Configuración optimizada del middleware
export const config = {
  matcher: [
    // Rutas protegidas
    "/profile/:path*",
    "/settings/:path*",
    // Rutas públicas que necesitan middleware
    "/login",
    "/signup",
    "/register",
    "/reset-password",
    // Excluir archivos estáticos
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
