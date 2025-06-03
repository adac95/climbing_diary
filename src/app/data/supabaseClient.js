import { createClient } from "@utils/supabase/client";

// Singleton para evitar múltiples instancias de Supabase en el cliente
let supabaseInstance = null;

export function getSupabase() {
  if (typeof window === 'undefined') {
    throw new Error('getSupabase solo debe usarse en el cliente');
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}