import { Lecturer, Room, Module, RoomTimetable } from './index';

//  use in:
//      - src/screens/admin/timetablebuilder/TimetableBuilder.tsx
//  for:
//      - adding and loading an event in the timetable like 'Freitag, 13:15 Uhr, SYP Vorlesung (MS4)'

export interface Event {
    id?: number;
    day: string;
    startTime: string;
    endTime: string;
    name: string;
    lecturer: Lecturer | null;
    room: RoomTimetable | null;
    module: Module | null;
    typeOf: string;
    duration: number;
    column: number;
}