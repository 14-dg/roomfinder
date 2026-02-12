import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/services/authService";
import { profileKeys } from "@/lib/queryKeys";

export const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: profileKeys.details(userId),
    queryFn: () => getUserProfile(userId!),
    // Der Query läuft nur los, wenn wir eine UserID haben
    enabled: !!userId,
    // WICHTIG: Profil-Daten ändern sich selten, wir cachen sie lange
    staleTime: 1000 * 60 * 5, // 5 Minuten
    retry: false,
  });
};