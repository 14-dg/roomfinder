import { lectureTimeslotKeys } from "@/lib/queryKeys";
import { deleteLectureTimeslotForLectureId } from "@/services/lectureTimeslotService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteLectureTimeslotForLectureId = (lectureId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteLectureTimeslotForLectureId"],
        mutationFn: () => deleteLectureTimeslotForLectureId(lectureId),

        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: lectureTimeslotKeys.byLecture(lectureId) });
        },
        
        onError: (error) => console.error("Lecture Zeitslot loeschen fehlgeschlagen: ", error),
    });
}