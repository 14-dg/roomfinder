//  use in:
//      - src/screens/admin/timetablebuilder/TimetableBuilder.tsx
//  for:
//      - setting room for an event in the timetable liek 'ZW 07-01'

export interface roomTimetable {
    id: number;
    roomNumber: string;
    floor: number;
    capacity: number;
    occupiedSeats: number;
    hasBeamer: boolean;
    isLocked: boolean;
}