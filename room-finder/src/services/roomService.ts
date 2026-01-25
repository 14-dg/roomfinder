import { supabase } from "@/lib/supabase";
import type { NewRoom, Room, RoomWithDetails, UpdateRoom } from "@/types/models";

const ROOM_DETAILS_SELECT = "*, room_type:room_types(*), building:buildings(*, campus:campuses(*))";

export async function getAllRoomsWithDetails(): Promise<RoomWithDetails[]> {
    const {data, error} = await supabase
    .from("rooms")
    .select(ROOM_DETAILS_SELECT);

    if(error) throw error;

    //Absicherung, data ist auf jeden fall vom Typ RoomWithDetails[]. Falls die Query null zurückgibt, wird [] verwendet.
    return (data as RoomWithDetails[] || []);
}

export async function createRoom(newRoom: NewRoom): Promise<Room> {
    const {data, error} = await supabase
    .from("rooms")
    .insert(newRoom)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error("Room creation failed: No data returned");

    return data;
}

export async function updateRoom(id: number, updates: UpdateRoom): Promise<Room> {
    const {data, error} = await supabase
    .from("rooms")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error(`Room update failed: Room with ID ${id} not found or no data returned`);

    return data as Room;
}

export async function deleteRoom(id: number): Promise<void> {
    const {error} = await supabase
    .from("rooms")
    .delete()
    .eq("id",id);
    
    if(error) throw error;
}