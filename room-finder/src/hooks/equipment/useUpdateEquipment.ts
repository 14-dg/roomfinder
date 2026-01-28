import { equipmentKeys } from "@/lib/queryKeys";
import { updateEquipment } from "@/services/equipmentService";
import type { UpdateEquipment } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type EquipmentUpdatePayload = UpdateEquipment & { id: string };

export const useUpdateEquipment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['updateEquipment'],
        mutationFn: (payload: EquipmentUpdatePayload) => {
            const {id, ...updates} = payload;
            return updateEquipment(id, updates);
        },
        
        onSuccess: (_data, variables) => {
            // Liste invalidieren (falls Name geändert wurde)
            queryClient.invalidateQueries({ queryKey: equipmentKeys.list() });
            // Details invalidieren (falls man gerade im Detail-Screen ist)
            queryClient.invalidateQueries({ queryKey: equipmentKeys.details(variables.id) });
        },

        onError: (error) => {
            console.error("Update des Equipments fehlgeschlagen: ", error);
        },
    });
}