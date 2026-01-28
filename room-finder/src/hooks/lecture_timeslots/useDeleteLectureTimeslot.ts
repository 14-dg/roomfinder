import { lectureTimeslotKeys } from "@/lib/queryKeys";
import { deleteLectureTimeslot } from "@/services/lectureTimeslotService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteLectureTimeslot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteLectureTimeslot"],
        mutationFn: (id: number) => deleteLectureTimeslot(id),

        onSuccess: () => {
            // PROBLEM: Wir wissen hier nicht, zu welcher Lecture der gelöschte Slot gehörte.
            // LÖSUNG: Wir invalidieren einfach ALLE Listen von Timeslots.
            // Das ist sicher und bei der geringen Datenmenge performant genug.
            queryClient.invalidateQueries({ queryKey: lectureTimeslotKeys.all });
        },
        
        onError: (error) => console.error("Lecture Zeitslot loeschen fehlgeschlagen: ", error),
    });
}