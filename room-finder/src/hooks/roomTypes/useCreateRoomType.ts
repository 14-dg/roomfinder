import { roomTypeKeys } from "@/lib/queryKeys";
import { createRoomType } from "@/services/roomTypeService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateRoomType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['createRoomType'],
        mutationFn: createRoomType,
        
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: roomTypeKeys.list()});
        },

        onError: (error) => {
            console.error("Löschen fehlgeschlagen: ", error);
        },
    });
}