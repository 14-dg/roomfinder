import { bookingKeys } from "@/lib/queryKeys";
import { getAllBookings } from "@/services/bookingService";
import { useQuery } from "@tanstack/react-query"

export const useBookings = () => {
    return useQuery({
        queryKey: bookingKeys.list(),
        queryFn: getAllBookings,
        // 2 Minuten
        staleTime: 1000 * 60 * 2,
    });
}