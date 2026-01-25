import { roomKeys } from "@/lib/queryKeys";
import { updateRoom } from "@/services/roomService";
import type { UpdateRoom } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateRoom = (id: number, updates: UpdateRoom) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['updateRoom'],
        mutationFn: () => updateRoom(id, updates),
        
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: roomKeys.details(id)});
        },

        onError: (error) => {
            console.error(error);
        },
    });
}