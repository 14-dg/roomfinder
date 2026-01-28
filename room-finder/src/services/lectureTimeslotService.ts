import { supabase } from "@/lib/supabase";
import type { LectureTimeslot, LectureTimeslotDTO, NewLectureTimeslot, UpdateLectureTimeslot } from "@/types/models";


/**
 * 
 * @param lectureId 
 * @returns LectureTimeslots einer Lecture als LectureTimeslot[]
 */
export async function getLectureTimeslotsForLectureId(lectureId: number): Promise<LectureTimeslotDTO[]> {
    const {data, error} = await supabase
    .from("lecture_timeslots")
    .select("*, room: rooms(*), lecture: lectures(*)")
    .eq("lecture_id", lectureId);

    if(error) throw error;

    return data || [];
}

/**
 * 
 * @param lectureId 
 * @returns Id's der LectureTimeslots einer Lecture als number[]
 */
export async function getLectureTimeslotIdsForLectureId(lectureId: number): Promise<number[]> {
    const {data, error} = await supabase
    .from("lecture_timeslots")
    .select("id")
    .eq("lecture_id", lectureId);

    if(error) throw error;

    return (data || []).map(item => item.id);
}

export async function getAllLectureTimeslots(): Promise<LectureTimeslotDTO[]> {
    const {data, error} = await supabase
    .from("lecture_timeslots")
    .select("*, room: rooms(*), lecture: lectures(*)");

    if(error) throw error;

    //Absicherung, data ist auf jeden fall vom Typ LectureTimeslotDTO[]. Falls die Query null zurückgibt, wird [] verwendet.
    return (data as LectureTimeslotDTO[] || []);
}

export async function createLectureTimeslot(newLectureTimeslot: NewLectureTimeslot): Promise<LectureTimeslot> {
    const {data, error} = await supabase
    .from("lecture_timeslots")
    .insert(newLectureTimeslot)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error("LectureTimeslot creation failed: No data returned");

    return data;
}

export async function updateLectureTimeslot(id: number, updates: UpdateLectureTimeslot): Promise<LectureTimeslot> {
    const {data, error} = await supabase
    .from("lecture_timeslots")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error(`LectureTimeslot update failed: LectureTimeslot with ID ${id} not found or no data returned`);

    return data;
}

export async function deleteLectureTimeslot(id: number): Promise<void> {
    const {error} = await supabase
    .from("lecture_timeslots")
    .delete()
    .eq("id", id);
    
    if(error) throw error;
}

export async function deleteLectureTimeslotForLectureId(lectureId: number): Promise<void> {
    const {error} = await supabase
    .from("lecture_timeslots")
    .delete()
    .eq("lecture_id", lectureId);
    
    if(error) throw error;
}