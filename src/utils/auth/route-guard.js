import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function requireAuth() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: 'No autorizado', status: 401 };
  }

  return { session };
}

export function createApiHandler(handler) {
  return async (request, context) => {
    try {
      const { error: authError, session } = await requireAuth();
      
      if (authError) {
        return new Response(
          JSON.stringify({ error: authError }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Pasar la sesión al manejador
      return await handler(request, { ...context, session });
    } catch (error) {
      console.error('API Error:', error);
      return new Response(
        JSON.stringify({ error: 'Error interno del servidor' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}
