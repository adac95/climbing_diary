import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Asegura que las variables de entorno estén definidas
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('❌ Las variables de entorno de Supabase no están definidas. Verifica NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

export async function createClient() {
  const cookieStore = await cookies();

  try {
    return createServerClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Puede ser llamado desde un Server Component, ignorar si hay middleware refrescando sesión
            }
          },
        },
      }
    );
  } catch (error) {
    // Mejor manejo de errores
    console.error('Error inicializando Supabase Client:', error);
    throw new Error('No se pudo inicializar el cliente de Supabase.');
  }
}