import { lectureTimeslotKeys } from "@/lib/queryKeys";
import { updateLectureTimeslot } from "@/services/lectureTimeslotService";
import type { UpdateLectureTimeslot } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type TimeslotUpdatePayload = UpdateLectureTimeslot & { id: number };

export const useUpdateLectureTimeslot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['updateLectureTimeslot'],
        mutationFn: (payload: TimeslotUpdatePayload) => {
            const {id, ...updates} = payload;
            return updateLectureTimeslot(id, updates);
        },
        
        onSuccess: (_data, variables) => {

            queryClient.invalidateQueries({ queryKey: lectureTimeslotKeys.all });
        },

        onError: (error) => console.error("Lecture Zeitslot Update fehlgeschlagen: ", error),
    });
}