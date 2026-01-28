import { supabase } from "@/lib/supabase";
import type { NewRoomEquipment, RoomEquipment, UpdateRoomEquipment } from "@/types/models";

export async function getAllRoomEquipment(): Promise<RoomEquipment[]> {
    const {data, error} = await supabase
    .from("room_equipment")
    .select("*");

    if(error) throw error;

    //Absicherung, data ist auf jeden fall vom Typ RoomEquipment[]. Falls die Query null zurückgibt, wird [] verwendet.
    return (data as RoomEquipment[] || []);
}

export async function createRoomEquipment(newRoomEquipment: NewRoomEquipment): Promise<RoomEquipment> {
    const {data, error} = await supabase
    .from("room_equipment")
    .insert(newRoomEquipment)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error("Room equipment creation failed: No data returned");

    return data;
}

export async function updateRoomEquipment(id: string, updates: UpdateRoomEquipment): Promise<RoomEquipment> {
    const {data, error} = await supabase
    .from("room_equipment")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error(`Room equipment update failed: Room quipment with ID ${id} not found or no data returned`);

    return data;
}

export async function deleteRoomEquipment(id: number): Promise<void> {
    const {error} = await supabase
    .from("room_equipment")
    .delete()
    .eq("id", id);
    
    if(error) throw error;
}