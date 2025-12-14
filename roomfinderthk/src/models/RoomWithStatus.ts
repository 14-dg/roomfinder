export type Direction = "north" | "south" | "east" | "west";

// Basiseigenschaften eines Raums
export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  hasBeamer: boolean;
  direction?: Direction;
}

// Status eines Raums
export interface RoomStatus {
  occupiedSeats: number;
  isAvailable: boolean;
  isLocked: boolean;
  availableUntil?: string;
}

// Kombination für Fälle, in denen beides benötigt wird
export type RoomWithStatus = Room & RoomStatus;
