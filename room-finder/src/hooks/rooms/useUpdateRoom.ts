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
        
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: roomKeys.details(variables.id) });
            queryClient.invalidateQueries({ queryKey: roomKeys.list() });
        },

        onError: (error) => {
            console.error("Update des Raums fehlgeschlagen ", error);
        },
    });
}