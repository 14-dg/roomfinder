import { roomTypeKeys } from "@/lib/queryKeys";
import { updateRoomType } from "@/services/roomTypeService";
import type { UpdateRoomType } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RoomTypeUpdatePayload = UpdateRoomType & { id: string };

export const useUpdateRoomType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['updateRoomType'],
        mutationFn: (payload: RoomTypeUpdatePayload) => {
            const {id, ...updates} = payload;
            return updateRoomType(id, updates);
        },
        
        onSuccess: (savedRoomType) => {
            //manuelles update, ohne neue Datenbank Anfrage
            queryClient.setQueryData(roomTypeKeys.details(savedRoomType.id), savedRoomType);
            queryClient.invalidateQueries({ queryKey: roomTypeKeys.list() });
        },

        onError: (error) => {
            console.error("Update des Room Typs fehlgeschlagen ", error);
        },
    });
}