import { supabase } from "@/lib/supabase";
import type { Lecturer, NewLecturer, UpdateLecturer } from "@/types/models";

export async function getAllLecturers(): Promise<Lecturer[]> {
    const {data, error} = await supabase
    .from("lecturers")
    .select("*");

    if(error) throw error;

    //Absicherung, data ist auf jeden fall vom Typ Lecturer[]. Falls die Query null zurückgibt, wird [] verwendet.
    return (data as Lecturer[] || []);
}

export async function createLecturer(newLecturer: NewLecturer): Promise<Lecturer> {
    const {data, error} = await supabase
    .from("lecturers")
    .insert(newLecturer)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error("Lecturer creation failed: No data returned");

    return data;
}

export async function updateLecturer(id: number, updates: UpdateLecturer): Promise<Lecturer> {
    const {data, error} = await supabase
    .from("lecturers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error(`Lecturer update failed: Lecturer with ID ${id} not found or no data returned`);

    return data;
}

export async function deleteLecturer(id: number): Promise<void> {
    const {error} = await supabase
    .from("lecturers")
    .delete()
    .eq("id", id);
    
    if(error) throw error;
}