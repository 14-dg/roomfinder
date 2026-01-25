import { supabase } from "@/lib/supabase";
import type { Campus, NewCampus, UpdateCampus } from "@/types/models";

export async function getAllCampuses(): Promise<Campus[]> {
    const {data, error} = await supabase
    .from("campuses")
    .select("*");

    if(error) throw error;

    //Absicherung, data ist auf jeden fall vom Typ Campus[]. Falls die Query null zurückgibt, wird [] verwendet.
    return (data as Campus[] || []);
}

export async function createCampus(newCampus: NewCampus): Promise<Campus> {
    const {data, error} = await supabase
    .from("campuses")
    .insert(newCampus)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error("Campus creation failed: No data returned");

    return data;
}

export async function updateCampus(id: number, updates: UpdateCampus): Promise<Campus> {
    const {data, error} = await supabase
    .from("campuses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error(`Campus update failed: Campus with ID ${id} not found or no data returned`);

    return data;
}

export async function deleteCampus(id: number): Promise<void> {
    const {error} = await supabase
    .from("campuses")
    .delete()
    .eq("id", id);
    
    if(error) throw error;
}