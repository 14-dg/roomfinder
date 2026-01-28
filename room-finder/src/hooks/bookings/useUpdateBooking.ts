import { bookingKeys } from "@/lib/queryKeys";
import { updateBooking } from "@/services/bookingService";
import type { UpdateBooking } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type BookingUpdatePayload = UpdateBooking & { id: number };

export const useUpdateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['updateBooking'],
        mutationFn: (payload: BookingUpdatePayload) => {
            const {id, ...updates} = payload;
            return updateBooking(id, updates);
        },
        
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.details(variables.id) });
            queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
        },

        onError: (error) => {
            console.error("Update der Buchung fehlgeschlagen: ", error);
        },
    });
}