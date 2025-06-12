       import { createSupabaseServerClient } from '@utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // 1. Crear cliente de Supabase para el servidor
    const supabase = await createSupabaseServerClient();
    
    // 2. Cerrar sesión en Supabase (invalidando tokens)
    await supabase.auth.signOut();
    
    // 3. Crear un objeto de respuesta
    const response = NextResponse.json({ 
      success: true,
      message: 'Sesión cerrada correctamente'
    });
    
    // 4. Establecer cabeceras para eliminar todas las cookies de Supabase
    // Cookies estándar de Supabase
    response.headers.append('Set-Cookie', `sb-access-token=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly`);
    response.headers.append('Set-Cookie', `sb-refresh-token=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly`);
    
    // Cookie específica del proyecto Supabase
    response.headers.append('Set-Cookie', `sb-hcegmotvdidgavvacgcy-auth-token=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly`);

    return response;
  } catch (error) {
    console.error('Error en el endpoint de logout:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cerrar la sesión'
      },
      { status: 500 }
    );
  }
}
