import { lecturerKeys } from "@/lib/queryKeys";
import { updateLecturer } from "@/services/lecturerService";
import type { UpdateLecturer } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type LecturerUpdatePayload = UpdateLecturer & { id: number };

export const useUpdateLecturer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['updateLecturer'],
        mutationFn: (payload: LecturerUpdatePayload) => {
            const {id, ...updates} = payload;
            return updateLecturer(id, updates);
        },
        
        onSuccess: (_data, variables) => {
            // Liste neu laden (z.B. Namensänderung)
            queryClient.invalidateQueries({ queryKey: lecturerKeys.list() });
            // Detailansicht neu laden (falls der User gerade im Profil ist)
            queryClient.invalidateQueries({ queryKey: lecturerKeys.details(variables.id) });
        },

        onError: (error) => {
            console.error("Update des Dozenten fehlgeschlagen: ", error);
        },
    });
}