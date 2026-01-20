export type OccupancyLevel = "empty" | "minimal" | "moderate" | "full";

export function getOccupancyColor(level: OccupancyLevel) {
  switch (level) {
    case "empty":
      return "text-green-600";
    case "minimal":
      return "text-yellow-600";
    case "moderate":
      return "text-orange-600";
    case "full":
      return "text-red-600";
  }
}

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

export function getOccupancyLevel(checkins: number): OccupancyLevel {
    if(checkins === 0) return "empty";
    if(checkins <= 3) return "minimal";
    if(checkins <= 10) return "moderate";
    else return "full";
}