"use server";

import { createClient } from "@utils/supabase/server";
const supabase = await createClient();

export async function getAllRegions() {
  const { data } = await supabase.from("region").select();
  return data;
}

export async function getAllPlaces() {
  const { data } = await supabase
    .from("place")
    .select(
      "*, approach(information,public_transport,private_transport),camping(is_available,price),lodge(is_available,price),region_id(id,name)"
    );

  return data;
}

export async function getAllSectos() {
  const { data } = await supabase.from("sector").select();
  return data;
}

export async function getAllRoutes() {
  const { data, error } = await supabase.from("route").select(
    `
                   id,
                   name,
                   grade,
                   distance,
                   is_multipitch,
                   year_opened,
                   style_id,
                   number_of_route_in_picture,
                   route_developer (developer_id(id,name))
               `
  );

  return data;
}
