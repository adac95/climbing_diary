// src/services/auth.client.js
// Contiene SOLO funcionalidad del lado del cliente

import { getSupabase } from '@utils/supabase/client';
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
 * Servicios de autenticación para el cliente
 * Seguro para usar en componentes 'use client'
 */
const ClientAuth = {
  /**
   * Inicia sesión con credenciales
   */
  async login({ email, password }) {
    try {
      const supabase = getSupabase();
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
   * Cierra la sesión del usuario
   * Incluye limpieza de servidor y cliente
   */
  async logout() {
    try {
      // 1. Llamar al endpoint API para cerrar sesión del lado del servidor
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error en el servidor');
      }

      // 2. Adicionalmente, cerramos sesión en el cliente
      const supabase = getSupabase();
      await supabase.auth.signOut();
      
      // 3. Limpieza adicional de localStorage para mayor seguridad
      try {
        // Buscar y eliminar cualquier elemento de localStorage relacionado con auth
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('supabase') || key.startsWith('sb-'))) {
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        console.warn('Error al limpiar localStorage:', e);
      }

      return { success: true };
    } catch (error) {
      console.error('Error en logout (cliente):', error);
      return {
        success: false,
        error: error.message || ERROR_MESSAGES.SERVER_ERROR
      };
    }
  },

  /**
   * Obtiene la sesión actual (útil para UI, no para autenticación)
   */
  async getCurrentSession() {
    try {
      const supabase = getSupabase();
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      return session;
    } catch (error) {
      console.error('Error al obtener sesión:', error);
      return null;
    }
  },
  
  /**
   * Verifica la autenticación del usuario de forma segura
   */
  async getAuthenticatedUser() {
    try {
      const supabase = getSupabase();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) throw error;

      return user;
    } catch (error) {
      console.error('Error al verificar usuario autenticado:', error);
      return null;
    }
  },

  /**
   * Devuelve la instancia de Supabase
   */
  getSupabaseInstance() {
    return getSupabase();
  }
};

export default ClientAuth;
