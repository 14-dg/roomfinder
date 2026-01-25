import { campusKeys } from "@/lib/queryKeys";
import { createCampus } from "@/services/campusService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCampus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['createCampus'],
        mutationFn: createCampus,
        
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: campusKeys.list()});
        },

        onError: (error) => {
            console.error("Erstellen fehlgeschlagen: ", error);
        },
    });
}