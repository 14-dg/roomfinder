import { lectureKeys } from "@/lib/queryKeys";
import { updateLecture } from "@/services/lectureService";
import type { UpdateLecture } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type LectureUpdatePayload = UpdateLecture & { id: number };

export const useUpdateLecture = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['updateLecture'],
        mutationFn: (payload: LectureUpdatePayload) => {
            const {id, ...updates} = payload;
            return updateLecture(id, updates);
        },
        
        onSuccess: (_data, variables) => {
            // Liste invalidieren (falls Name geändert wurde)
            queryClient.invalidateQueries({ queryKey: lectureKeys.list() });
            // Details invalidieren (falls man gerade im Detail-Screen ist)
            queryClient.invalidateQueries({ queryKey: lectureKeys.details(variables.id) });
        },

        onError: (error) => {
            console.error("Update der Lecture fehlgeschlagen: ", error);
        },
    });
}