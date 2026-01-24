import type { RoomEntity } from "./RoomEntity";

export interface RoomWithStatus extends RoomEntity {

    isAvailable: boolean;
    currentEvent?: Event;
}