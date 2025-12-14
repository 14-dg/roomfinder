export type Direction = "north" | "south" | "east" | "west";

export interface RoomWithStatus {
  id: string;

  roomNumber: string;
  floor: number;
  capacity: number;

  occupiedSeats: number;

  hasBeamer: boolean;

  isAvailable: boolean;
  isLocked: boolean;

  direction?: Direction;
  availableUntil?: string; // bewusst string → UI-Format
}
