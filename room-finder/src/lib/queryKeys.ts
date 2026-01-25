
/**
 * erstellt die query keys, der hashmap des chaches für die useRooms hook
 */
export const roomKeys = {

    all: ["rooms"] as const,

    list: () => [...roomKeys.all, "list"] as const,

    details: (id: number) => [...roomKeys.all, "details", id] as const,
}