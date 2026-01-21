//  use in:
//      - src/screens/admin/timetablebuilder/TimetableBuilder.tsx
//  for:
//      - setting lecturer for an event in a timetable like 'Prof. Dr. Wörzberger'

export interface Lecturer {
    id: string;
    name: string;
    department: string;
    email: string;
    officeHours: string;
    officeLocation: string;
    
}