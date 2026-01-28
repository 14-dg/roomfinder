import { equipmentKeys } from "@/lib/queryKeys";
import { getAllEquipment } from "@/services/equipmentService";
import { useQuery } from "@tanstack/react-query";

export const useEquipment = () => {
    return useQuery({
        queryKey: equipmentKeys.list(),
        queryFn: getAllEquipment,
        // 30 Minuten
        staleTime: 1000 * 60 * 30,
    });
}