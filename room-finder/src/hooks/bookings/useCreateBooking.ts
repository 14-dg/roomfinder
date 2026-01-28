import { bookingKeys } from "@/lib/queryKeys";
import { createBooking } from "@/services/bookingService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['createBooking'],
        mutationFn: createBooking,
        
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: bookingKeys.list()});
        },

        onError: (error) => {
            console.error("Erstellen fehlgeschlagen: ", error);
        },
    });
}