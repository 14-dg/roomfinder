import { roomKeys } from "@/lib/queryKeys";
import { deleteRoom } from "@/services/roomService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteRoom = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['deleteRoom'],
        mutationFn: () => deleteRoom(id),
        
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: roomKeys.details(id)});
        },

        onError: (error) => {
            console.error(error);
        },
    });
}