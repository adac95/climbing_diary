import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Esta ruta se usa para manejar callbacks de autenticación desde el servidor
export async function GET(request) {
  try {
    // Obtener el código de la URL
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const type = requestUrl.searchParams.get("type");

    // Si no hay código, retornamos un error
    if (!code) {
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=missing_code`
      );
    }

    // Crear cliente de Supabase
    const supabase = await createSupabaseServerClient();

    // Intercambiar el código por una sesión
    // Esto automáticamente maneja la configuración de cookies
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error en callback de autenticación:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=auth_callback_error`
      );
    }

    // Determinar adónde redirigir según el tipo
    let redirectTo = "/";

    if (type === "recovery") {
      redirectTo = "/reset-password";
    } else if (type === "signup" && data?.user) {
      // Para signup confirmado, redirigir al dashboard
      redirectTo = "/";
    }

    // Redirección exitosa
    return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);
  } catch (error) {
    console.error("Error en auth callback:", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=server_error`
    );
  }
}
