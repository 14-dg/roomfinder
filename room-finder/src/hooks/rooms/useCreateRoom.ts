import { roomKeys } from "@/lib/queryKeys";
import { createRoom } from "@/services/roomService";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateRoom = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['createRoom'],
        mutationFn: createRoom,
        
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: roomKeys.list()});
        },

        onError: (error) => {
            console.error("Löschen fehlgeschlagen: ", error);
        },
    });
}