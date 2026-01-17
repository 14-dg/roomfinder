//Kategorien eines Raums
type RoomCategory = "Seminarraum" | "Labor" | "PC-Pool";

// Basiseigenschaften eines Raums
export interface Room {
  id: string;
  roomName: string;
  roomType: RoomCategory;
  floor: number;
  capacity: number;
  hasBeamer: boolean;
  building: string;
  campus: string;
}

// Status eines Raums
export interface RoomStatus {
  isAvailable: boolean;
  isLocked: boolean;
  checkins: number;
}

// Kombination für Fälle, in denen beides benötigt wird
export type RoomWithStatus = Room & RoomStatus;
