import { createSupabaseServerClient } from "@utils/supabase/server";

export async function getRouteLogSummary(userId, routeId) {
  const supabase = await createSupabaseServerClient();
  return supabase
    .from("user_routes_log_summary")
    .select("*")
    .eq("user_id", userId)
    .eq("route_id", routeId)
    .single();
}
