export function getOccupancyColor(level: "empty" | "moderate" | "full") {
  switch (level) {
    case "empty":
      return "text-green-600";
    case "moderate":
      return "text-yellow-600";
    case "full":
      return "text-red-600";
  }
};

export function getOccupancyIcon(level: "empty" | "moderate" | "full") {
  switch (level) {
    case "empty":
      return "●○○";
    case "moderate":
      return "●●○";
    case "full":
      return "●●●";
  }
};