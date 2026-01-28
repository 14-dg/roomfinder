import { roomTypeKeys } from "@/lib/queryKeys";
import { deleteRoomType } from "@/services/roomTypeService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteRoomType = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: ["deleteRoomType"],
        mutationFn: (id: string) => deleteRoomType(id),

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: roomTypeKeys.list()});
        },
        
        onError: (error) => {
            console.error(error);
        },
    });
}