import { Event } from "./Event";
//  use in:
//      - src/screens/admin/timetablebuilder/TimetableBuilder.tsx
//  for:
//      - creating and loading a timetable like 'Stundenplan, TIN, 5. Semester, 2026'

export interface Timetable {
<<<<<<< HEAD
=======
    id?: string;
>>>>>>> restore-work
    courseOfStudy: string;
    semester: string;
    year: number;
    days: string[];
    events: Event[];
}