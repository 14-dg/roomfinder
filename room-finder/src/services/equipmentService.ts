import { supabase } from "@/lib/supabase";
import type { Equipment, NewEquipment, UpdateEquipment } from "@/types/models";


export async function getAllEquipment(): Promise<Equipment[]> {
    const {data, error} = await supabase
    .from("equipment")
    .select("*");

    if(error) throw error;

    //Absicherung, data ist auf jeden fall vom Typ Equipment[]. Falls die Query null zurückgibt, wird [] verwendet.
    return (data as Equipment[] || []);
}

export async function createEquipment(newEquipment: NewEquipment): Promise<Equipment> {
    const {data, error} = await supabase
    .from("equipment")
    .insert(newEquipment)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error("Equipment creation failed: No data returned");

    return data;
}

export async function updateEquipment(id: string, updates: UpdateEquipment): Promise<Equipment> {
    const {data, error} = await supabase
    .from("equipment")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error(`Equipment update failed: Equipment with ID ${id} not found or no data returned`);

    return data;
}

export async function deleteEquipment(id: string): Promise<void> {
    const {error} = await supabase
    .from("equipment")
    .delete()
    .eq("id", id);
    
    if(error) throw error;
}