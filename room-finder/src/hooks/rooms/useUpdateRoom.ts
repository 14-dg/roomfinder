import { roomKeys } from "@/lib/queryKeys";
import { updateRoom } from "@/services/roomService";
import type { UpdateRoom } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RoomUpdatePayload = UpdateRoom & { id: number };

export const useUpdateRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['updateRoom'],
        mutationFn: (payload: RoomUpdatePayload) => {
            const {id, ...updates} = payload;
            return updateRoom(id, updates);
        },
        
        onSuccess: (savedRoom) => {
            //manuelles update, ohne neue Datenbank Anfrage
            queryClient.setQueryData(roomKeys.details(savedRoom.id), savedRoom);
            queryClient.invalidateQueries({ queryKey: roomKeys.list() });
        },

        onError: (error) => {
            console.error("Update des Raums fehlgeschlagen ", error);
        },
    });
}