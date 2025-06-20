// src/services/route-attempts.server.js
import { createSupabaseServerClient } from '@utils/supabase/server';

export async function getAttemptsForLog(logId) {
  const supabase = await createSupabaseServerClient();
  return supabase
    .from('user_route_attempts')
    .select('*')
    .eq('user_route_log_id', logId)
    .order('attempt_date', { ascending: false });
}

export async function createAttempt(data) {
  const supabase = await createSupabaseServerClient();
  return supabase
    .from('user_route_attempts')
    .insert(data)
    .select()
    .single();
}