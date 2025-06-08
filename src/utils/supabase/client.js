import { createBrowserClient } from '@supabase/ssr'

export const createSupabaseClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('createSupabaseClient solo debe usarse en el cliente');
  }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Variables de entorno de Supabase no definidas');
    }

  return createBrowserClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name) {
            try {
              const cookie = document.cookie
                .split('; ')
                .find((row) => row.startsWith(`${name}=`));
              return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
            } catch (error) {
              console.error('Error al leer cookie:', error);
              return null;
            }
          },
          set(name, value, options = {}) {
            try {
              const secure = process.env.NODE_ENV === 'production' || options.secure;
              let cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax${secure ? '; Secure' : ''}`;
              
              if (options.maxAge) {
                cookie += `; Max-Age=${options.maxAge}`;
              }
              if (options.domain) {
                cookie += `; Domain=${options.domain}`;
              }
              
              document.cookie = cookie;
            } catch (error) {
              console.error('Error al establecer cookie:', error);
            }
          },
          remove(name) {
            try {
              document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
            } catch (error) {
              console.error('Error al eliminar cookie:', error);
            }
          },
        },
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce', // Usar PKCE para mayor seguridad
          storage: {
            getItem: (key) => {
              try {
                return window.localStorage.getItem(key);
              } catch {
                return null;
              }
            },
            setItem: (key, value) => {
              try {
                window.localStorage.setItem(key, value);
              } catch (error) {
                console.error('Error al guardar en localStorage:', error);
              }
            },
            removeItem: (key) => {
              try {
                window.localStorage.removeItem(key);
              } catch (error) {
                console.error('Error al eliminar de localStorage:', error);
              }
            }
          }
        },
        // Configuración global para todas las consultas
        global: {
          headers: {
            'x-application-name': 'climbing-diary'
          }
        },
        // Configuración de realtime para mejor rendimiento
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      }
    );
};

let supabaseInstance = null;

export function getSupabase() {
  if (!supabaseInstance) {
    try {
      supabaseInstance = createSupabaseClient();
    } catch (error) {
      console.error('Error al inicializar Supabase:', error);
      throw error;
  }
  }
  return supabaseInstance;
}

// Función para limpiar la instancia (útil para testing y casos especiales)
export function clearSupabaseInstance() {
  supabaseInstance = null;
}