import { bookingKeys } from "@/lib/queryKeys";
import { deleteBooking } from "@/services/bookingService";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteBooking = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: ["deleteBooking"],
        mutationFn: (id: number) => deleteBooking(id),

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: bookingKeys.list()});
        },
        
        onError: (error) => {
            console.error("Löschen der Buchung fehlgeschlagen: ", error);
        },
    });
}