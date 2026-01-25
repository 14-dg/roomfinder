import { roomKeys } from "@/lib/queryKeys";
import { createRoom } from "@/services/roomService";
import { useMutation } from "@tanstack/react-query"

export const useCreateRoom = () => {
    return useMutation({
        mutationKey: roomKeys.all,
        mutationFn: createRoom,
    });
    
}