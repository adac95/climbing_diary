import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


export async function getAllRegions() {
    const supabase = createServerComponentClient({cookies})
    const {data} = await supabase.from('region').select()
    return data
}

export async function getAllPlaces() {
    const supabase = createServerComponentClient({cookies})
    const {data} = await supabase.from('place').select("*, approach(information,public_transport,private_transport),camping(is_available,price),lodge(is_available,price),region_id(id,name)")
    return data
}

export async function getAllSectos() {
    const supabase = createServerComponentClient({cookies})
    const {data} = await supabase.from('sector').select()
    return data
}

export async function getAllRoutes() {
    const supabase = createServerComponentClient({cookies})
    const {data} = await supabase.from('route').select()
    return data
}