import { buildingKeys } from "@/lib/queryKeys";
import { deleteBuilding } from "@/services/buildingService";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteBuilding = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: ["deleteBuilding"],
        mutationFn: (id: number) => deleteBuilding(id),

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: buildingKeys.list()});
        },
        
        onError: (error) => {
            console.error(error);
        },
    });
}