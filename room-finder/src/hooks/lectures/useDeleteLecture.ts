import { lectureKeys } from "@/lib/queryKeys";
import { deleteLecture } from "@/services/lectureService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteLecture = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: ["deleteLecture"],
        mutationFn: (id: number) => deleteLecture(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lectureKeys.list() });
        },
        
        onError: (error) => {
            console.error("Löschen der Lecture fehlgeschlagen: ", error);
        },
    });
}