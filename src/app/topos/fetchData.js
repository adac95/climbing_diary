"use server";

import { createClient } from "@utils/supabase/server";


export async function getAllRegions() {
  const supabase = await createClient();
  const { data } = await supabase.from("region").select();
  return data;
}

export async function getAllPlaces() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("place")
    .select(
      '*, region_id(id,name),approach(id,information,public_transport,private_transport),camping(id,is_available,price,name,information),lodge(id,is_available,price,name,information)'
    );

  return data;
}

export async function getAllSectos() {
  const supabase = await createClient();
  const { data } = await supabase.from("sector").select();
  return data;
}

export async function getAllRoutes() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("route").select(
    `
                   id,
                   name,
                   grade,
                   distance,
                   is_multipitch,
                   year_opened,
                   style_id (name),
                   sector_id,
                   number_of_route_in_picture,
                   route_developer (developer_id(id,name))
               `
  );
  return data;
}
