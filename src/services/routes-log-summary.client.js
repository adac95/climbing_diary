import { getSupabase } from "@/utils/supabase/client";

export async function getRouteLogSummary(userId, routeId) {
    return await getSupabase()
      .from('user_routes_log_summary')
      .select('*')
      .eq('user_id', userId)
      .eq('route_id', routeId)
      .single();
  }
  