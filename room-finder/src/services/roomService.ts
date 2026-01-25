import { supabase } from "@/lib/supabase";
import type { NewRoom, Room, RoomWithDetails, UpdateRoom } from "@/types/models";

export async function getAllRoomsWithDetails(): Promise<RoomWithDetails[]> {
    const {data, error} = await supabase.from("rooms").select("*, room_type:room_types(*), building:buildings(*, campus:campuses(*))");
    if(error) throw error;
    //Absicherung, data ist auf jeden fall vom Typ RoomWithDetails[]. Falls die Query null zurückgibt, wird [] verwendet.
    else return (data as RoomWithDetails[] || []);
}

export async function createRoom(newRoom: NewRoom): Promise<Room> {
    const {data, error} = await supabase.from("rooms").insert(newRoom).select().single();
    if(error) throw error;
    return data as Room;
}

export async function updateRoom(id: number, updates: UpdateRoom): Promise<Room> {
    const {data, error} = await supabase.from("rooms").update(updates).eq("id", id).select().single();
    if(error) throw error;
    return data as Room;
}

export async function deleteRoom(id: number) {
    const {error} = await supabase.from("rooms").delete().eq("id",id);
    if(error) throw error;
}