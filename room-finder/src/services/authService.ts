import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/models";


export async function getUserProfile(userId: string): Promise<Profile> {
	const {data, error} = await supabase
	.from("profiles")
	.select("*")
	.eq("id", userId)
	.single();

	if(error) throw error;
	return data as Profile;
}

export async function logout() {
	return await supabase.auth.signOut();
}