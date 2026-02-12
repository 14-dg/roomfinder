import { lecture_timeslotKeys } from "@/lib/queryKeys";
import { getLectureTimeslotsForLectureId } from "@/services/lectureTimeslotService";
import { useQuery } from "@tanstack/react-query";

export const useLectureTimeslots = (lectureId: number) => {
    return useQuery({
        // Der Cache wird pro Vorlesung getrennt
        // Timeslots von Lecture A überschreiben nicht Timeslots von Lecture B (wegen des lecture_timeslotKeys.byLecture(lectureId) keys)
        queryKey: lecture_timeslotKeys.byLecture(lectureId),
        
        queryFn: () => getLectureTimeslotsForLectureId(lectureId),
        
        //Der Hook läuft NICHT los, wenn lectureId 0 oder undefined ist.
        //Das verhindert Fehler beim Initial-Load, wenn noch keine Lecture ausgewählt ist.
        enabled: !!lectureId && lectureId > 0,
    });
}