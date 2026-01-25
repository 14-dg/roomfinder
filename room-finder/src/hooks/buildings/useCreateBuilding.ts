import { buildingKeys } from "@/lib/queryKeys";
import { createBuilding } from "@/services/buildingService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBuilding = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['createBuilding'],
        mutationFn: createBuilding,
        
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: buildingKeys.list()});
        },

        onError: (error) => {
            console.error("Erstellen fehlgeschlagen: ", error);
        },
    });
}