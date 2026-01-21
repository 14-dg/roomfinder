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
  const now = new Date();
  
  // -------------------------------------------------------
  // 1. PRÜFUNG: Bookings (ISO-Format)
  // -------------------------------------------------------
  const activeBooking = bookings.find(b => {
    // Nur Buchungen für diesen Raum prüfen
    if (b.roomId !== roomId) return false;
    
    // ISO-Strings direkt in Datumsobjekte umwandeln
    const start = new Date(b.startDate);
    const end = new Date(b.endDate);
    
    // Prüfen: Ist JETZT zwischen Start und Ende?
    return now >= start && now <= end;
  });

  // Wenn eine Buchung aktiv ist -> Raum NICHT verfügbar
  if (activeBooking) return false; 


  // -------------------------------------------------------
  // 2. PRÜFUNG: Lectures (Wochenplan HH:MM)
  // -------------------------------------------------------
  const currentDayName = DAY_MAP[now.getDay()]; // z.B. "Wednesday"
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const activeLecture = lectures.find(l => {
    // Raum und Tag müssen stimmen
    if (l.roomId !== roomId || l.day !== currentDayName) return false;
    
    // Zeitfenster prüfen
    const start = getMinutes(l.startTime);
    const end = getMinutes(l.endTime);
    
    if (start === -1 || end === -1) return false;

    return currentMinutes >= start && currentMinutes < end;
  });

  // Wenn eine Vorlesung läuft -> Raum NICHT verfügbar
  if (activeLecture) return false; 

  // -------------------------------------------------------
  // FAZIT: Weder Buchung noch Vorlesung -> Raum IST verfügbar
  // -------------------------------------------------------
  return true;
}