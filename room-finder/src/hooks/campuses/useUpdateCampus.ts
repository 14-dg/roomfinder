import { campusKeys } from "@/lib/queryKeys";
import { updateCampus } from "@/services/campusService";
import type { UpdateCampus } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CampusUpdatePayload = UpdateCampus & { id: number };

export const useUpdateCampus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['updateCampus'],
        mutationFn: (payload: CampusUpdatePayload) => {
            const {id, ...updates} = payload;
            return updateCampus(id, updates);
        },
        
        onSuccess: (savedCampus) => {
            //manuelles update, ohne neue Datenbank Anfrage
            queryClient.setQueryData(campusKeys.details(savedCampus.id), savedCampus);
            queryClient.invalidateQueries({ queryKey: campusKeys.list() });
        },

        onError: (error) => {
            console.error("Update des Campus fehlgeschlagen ", error);
        },
    });
}