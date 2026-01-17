import { Lecturer, Room, Module } from ;

//  use in:
//      - src/screens/admin/timetablebuilder/TimetableBuilder.tsx
//  for:
//      - adding and loading an event in the timetable like 'Freitag, 13:15 Uhr, SYP Vorlesung (MS4)'

export interface Event {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    name: string;
    lecturer: Lecturer;
    room: Room;
    module: Module;
    typeOf: string;
    duration: number;
}