// src/services/auth.server.js
// Contiene SOLO funcionalidad del lado del servidor

import { requireAuth as serverRequireAuth } from '@utils/supabase/server';
import { createSupabaseServerClient } from '@utils/supabase/server';
import { ERROR_MESSAGES } from '@/config/auth/server/security';

// Función auxiliar para normalizar errores de autenticación
const normalizeAuthError = (error) => {
  const errorMessage = error?.message?.toLowerCase() || '';
  
  if (errorMessage.includes('invalid login credentials')) {
    return ERROR_MESSAGES.INVALID_CREDENTIALS;
  }
  if (errorMessage.includes('email not confirmed')) {
    return ERROR_MESSAGES.EMAIL_NOT_VERIFIED;
  }
  if (errorMessage.includes('too many requests')) {
    return ERROR_MESSAGES.RATE_LIMIT;
  }
  
  return ERROR_MESSAGES.SERVER_ERROR;
};

/**
 * Servicios de autenticación exclusivos del servidor
 */
const ServerAuth = {
  /**
   * Verifica que el usuario esté autenticado (seguro para Server Components)
   */
  async requireAuth() {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error al verificar usuario:", error);
        throw new Error("Error de autenticación");
      }

      if (!user) {
        throw new Error("No autorizado");
      }
      
      // También podemos obtener la sesión para datos adicionales si es necesario
      // pero solo después de verificar la autenticación con getUser()
      const { data: { session } } = await supabase.auth.getSession();

      return { user, session };
    } catch (error) {
      console.error('Error en requireAuth:', error);
      throw new Error(error.message || ERROR_MESSAGES.UNAUTHORIZED);
    }
  },

  /**
   * Autentica al usuario con credenciales (para Server Actions)
   */
  async loginWithCredentials({ email, password }) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) throw error;

      return {
        success: true,
        session: data.session
      };
    } catch (error) {
      return {
        success: false,
        error: normalizeAuthError(error)
      };
    }
  },

  /**
   * Verifica la autenticación del usuario de forma segura (Server)
   */
  async getAuthenticatedUser() {
    try {
      const supabase = await createSupabaseServerClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) throw error;

      return user;
    } catch (error) {
      console.error('Error al verificar usuario autenticado (servidor):', error);
      return null;
    }
  }
};

export default ServerAuth;
