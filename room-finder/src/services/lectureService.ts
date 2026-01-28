import { supabase } from "@/lib/supabase";
import type { Lecture, NewLecture, UpdateLecture } from "@/types/models";

export async function getAllLectures(): Promise<Lecture[]> {
    const {data, error} = await supabase
    .from("lectures")
    .select("*");

    if(error) throw error;

    //Absicherung, data ist auf jeden fall vom Typ Lecture[]. Falls die Query null zurückgibt, wird [] verwendet.
    return (data as Lecture[] || []);
}

export async function createLecture(newLecture: NewLecture): Promise<Lecture> {
    const {data, error} = await supabase
    .from("lectures")
    .insert(newLecture)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error("Lecture creation failed: No data returned");

    return data;
}

export async function updateLecture(id: number, updates: UpdateLecture): Promise<Lecture> {
    const {data, error} = await supabase
    .from("lectures")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error(`Lecture update failed: Lecture with ID ${id} not found or no data returned`);

    return data;
}

export async function deleteLecture(id: number): Promise<void> {
    const {error} = await supabase
    .from("lectures")
    .delete()
    .eq("id", id);
    
    if(error) throw error;
}