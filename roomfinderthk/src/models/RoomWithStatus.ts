/**
 * Categories that classify rooms by their primary purpose and equipment.
 */
type RoomCategory = "seminarraum" | "labor" | "pc-pool";

/**
 * Room interface contains the base static properties of a classroom or study space.
 */
export interface Room {
  /** Unique identifier for the room */
  id: string;
  /** Display name of the room (e.g., "Lab A-101") */
  roomName: string;
  /** Category indicating the room's purpose and equipment type */
  roomType?: RoomCategory;
  /** Floor number where the room is located */
  floor: number;
  /** Building name or identifier */
  building: string;
  /** Campus name or location */
  campus: string;
  /** Maximum occupancy/capacity of the room */
  capacity: number;
  /** Whether the room has a beamer/projector */
  hasBeamer: boolean;
}

/**
 * RoomStatus interface contains dynamic status information about a room.
 */
export interface RoomStatus {
  /** Whether the room is currently available for use */
  isAvailable?: boolean;
  /** Whether the room is locked and inaccessible */
  isLocked: boolean;
  /** Current number of people checked in to the room */
  checkins: number;
}

/**
 * RoomWithStatus combines both static room properties and dynamic status.
 * Used throughout the app where both room details and current status are needed.
 */
export type RoomWithStatus = Room & RoomStatus;
