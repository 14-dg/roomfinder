import { Event, Lecturer, RoomTimetable } from '@/models';

export const initialEvents: Event[] = [
  {
    id: 1,
    day: 'Monday',
    startTime: '08:00',
    endTime: '09:45',
    name: 'Mathematik I',
    lecturer: {
      id: '1',
      name: 'Dr. Müller',
      department: 'Mathematik',
      email: 'mueller@uni.de',
      officeHours: '10:00-12:00',
      officeLocation: 'ABC',
      events: []
    },
    room: {
      id: 1,
      roomNumber: 'A101',
      floor: 1,
      capacity: 50,
      occupiedSeats: 45,
      hasBeamer: true,
      isLocked: false,
    },
    module: { id: 1, name: 'Mathematik' },
    typeOf: 'Vorlesung',
    duration: 2,
    column: 1,
  },
  {
    id: 2,
    day: 'Monday',
    startTime: '10:35',
    endTime: '12:20',
    name: 'Programmieren',
    lecturer: {
      id: '2',
      name: 'Dr. Schmidt',
      department: 'Informatik',
      email: 'schmidt@uni.de',
      officeHours: '13:00-15:00',
      officeLocation: 'DEF',
      events: []
    },
    room: {
      id: 2,
      roomNumber: 'B202',
      floor: 2,
      capacity: 30,
      occupiedSeats: 25,
      hasBeamer: true,
      isLocked: false
    },
    module: { id: 2, name: 'Informatik' },
    typeOf: 'Übung',
    duration: 3,
    column: 2,
  },
];
