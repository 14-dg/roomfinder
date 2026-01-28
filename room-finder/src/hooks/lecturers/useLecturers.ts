import { lecturerKeys } from "@/lib/queryKeys";
import { getAllLecturers } from "@/services/lecturerService";
import { useQuery } from "@tanstack/react-query";

export const useLecturers = () => {
    return useQuery({
        queryKey: lecturerKeys.list(),
        queryFn: getAllLecturers,
        // 10 Minuten (Dozenten ändern sich nicht so oft wie Buchungen)
        staleTime: 1000 * 60 * 10,
    });
}