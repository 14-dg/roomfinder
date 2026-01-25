import { getAllRoomsWithDetails } from "@/services/roomService";
import type { RoomWithDetails } from "@/types/models";
import { useQuery } from "@tanstack/react-query"

export const useRooms = () => {
    return useQuery<RoomWithDetails[], Error>({
        queryKey: [],
        queryFn: getAllRoomsWithDetails,
        staleTime: 1000 * 60 * 10
    })
}