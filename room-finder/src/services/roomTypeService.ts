import { supabase } from "@/lib/supabase";
import type { NewRoomType, RoomType, UpdateRoomType } from "@/types/models";

export async function getAllRoomTypes(): Promise<RoomType[]> {
    const {data, error} = await supabase
    .from("room_types")
    .select("*");

    if(error) throw error;

    //Absicherung, data ist auf jeden fall vom Typ RoomType[]. Falls die Query null zurückgibt, wird [] verwendet.
    return (data as RoomType[] || []);
}

export async function createRoomType(newRoomType: NewRoomType): Promise<RoomType> {
    const {data, error} = await supabase
    .from("room_types")
    .insert(newRoomType)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error("Room type creation failed: No data returned");

    return data;
}

export async function updateRoomType(id: string, updates: UpdateRoomType): Promise<RoomType> {
    const {data, error} = await supabase
    .from("room_types")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error(`Room type update failed: Room type with ID ${id} not found or no data returned`);

    return data;
}

export async function deleteRoomType(id: string): Promise<void> {
    const {error} = await supabase
    .from("room_types")
    .delete()
    .eq("id", id);
    
    if(error) throw error;
}