
/**
 * erstellt die query keys, der hashmap des chaches für die useRooms hook
 */
export const roomKeys = {
    all: ["rooms"] as const,
    list: () => [...roomKeys.all, "list"] as const,
    details: (id: number) => [...roomKeys.all, "details", id] as const,
}

export const buildingKeys = {
    all: ["buildings"] as const,
    list: () => [...buildingKeys.all, "list"] as const,
    details: (id: number) => [...buildingKeys.all, "details", id] as const,
}

export const campusKeys = {
    all: ["campuses"] as const,
    list: () => [...campusKeys.all, "list"] as const,
    details: (id: number) => [...campusKeys.all, "details", id] as const,
}

export const roomTypeKeys = {
    all: ["room_types"] as const,
    list: () => [...roomTypeKeys.all, "list"] as const,
    details: (id: string) => [...roomTypeKeys.all, "details", id] as const,
}