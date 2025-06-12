import ServerAuth from '@/services/auth.server';
import { ERROR_MESSAGES } from '@/config/auth/client/messages';
import { CLIENT_ERROR_MESSAGES } from '@/config/client/auth.messages';

/**
 * HOC para proteger rutas de API
 * @param {Function} handler - Manejador de la ruta de API
 * @param {Object} options - Opciones de configuración
 * @returns {Function} Manejador protegido
 */
export function createApiHandler(handler, options = {}) {
  return async (request, context) => {
    try {
      // Verificar autenticación usando ServerAuth
      const { session, user } = await ServerAuth.requireAuth();



      // Pasar la sesión y el usuario al manejador
      return await handler(request, { 
        ...context, 
        session, 
        user,
          // Sesión y usuario disponibles
          auth: {}
      });
    } catch (error) {
      console.error('API Error:', error);
      
      // Manejar errores específicos
      if (error.message === ERROR_MESSAGES.SESSION_EXPIRED) {
        return new Response(
          JSON.stringify({ error: ERROR_MESSAGES.SESSION_EXPIRED }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          error: ERROR_MESSAGES.SERVER_ERROR,
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

/**
 * HOC para proteger rutas de página
 * @param {Function} PageComponent - Componente de página
 * @param {Object} options - Opciones de configuración
 * @returns {Function} Componente protegido
 */
export function withAuth(PageComponent, options = {}) {
  return async function AuthProtectedPage(props) {
    try {
      const { session, user } = await ServerAuth.requireAuth();



      // Pasar datos de autenticación al componente
      return (
        <PageComponent
          {...props}
          session={session}
          user={user}
          auth={{}}
        />
      );
    } catch (error) {
      // Manejar errores de autenticación
      console.error('Page Auth Error:', error);
      throw error; // Next.js manejará el error
    }
  };
}
