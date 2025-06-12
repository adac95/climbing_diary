import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createSupabaseServerClient = async () => {
  try {
    const cookieStore = await cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Variables de entorno de Supabase no definidas");
    }

    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          try {
            return cookieStore.get(name)?.value ?? null;
          } catch (error) {
            console.error("Error al leer cookie en el servidor:", error);
            return null;
          }
        },
        set(name, value, options) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
              httpOnly: true,
              path: "/",
            });
          } catch (error) {
            console.error("Error al establecer cookie en el servidor:", error);
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({
              name,
              value: "",
              ...options,
              maxAge: 0,
              path: "/",
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
            });
          } catch (error) {
            console.error("Error al eliminar cookie en el servidor:", error);
          }
        },
      },
      auth: {
        autoRefreshToken: true,
        persistSession: true
      },
      global: {
        headers: {
          "x-application-name": "climbing-diary",
        },
      },
    });
  } catch (error) {
    console.error(
      "Error al crear el cliente de Supabase en el servidor:",
      error
    );
    throw error;
  }
};

// Función de ayuda para verificar la autenticación en Server Components
export async function requireAuth() {
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

    // Verificar si la sesión está activa y no ha expirado
    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at && session.expires_at < now) {
      throw new Error("Sesión expirada");
    }

    return {
      session,
      supabase,
      user: session.user,
    };
  } catch (error) {
    console.error("Error en requireAuth:", error);
    throw new Error(error.message || "No autorizado");
  }
}
