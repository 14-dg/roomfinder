
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

export const equipmentKeys = {
    all: ["equipment"] as const,
    list: () => [...equipmentKeys.all, "list"] as const,
    details: (id: string) => [...equipmentKeys.all, "details", id] as const,
}

export const roomEquipmentKeys = {
    all: ["room_equipment"] as const,
    list: () => [...roomEquipmentKeys.all, "list"] as const,
    details: (id: number) => [...roomEquipmentKeys.all, "details", id] as const,
}

export const lecturerKeys = {
    all: ["lecturers"] as const,
    list: () => [...lecturerKeys.all, "list"] as const,
    details: (id: number) => [...lecturerKeys.all, "details", id] as const,
}

export const lectureKeys = {
    all: ["lectures"] as const,
    list: () => [...lectureKeys.all, "list"] as const,
    details: (id: number) => [...lectureKeys.all, "details", id] as const,
}

export const bookingKeys = {
        all: ["lectures"] as const,
    list: () => [...bookingKeys.all, "list"] as const,
    details: (id: number) => [...bookingKeys.all, "details", id] as const,
}