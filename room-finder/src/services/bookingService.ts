import { supabase } from "@/lib/supabase";
import type { Booking, NewBooking, UpdateBooking } from "@/types/models";

export async function getAllBookings(): Promise<Booking[]> {
    const {data, error} = await supabase
    .from("bookings")
    .select("*");

    if(error) throw error;

    //Absicherung, data ist auf jeden fall vom Typ Bookings[]. Falls die Query null zurückgibt, wird [] verwendet.
    return (data as Booking[] || []);
}

export async function createBooking(newBooking: NewBooking): Promise<Booking> {
    const {data, error} = await supabase
    .from("bookings")
    .insert(newBooking)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error("Booking creation failed: No data returned");

    return data;
}

export async function updateBooking(id: number, updates: UpdateBooking): Promise<Booking> {
    const {data, error} = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

    if(error) throw error;

    if(!data) throw new Error(`Booking update failed: Booking with ID ${id} not found or no data returned`);

    return data;
}

export async function deleteBooking(id: number): Promise<void> {
    const {error} = await supabase
    .from("bookings")
    .delete()
    .eq("id", id);
    
    if(error) throw error;
}