import { Lecture, Booking } from "@/models";

// Hilfsfunktion: "HH:MM" in Minuten umwandeln (für Lectures)
function getMinutes(time: string): number {
  if (!time) return -1;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Map für Wochentage (JS getDay() liefert 0=Sonntag, 1=Montag...)
// Muss zu deinen Lecture-Daten passen ("Monday", "Tuesday"...)
const DAY_MAP = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function checkRoomAvailability(
  roomId: string, 
  lectures: Lecture[], 
  bookings: Booking[]
): boolean {
  if (!roomId) return true; // Ohne Raum-ID keine Belegung prüfbar
  
  const now = new Date();
  
  // 1. PRÜFUNG: Bookings (Sicherer Umgang mit Datumswerten)
  const activeBooking = bookings.find(b => {
    if (b.roomId !== roomId || !b.startDate || !b.endDate) return false;
    
    const start = new Date(b.startDate);
    const end = new Date(b.endDate);
    
    // Validierung: Falls Datum ungültig ist (Invalid Date)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
    
    return now >= start && now <= end;
  });

  if (activeBooking) return false; 

  // 2. PRÜFUNG: Lectures
  const currentDayName = DAY_MAP[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const activeLecture = lectures.find(l => {
    // WICHTIG: Prüfen, ob Raum, Tag und Zeiten überhaupt existieren
    if (!l || l.roomId !== roomId || l.day !== currentDayName) return false;
    
    const start = getMinutes(l.startTime);
    const end = getMinutes(l.endTime);
    
    // Falls startTime oder endTime im falschen Format sind
    if (start === -1 || end === -1) return false;

    return currentMinutes >= start && currentMinutes < end;
  });

  return !activeLecture; 
}