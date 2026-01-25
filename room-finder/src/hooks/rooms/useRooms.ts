import { roomKeys } from "@/lib/queryKeys";
import { getAllRoomsWithDetails } from "@/services/roomService";
import type { RoomWithDetails } from "@/types/models";
import { useQuery } from "@tanstack/react-query"

export const useRooms = () => {
    return useQuery<RoomWithDetails[], Error>({
        queryKey: roomKeys.lists(),
        queryFn: getAllRoomsWithDetails,
        //die gecashten Raum Daten sind nach 10 minuten stale/veraltet, das heißt sie werden neu geladen.
        staleTime: 1000 * 60 * 10
    })
}