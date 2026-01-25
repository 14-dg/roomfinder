export const roomKeys = {

    all: ["rooms"] as const,
    lists: () => [...roomKeys.all, "list"],
}