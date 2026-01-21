import { useMemo } from "react";
import { Lecture, Booking } from "@/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";
import { Description } from "@radix-ui/react-dialog";
import { useData } from "@/contexts/DataContext";

interface RoomWeeklyScheduleProps {
  lectures: Lecture[];
  bookings?: Booking[];
}

// 1. Konfiguration & Konstanten
const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DAY_LABELS: Record<string, string> = {
  "Monday": "Montag",
  "Tuesday": "Dienstag",
  "Wednesday": "Mittwoch",
  "Thursday": "Donnerstag",
  "Friday": "Freitag",
  "Saturday": "Samstag",
  "Sunday": "Sonntag"
};

// Farb-Styles für die Badge/Markierung (angepasst für Liste)
const getTypeStyles = (type: string) => {
  switch (type) {
    case 'Vorlesung': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Uebung': return 'bg-green-100 text-green-800 border-green-200';
    case 'Praktikum': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Tutorium': return 'bg-orange-100 text-yellow-600 border-orange-200';
    case 'Buchung': return 'bg-orange-100 text-yellow-600 border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Versucht "HH:MM" aus verschiedenen Formaten zu extrahieren
const formatTime = (timeStr: string) => {
  if (!timeStr) return "00:00";
  // Falls es ein ISO-Datum ist (enthält "T")
  if (timeStr.includes("T")) {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  // Falls es schon "HH:MM" ist
  return timeStr;
};

export function RoomWeeklySchedule({ lectures, bookings }: RoomWeeklyScheduleProps) {

  const { lecturers } = useData();

  // Suche User-Namen basierend auf User ID
  const getUserName = (userId: string): string => {
    // Zuerst in Lecturers suchen
    const lecturer = lecturers?.find(l => l.id === userId);
    if (lecturer?.name) {
      return lecturer.name;
    }
    // Falls nicht gefunden, User ID anzeigen
    return userId;
  }

  // Bestimme die aktuelle Woche (Montag bis Sonntag)
  const getCurrentWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Berechne den Montag dieser Woche
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    
    // Berechne Sonntag dieser Woche
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    return { monday, sunday };
  };

  const { monday: weekStart, sunday: weekEnd } = getCurrentWeekDates();

  // 2. Daten gruppieren und sortieren
  const scheduleData = useMemo(() => {
    const allEvents = [
      // Lectures mappen
      ...(lectures || []).map(l => ({
        id: l.id,
        day: l.day,
        startTime: l.startTime,
        endTime: l.endTime,
        title: l.name,
        professor: l.professor,
        type: l.type,
        date: null // Lectures haben kein konkretes Datum
      })),
      // Bookings mappen - ABER NUR wenn sie in der aktuellen Woche sind
      ...(bookings || [])
        .filter(b => {
          // Extrahiere das Datum aus startDate (ISO-Format)
          const bookingDate = new Date(b.startDate);
          return bookingDate >= weekStart && bookingDate <= weekEnd;
        })
        .map(b => ({
          id: b.id,
          startTime: formatTime(b.startDate), // Zeit extrahieren
          endTime: formatTime(b.endDate),     // Zeit extrahieren
          day: b.day,
          title: b.description,
          professor: getUserName(b.bookedBy),  // Suche den Namen der User ID
          type: "Buchung",
          date: b.startDate // Speichere das Datum für Validierung
        }))
    ];

    // Nur Lectures mit gültigen Zeiten
    const validEvents = allEvents.filter(e => e.startTime && e.endTime);

    // Gruppieren nach Wochentag
    const grouped: Record<string, typeof allEvents> = {};

    validEvents.forEach(event => {
      // Fallback für englische/deutsche Keys falls nötig
      if (!grouped[event.day]) {
        grouped[event.day] = [];
      }
      grouped[event.day].push(event);
    });

    // Innerhalb der Tage nach Startzeit sortieren
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    // Rückgabe sortiert nach Wochentagen
    return DAYS_ORDER
      .filter(day => grouped[day] && grouped[day].length > 0)
      .map(day => ({
        dayKey: day,
        dayLabel: DAY_LABELS[day] || day,
        items: grouped[day] // Hier liegen jetzt Lectures UND Bookings drin
      }));

  }, [lectures, bookings]);

  // 3. Fallback: Keine Daten
  if (scheduleData.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500 border-dashed">
        <p>Keine Veranstaltungen geplant.</p>
      </Card>
    );
  }

  // 4. Rendering als Liste
  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="pb-4 border-b bg-gray-50/50">
        <CardTitle className="text-lg">Schedule</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col divide-y">
          {scheduleData.map((group) => (
            <div key={group.dayKey} className="p-4">

              {/* Tages-Überschrift */}
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                {group.dayLabel}
              </h3>
              {/* Liste der Events an diesem Tag */}
              <div className="space-y-3">
                {group.items.map((item) => ( // <--- Geändert zu 'items'
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                  >

                    {/* Linke Seite: Zeit & Typ */}
                    <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center min-w-[100px] gap-2">
                      <div className="font-mono text-sm font-semibold text-gray-900">
                        {item.startTime} <span className="text-gray-400">-</span> {item.endTime}
                      </div>

                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium border",
                        getTypeStyles(item.type)
                      )}>
                        {item.type}
                      </span>
                    </div>

                    {/* Rechte Seite: Inhalt */}
                    <div className="flex-1 border-l-0 sm:border-l pl-0 sm:pl-4 border-gray-100">
                      <h4 className="font-medium text-base text-gray-900 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        {item.professor}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}