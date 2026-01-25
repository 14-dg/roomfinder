import { roomTypeKeys } from "@/lib/queryKeys";
import { getAllRoomTypes } from "@/services/roomTypeService";
import { useQuery } from "@tanstack/react-query";

export const useRoomTypes = () => {
    return useQuery({
        queryKey: roomTypeKeys.list(),
        queryFn: getAllRoomTypes,
        // 60 Minuten
        staleTime: 1000 * 60 * 60,
    });
}