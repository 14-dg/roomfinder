import { campusKeys } from "@/lib/queryKeys";
import { getAllCampuses } from "@/services/campusService";
import { useQuery } from "@tanstack/react-query";

export const useCampuses = () => {
    return useQuery({
        queryKey: campusKeys.list(),
        queryFn: getAllCampuses,
        // 60 Minuten
        staleTime: 1000 * 60 * 60,
    });
}