// src/services/routes-log.server.js
import { createSupabaseServerClient } from '@utils/supabase/server';

export async function getUserRouteLog(userId, routeId) {
  const supabase = await createSupabaseServerClient();
  return supabase
    .from('user_routes_log')
    .select('*')
    .eq('user_id', userId)
    .eq('route_id', routeId)
    .single();
}

export async function createUserRouteLog(data) {
  const supabase = await createSupabaseServerClient();
  return supabase
    .from('user_routes_log')
    .insert(data)
    .select()
    .single();
}

export async function updateUserRouteLog(logId, data) {
  const supabase = await createSupabaseServerClient();
  return supabase
    .from('user_routes_log')
    .update(data)
    .eq('id', logId);
}