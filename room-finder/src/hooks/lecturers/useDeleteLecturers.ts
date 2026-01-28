import { lecturerKeys } from "@/lib/queryKeys";
import { deleteLecturer } from "@/services/lecturerService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteLecturer = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: ["deleteLecturer"],
        mutationFn: (id: number) => deleteLecturer(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lecturerKeys.list() });
        },
        
        onError: (error) => {
            console.error("Löschen des Dozenten fehlgeschlagen: ", error);
        },
    });
}