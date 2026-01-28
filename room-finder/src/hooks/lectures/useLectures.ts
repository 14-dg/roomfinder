import { lectureKeys } from "@/lib/queryKeys";
import { getAllLectures } from "@/services/lectureService";
import { useQuery } from "@tanstack/react-query";

export const useLectures = () => {
    return useQuery({
        queryKey: lectureKeys.list(),
        queryFn: getAllLectures,
        staleTime: 1000 * 60 * 5, 
    });
}