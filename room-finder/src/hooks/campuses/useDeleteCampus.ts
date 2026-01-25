import { campusKeys } from "@/lib/queryKeys";
import { deleteCampus } from "@/services/campusService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCampus = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: ["deleteCampus"],
        mutationFn: (id: number) => deleteCampus(id),

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: campusKeys.list()});
        },
        
        onError: (error) => {
            console.error(error);
        },
    });
}