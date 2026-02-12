import { lecture_timeslotKeys } from "@/lib/queryKeys";
import { createLectureTimeslot } from "@/services/lectureTimeslotService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateLectureTimeslot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['createLectureTimeslot'],
        mutationFn: createLectureTimeslot,
        
        onSuccess: (_data, variables) => {
 
            //invalidieren der Timeslots dieser einen Vorlesung
            queryClient.invalidateQueries({ 
                queryKey: lecture_timeslotKeys.byLecture(variables.lecture_id) 
            });
        },

        onError: (error) => console.error("Lecture Zeitslot erstellen fehlgeschlagen: ", error),
    });
}