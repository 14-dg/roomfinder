import { roomEquipmentKeys } from "@/lib/queryKeys";
import { getEquipmentIdsForRoom } from "@/services/roomEquipmentService";
import { useQuery } from "@tanstack/react-query";

export const useRoomEquipment = (roomId: number) => {
    return useQuery({
        queryKey: roomEquipmentKeys.details(roomId),
        queryFn: () => getEquipmentIdsForRoom(roomId),
        
        enabled: !!roomId,
    });
}