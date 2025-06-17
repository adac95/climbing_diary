"use server";

import { createSupabaseServerClient } from "@utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * API optimizada para obtener únicamente el nombre de una entidad (región, lugar o sector)
 * Solo devuelve el campo 'name' para minimizar la transferencia de datos
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    
    if (!type || !id) {
      return NextResponse.json({ error: "Faltan parámetros requeridos" }, { status: 400 });
    }
    
    const supabase = await createSupabaseServerClient();
    let tableName;
    
    // Determinar qué tabla consultar según el tipo
    switch (type) {
      case 'region':
        tableName = 'region';
        break;
      case 'place':
        tableName = 'place';
        break;
      case 'sector':
        tableName = 'sector';
        break;
      default:
        return NextResponse.json({ error: "Tipo no válido" }, { status: 400 });
    }
    
    // Consulta optimizada que solo obtiene el campo 'name'
    const { data, error } = await supabase
      .from(tableName)
      .select('name')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error al obtener nombre de ${type}:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en API get-entity-name:', error);
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
  }
}
