import { roomEquipmentKeys } from "@/lib/queryKeys";
import { syncRoomEquipment } from "@/services/roomEquipmentService";
import { useMutation, useQueryClient } from "@tanstack/react-query";


type SyncEquipmentPayload = {
    roomId: number;
    equipmentIds: string[];
};

export const useSyncRoomEquipment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['syncRoomEquipment'],
        mutationFn: (payload: SyncEquipmentPayload) => 
            syncRoomEquipment(payload.roomId, payload.equipmentIds),
        
        onSuccess: (_data, variables) => {
            //invalidieren der Liste des spezifischen Raums
            queryClient.invalidateQueries({ 
                queryKey: roomEquipmentKeys.details(variables.roomId)
            });
        },

        onError: (error) => {
            console.error("Sync des Raum-Equipments fehlgeschlagen: ", error);
        },
    });
}