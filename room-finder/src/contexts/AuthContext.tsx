import React, { createContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useUserProfile } from "@/hooks/auth/useUserProfile";
import { useQueryClient } from "@tanstack/react-query";
import type { AppRole, Profile } from "@/types/models";
import { profileKeys } from "@/lib/queryKeys";

type AuthContextType = {
	user: User | null;
	session: Session | null;
	profile: Profile | null;
	role: AppRole;
	isLoading: boolean;
	isAuthenticated: boolean;
	signOut: () => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const queryClient = useQueryClient();
	const [session, setSession] = useState<Session | null>(null);
	const [isSessionLoading, setIsSessionLoading] = useState(true);

	// Der Hook liefert jetzt automatisch den korrekten 'Profile' Typ zurück
	const { data: profile, isLoading: isProfileLoading } = useUserProfile(session?.user.id);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setIsSessionLoading(false);
		});

		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setIsSessionLoading(false);
			if (!session) {
				queryClient.removeQueries({ queryKey: profileKeys.all });
			}
		});

		return () => subscription.unsubscribe();
	}, [queryClient]);

	const signOut = async () => {
		await supabase.auth.signOut();
	};

	const isLoading = isSessionLoading || (!!session && isProfileLoading);

	// Wenn kein Profil da ist (oder Fehler) wird 'guest' verwendet
	const role: AppRole = profile?.role ?? "guest";

	return (
		<AuthContext.Provider
			value={{
				user: session?.user ?? null,
				session,
				profile: profile ?? null,
				role,
				isLoading,
				isAuthenticated: !!session,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};