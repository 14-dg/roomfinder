import { lectureKeys } from "@/lib/queryKeys";
import { createLecture } from "@/services/lectureService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateLecture = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['createLecture'],
        mutationFn: createLecture,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lectureKeys.list() });
        },
        onError: (error) => console.error("Lecture creation failed", error),
    });
}