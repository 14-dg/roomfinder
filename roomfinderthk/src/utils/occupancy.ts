/**
 * Type representing the occupancy level of a room.
 * empty: No one is currently using the room
 * minimal: 1-3 people checked in
 * moderate: 4-10 people checked in
 * full: 11+ people checked in
 */
export type OccupancyLevel = "empty" | "minimal" | "moderate" | "full";

/**
 * Returns the Tailwind CSS color class for displaying occupancy levels.
 * Used in the UI to visually represent how busy a room is.
 * 
 * @param level - The occupancy level to get color for
 * @returns Tailwind color class string (e.g., "text-green-600" for empty rooms)
 */
export function getOccupancyColor(level: OccupancyLevel) {
  switch (level) {
    case "empty":
      return "text-green-600";
    case "minimal":
      return "text-yellow-300";
    case "moderate":
      return "text-yellow-600";
    case "full":
      return "text-red-600";
  }
}

/**
 * Returns a text-based icon representing occupancy level.
 * Uses filled (●) and empty (○) circles to visually show room occupancy.
 * 
 * @param level - The occupancy level to get icon for
 * @returns Icon string with circles (e.g., "●●●" for full room)
 */
export function getOccupancyIcon(level: OccupancyLevel) {
  switch (level) {
    case "empty":
      return "○○○";
    case "minimal":
      return "●○○";
    case "moderate":
      return "●●○";
    case "full":
      return "●●●";
  }
}

/**
 * Determines the occupancy level based on the number of checked-in users.
 * 
 * @param checkins - Number of users currently checked into the room
 * @returns OccupancyLevel representing the room's capacity status
 */
export function getOccupancyLevel(checkins: number): OccupancyLevel {
    if(checkins === 0) return "empty";
    if(checkins <= 3) return "minimal";
    if(checkins <= 10) return "moderate";
    else return "full";
}