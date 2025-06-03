import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('❌ Variables de entorno de Supabase no definidas. Verifica NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          // Obtener la cookie del navegador
          const cookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1]
          return cookie ? decodeURIComponent(cookie) : undefined
        },
        set(name, value, options = {}) {
          // HttpOnly no es posible desde JS del cliente
          document.cookie = `${name}=${encodeURIComponent(value)}; path=/; ${
            options.secure ? 'Secure; ' : ''
          }${options.sameSite ? `SameSite=${options.sameSite}; ` : 'SameSite=Lax; '}${
            options.maxAge ? `Max-Age=${options.maxAge}; ` : ''
          }${options.domain ? `Domain=${options.domain}; ` : ''}`;
        },
        remove(name, options = {}) {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${
            options.domain ? `Domain=${options.domain}; ` : ''
          }`;
        },
      },
    }
  );
}