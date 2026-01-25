
import { buildingKeys } from "@/lib/queryKeys";
import { getAllBuildingsWithDetails } from "@/services/buildingService";
import { useQuery } from "@tanstack/react-query"

export const useBuildings = () => {
    return useQuery({
        queryKey: buildingKeys.list(),
        queryFn: getAllBuildingsWithDetails,
        // 30 Minuten
        staleTime: 1000 * 60 * 30,
    });
}