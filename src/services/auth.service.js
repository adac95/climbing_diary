import { requireAuth as serverRequireAuth } from '@utils/supabase/server';
import { getSupabase } from '@utils/supabase/client';
import { createSupabaseServerClient } from '@utils/supabase/server';
import { AUTH_CONFIG } from '@/config/auth/server/security';
import { ERROR_MESSAGES } from '@/config/auth/server/security';

// Caché de roles usando closure para encapsulamiento
const createRoleCache = () => {
  const cache = new Map();

  return {
    get: (userId, role) => {
      const key = `${userId}:${role}`;
      const cached = cache.get(key);
      
      if (cached && Date.now() - cached.timestamp < AUTH_CONFIG.CACHE_TTL) {
        return cached.hasRole;
      }
      return null;
    },
    
    set: (userId, role, hasRole) => {
      const key = `${userId}:${role}`;
      cache.set(key, {
        hasRole,
        timestamp: Date.now()
      });
    },
    
    clear: () => cache.clear()
  };
};

// Singleton para el caché de roles
const roleCache = createRoleCache();

// Funciones de autenticación del servidor
const serverAuth = {
  async requireAuth() {
    try {
      return await serverRequireAuth();
    } catch (error) {
      console.error('Error en requireAuth:', error);
      throw new Error(error.message || ERROR_MESSAGES.UNAUTHORIZED);
    }
  },

  async checkUserRole(roleRequired) {
    try {
      const { user, supabase } = await this.requireAuth();
      
      // Intentar obtener del caché primero
      const cachedRole = roleCache.get(user.id, roleRequired);
      if (cachedRole !== null) {
        return cachedRole;
      }

      // Si no está en caché, consultar la base de datos
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const hasRole = profile?.role === roleRequired;
      roleCache.set(user.id, roleRequired, hasRole);

      return hasRole;
    } catch (error) {
      console.error('Error al verificar rol:', error);
      return false;
    }
  },

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
  }
};

// Funciones de autenticación del cliente
const clientAuth = {
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

  async logout() {
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      return {
        success: false,
        error: ERROR_MESSAGES.SERVER_ERROR
      };
    }
  },

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
  }
};

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

// API pública
const AuthService = {
  // API del Servidor
  requireAuth: serverAuth.requireAuth.bind(serverAuth),
  checkUserRole: serverAuth.checkUserRole.bind(serverAuth),
  loginWithCredentials: serverAuth.loginWithCredentials.bind(serverAuth),

  // API del Cliente
  login: clientAuth.login,
  logout: clientAuth.logout,
  getCurrentSession: clientAuth.getCurrentSession,

  // Utilidades
  clearCaches: () => roleCache.clear()
};

export default AuthService; 