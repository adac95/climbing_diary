import { getSupabase } from "@utils/supabase/client";

export async function getAttemptsForLog(logId) {
    return await getSupabase()
      .from('user_route_attempts')
      .select('*')
      .eq('user_route_log_id', logId)
      .order('attempt_date', { ascending: false });
}
  
export async function createAttempt(data) {
    return await getSupabase()
      .from('user_route_attempts')
      .insert(data)
      .select()
      .single();
}