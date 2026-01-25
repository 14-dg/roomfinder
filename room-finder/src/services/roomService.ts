import { supabase } from "@/lib/supabase";
import type { RoomWithDetails } from "@/types/models";

export async function getAllRoomsWithDetails(): Promise<RoomWithDetails[]> {
    const {data, error} = await supabase.from("rooms").select("*, room_type:room_types(*), building:buildings(*, campus:campuses(*))");
    if(error) throw error;
    //Absicherung, data ist auf jeden fall vom Typ RoomWithDetails[]. Falls die Query null zurückgibt, wird [] verwendet.
    else return (data as RoomWithDetails[] || []);
}