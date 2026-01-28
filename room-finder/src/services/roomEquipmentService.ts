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

/**
 * 
 * 
 */
export async function getEquipmentIdsForRoom(roomId: number): Promise<string[]> {
    const { data, error } = await supabase
        .from('room_equipment')
        .select('equipment_id')
        .eq('room_id', roomId);
    
    if (error) throw error;
    
    return (data || []).map(item => item.equipment_id);
}

export async function syncRoomEquipment(roomId: number, equipmentIds: string[]): Promise<void> {
    //altes equipment des raums entfernen
    const { error: deleteError } = await supabase
        .from('room_equipment')
        .delete()
        .eq('room_id', roomId);
    
    if (deleteError) throw deleteError;

    //wenn die neue Liste leer ist, dann beenden
    if (equipmentIds.length === 0) return;

    //neue Liste einfuegen
    const rowsToInsert = equipmentIds.map(eqId => ({
        room_id: roomId,
        equipment_id: eqId
    }));

    const { error: insertError } = await supabase
        .from('room_equipment')
        .insert(rowsToInsert);

    if (insertError) throw insertError;
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