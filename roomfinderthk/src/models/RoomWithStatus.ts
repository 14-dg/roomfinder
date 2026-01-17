//Kategorien eines Raums
type RoomCategory = "seminarraum" | "labor" | "pc-pool";

// Basiseigenschaften eines Raums
export interface Room {
  id: string;
  roomName: string;
  roomType?: RoomCategory;
  floor: number;
  building: string;
  campus: string;
  capacity: number;
  hasBeamer: boolean;
}

// Status eines Raums
export interface RoomStatus {
  isAvailable: boolean;
  isLocked: boolean;
  checkins: number;
}

// Kombination für Fälle, in denen beides benötigt wird
export type RoomWithStatus = Room & RoomStatus;
