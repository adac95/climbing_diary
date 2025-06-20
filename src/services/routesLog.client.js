import { getSupabase } from "@utils/supabase/client";

export async function getUserRouteLog(userId, routeId) {
  return await getSupabase()
    .from("user_routes_log")
    .select("*")
    .eq("user_id", userId)
    .eq("route_id", routeId)
    .single();
}

export async function createUserRouteLog(data) {
  return await getSupabase()
    .from("user_routes_log")
    .insert(data)
    .select()
    .single();
}

export async function updateUserRouteLog(logId, data) {
  return await getSupabase()
    .from("user_routes_log")
    .update(data)
    .eq("id", logId);
}
