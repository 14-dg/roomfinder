import { equipmentKeys } from "@/lib/queryKeys";
import { deleteEquipment } from "@/services/equipmentService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteEquipment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: ["deleteEquipment"],
        mutationFn: (id: string) => deleteEquipment(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: equipmentKeys.list() });
        },
        
        onError: (error) => {
            console.error("Löschen des Equipments fehlgeschlagen: ", error);
        },
    });
}