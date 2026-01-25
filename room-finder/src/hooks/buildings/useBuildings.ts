import { roomTypeKeys } from "@/lib/queryKeys";
import { getAllBuildingsWithDetails } from "@/services/buildingService";
import { useQuery } from "@tanstack/react-query"

export const useBuildings = () => {
    return useQuery({
        queryKey: roomTypeKeys.list(),
        queryFn: getAllBuildingsWithDetails,
        // 10 Minuten
        staleTime: 1000 * 60 * 10,
    });
}