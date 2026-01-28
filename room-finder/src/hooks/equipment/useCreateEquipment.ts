import { equipmentKeys } from "@/lib/queryKeys";
import { createEquipment } from "@/services/equipmentService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateEquipment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['createEquipment'],
        mutationFn: createEquipment,
        
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: equipmentKeys.list() });
        },

        onError: (error) => {
            console.error("Erstellen des Equipments fehlgeschlagen: ", error);
        },
    });
}