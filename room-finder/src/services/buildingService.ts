import { supabase } from "@/lib/supabase";
import type { Building, BuildingWithDetails, NewBuilding, UpdateBuilding } from "@/types/models";

const BUILDING_DETAILS_SELECT = "*, campus:campuses(*)";

export async function getAllBuildingsWithDetails(): Promise<BuildingWithDetails[]> {
    const {data, error} = await supabase
    .from("buildings")
    .select(BUILDING_DETAILS_SELECT);

    if(error) throw error;

    //Absicherung, data ist auf jeden fall vom Typ BuildingWithDetails[]. Falls die Query null zurückgibt, wird [] verwendet.
    return (data as BuildingWithDetails[] || []);
}

export async function createBuilding(newBuilding: NewBuilding): Promise<Building> {
    const {data, error} = await supabase
    .from("buildings")
    .insert(newBuilding)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error("Building creation failed: No data returned");

    return data;
}

export async function updateBuilding(id: number, updates: UpdateBuilding): Promise<Building> {
    const {data, error} = await supabase
    .from("buildings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error(`Building update failed: Building with ID ${id} not found or no data returned`);

    return data;
}

export async function deleteBuilding(id: number): Promise<void> {
    const {error} = await supabase
    .from("buildings")
    .delete()
    .eq("id", id);
    
    if(error) throw error;
}