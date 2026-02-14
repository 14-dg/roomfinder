import { Lecture, Booking } from "@/models";

/**
 * Converts a time string in "HH:MM" format to minutes since midnight.
 * Used to compare current time with lecture start/end times.
 * @param time - Time string in "HH:MM" format (e.g., "14:30")
 * @returns Total minutes since midnight, or -1 if format is invalid
 */
function getMinutes(time: string): number {
  if (!time) return -1;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Maps JavaScript day indices (0=Sunday) to English day names.
 * Used to match current day with lecture day names in the database.
 */
const DAY_MAP = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Checks if a room is currently available by verifying there are no
 * active bookings or lectures scheduled.
 * 
 * This function performs two checks:
 * 1. Validates there are no active bookings covering the current time
 * 2. Validates there are no lectures scheduled for the current day/time slot
 * 
 * @param roomId - Unique identifier of the room to check
 * @param lectures - Array of all lectures to check against
 * @param bookings - Array of all room bookings to check against
 * @returns true if room is available, false if occupied or date validation fails
 */
export function checkRoomAvailability(
  roomId: string, 
  lectures: Lecture[], 
  bookings: Booking[]
): boolean {
  if (!roomId) return true; // No room ID means availability cannot be determined
  
  const now = new Date();
  
  // Check 1: Verify there are no active bookings overlapping with current time
  const activeBooking = bookings.find(b => {
    if (b.roomId !== roomId || !b.startDate || !b.endDate) return false;
    
    const start = new Date(b.startDate);
    const end = new Date(b.endDate);
    
    // Validate dates are properly formatted (not "Invalid Date")
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
    
    return now >= start && now <= end;
  });

  if (activeBooking) return false; 

  // Check 2: Verify there are no lectures scheduled for current day and time
  const currentDayName = DAY_MAP[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const activeLecture = lectures.find(l => {
    // Ensure lecture has all required properties before checking
    if (!l || l.roomId !== roomId || l.day !== currentDayName) return false;
    
    const start = getMinutes(l.startTime);
    const end = getMinutes(l.endTime);
    
    // Handle invalid time formats gracefully
    if (start === -1 || end === -1) return false;

    return currentMinutes >= start && currentMinutes < end;
  });

  return !activeLecture; 
}