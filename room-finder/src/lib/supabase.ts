import { createClient } from "@supabase/supabase-js";
import { type Database } from "@/types/supabasetypes";


// Die zur Supabase Verbindung Notwendigen Werte
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_API_KEY;

// Pruefen, dass beide notwendigen Werte vorhanden sind
if(!supabaseUrl || ! supabaseKey) {
    throw new Error("Supabase URL oder Key fehlt in der .env Datei");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);