import { buildingKeys } from "@/lib/queryKeys";
import { updateBuilding } from "@/services/buildingService";
import type { UpdateBuilding } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type BuildingUpdatePayload = UpdateBuilding & { id: number };

export const useUpdateBuilding = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['updateBuilding'],
        mutationFn: (payload: BuildingUpdatePayload) => {
            const {id, ...updates} = payload;
            return updateBuilding(id, updates);
        },
        
        onSuccess: (savedBuilding) => {
            //manuelles update, ohne neue Datenbank Anfrage
            queryClient.setQueryData(buildingKeys.details(savedBuilding.id), savedBuilding);
            queryClient.invalidateQueries({ queryKey: buildingKeys.list() });
        },

        onError: (error) => {
            console.error("Update des Gebaeudes fehlgeschlagen ", error);
        },
    });
}