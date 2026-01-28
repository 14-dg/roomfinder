import { lecturerKeys } from "@/lib/queryKeys";
import { createLecturer } from "@/services/lecturerService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateLecturer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['createLecturer'],
        mutationFn: createLecturer,
        
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lecturerKeys.list() });
        },

        onError: (error) => {
            console.error("Erstellen des Dozenten fehlgeschlagen: ", error);
        },
    });
}