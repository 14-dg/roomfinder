import { lectureTimeslotKeys } from "@/lib/queryKeys";
import { getLectureTimeslotIdsForLectureId } from "@/services/lectureTimeslotService";
import { useQuery } from "@tanstack/react-query";

export const useLectureTimeslots = (lectureId: number) => {
    return useQuery({

        queryKey: lectureTimeslotKeys.byLecture(lectureId),
        
        queryFn: () => getLectureTimeslotIdsForLectureId(lectureId),

        enabled: !!lectureId && lectureId > 0,
    });
}