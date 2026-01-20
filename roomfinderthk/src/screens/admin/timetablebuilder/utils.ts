import { Timetable, Event } from "@/models";

const days: string[] = [
    'Monday', 
    'Tuesday', 
    'Wednesday', 
    'Thursday', 
    'Friday'
];

export const saveTimetable = (timetable: Timetable): void => {
  const key = `timetable_${timetable.courseOfStudy}_${timetable.semester}_${timetable.year}`;
  localStorage.setItem(key, JSON.stringify(timetable));
}

export const loadTimetable = (key: string): Timetable | null => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const createTimetable = (
  courseOfStudy: string,
  semester: string,
  year: number,
  includeSaturday: boolean = false
): Timetable => {
  return {
    courseOfStudy,
    semester,
    year,
    days: includeSaturday ? [...days, 'Saturday'] : days,
    events: []
  };
};

export const createEvent = (events: Event[], eventData: Event): Event => {
  return {
    ...eventData,
    id: eventData.id ?? (events.length > 0 ? Math.max(...events.map(e => e.id!)) + 1 : 1)
  };
};

export const updateEvent = (events: Event[], updatedEvent: Event): Event[] => {
  return events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
};

export const deleteEvent = (events: Event[], id: number): Event[] => {
  return events.filter(e => e.id !== id);
};

export const getEventForSlot = (
  events: Event[],
  day: string,
  timeSlot: string,
  timeSlots: string[],
  column: number
) => {
  return events.find(e =>
    e.day === day &&
    e.column === column &&
    timeSlots.indexOf(e.startTime) <= timeSlots.indexOf(timeSlot) &&
    timeSlots.indexOf(timeSlot) < timeSlots.indexOf(e.startTime) + e.duration
  );
};
