import type { Room, Lecture, ProfessorUser } from '@/models';

export const mockRooms: Room[] = [
  { 
    id: "101", 
    label: "A1.01", 
    floor: 1, 
    building: "Hauptgebäude", 
    roomType: "Seminarraum", 
    checkIns: 12,
    isOccupiedByLecture: false 
  },
  { 
    id: "102", 
    label: "A1.02", 
    floor: 1, 
    building: "Hauptgebäude", 
    roomType: "PC-Pool", 
    checkIns: 25,
    isOccupiedByLecture: true,
    currentLectureName: "Programmierung 1"
  }
];

export const mockLectures: Lecture[] = [
  {
    id: "l1",
    name: "Systementwurfspraktikum",
    abbreviation: "SYP",
    professor: "Prof. Dr. Hopp",
    roomId: "101",
    schedule: [
      {
        dayOfWeek: 1,
        startTime: "10:00",
        endTime: "14:00",
        startDate: "2025-04-01",
        endDate: "2025-05-31"
      },
      {
        dayOfWeek: 4,
        startTime: "09:00",
        endTime: "11:00",
        startDate: "2025-04-01",
        endDate: "2025-07-31"
      }
    ]
  }
];