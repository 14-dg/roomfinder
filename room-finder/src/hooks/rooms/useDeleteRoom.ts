import { roomKeys } from "@/lib/queryKeys";
import { deleteRoom } from "@/services/roomService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['deleteRoom'],
        mutationFn: (id: number) => deleteRoom(id),
        
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: roomKeys.list()});
        },

        onError: (error) => {
            console.error(error);
        },
    });
}