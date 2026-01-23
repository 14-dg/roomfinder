import type { Room, Lecture } from '@/models';

export const mockRooms: Room[] = [
  { 
    id: "101", 
    label: "A1.01", 
    floor: 1, 
    building: "Hauptgebäude", 
    roomType: "Seminarraum", 
    checkIns: 12,
    isOccupied: false 
  },
  { 
    id: "102", 
    label: "A1.02", 
    floor: 1, 
    building: "Hauptgebäude", 
    roomType: "PC-Pool", 
    checkIns: 25,
    isOccupied: true,
    occupiedBy: "Programmierung 1"
  },
  { 
    id: "103", 
    label: "A2.10", 
    floor: 2, 
    building: "Hauptgebäude", 
    roomType: "Labor", 
    checkIns: 3,
    isOccupied: false 
  },
  { 
    id: "104", 
    label: "H1", 
    floor: 0, 
    building: "Hauptgebäude", 
    roomType: "Hörsaal", 
    checkIns: 85,
    isOccupied: false 
  },
  
  // Ingenieurwissenschaftliches Zentrum (IWZ)
  { 
    id: "201", 
    label: "ZW-4.15", 
    floor: 4, 
    building: "IWZ", 
    roomType: "Seminarraum", 
    checkIns: 0,
    isOccupied: false 
  },
  { 
    id: "202", 
    label: "ZW-2.01", 
    floor: 2, 
    building: "IWZ", 
    roomType: "Hörsaal", 
    checkIns: 120,
    isOccupied: false 
  },
  
  // Bibliothek / Mensa Gebäude
  { 
    id: "301", 
    label: "Bib-Lounge", 
    floor: 1, 
    building: "Bibliothek", 
    roomType: "Offener Bereich", 
    checkIns: 45,
    isOccupiedByLecture: false 
  },
  { 
    id: "302", 
    label: "Lernraum 3", 
    floor: 2, 
    building: "Bibliothek", 
    roomType: "Seminarraum", 
    checkIns: 8,
    isOccupiedByLecture: false 
  },
];

// Hinweis: dayOfWeek: 0=Sonntag, 1=Montag, 2=Dienstag, 3=Mittwoch, 4=Donnerstag, 5=Freitag, 6=Samstag
export const mockLectures: Lecture[] = [
  {
    id: "l1",
    name: "Systementwurfspraktikum",
    abbreviation: "SYP",
    professor: "Prof. Dr. Wörzberger",
    roomId: "101",
    schedule: [
      {
        dayOfWeek: 1, // Montag
        startTime: "10:00",
        endTime: "14:00",
        startDate: "2025-04-01",
        endDate: "2025-07-31"
      },
      {
        dayOfWeek: 4, // Donnerstag
        startTime: "09:00",
        endTime: "11:00",
        startDate: "2025-04-01",
        endDate: "2025-07-31"
      }
    ]
  },
  {
    id: "l2",
    name: "Programmierung 1",
    abbreviation: "PROG1",
    professor: "Prof. Dr. Java",
    roomId: "102",
    schedule: [
      {
        dayOfWeek: 2, // Dienstag
        startTime: "08:00",
        endTime: "12:00",
        startDate: "2025-04-01",
        endDate: "2025-07-31"
      },
      {
        dayOfWeek: 3, // Mittwoch
        startTime: "14:00",
        endTime: "16:00",
        startDate: "2025-04-01",
        endDate: "2025-07-31"
      }
    ]
  },
  {
    id: "l3",
    name: "Datenbanken",
    abbreviation: "DB",
    professor: "Prof. Dr. SQL",
    roomId: "104",
    schedule: [
      {
        dayOfWeek: 3, // Mittwoch
        startTime: "10:00",
        endTime: "11:30",
        startDate: "2025-04-01",
        endDate: "2025-07-31"
      }
    ]
  },
  {
    id: "l4",
    name: "Mathematik 2",
    abbreviation: "MAT2",
    professor: "Prof. Dr. Gauss",
    roomId: "202",
    schedule: [
      {
        dayOfWeek: 1, // Montag
        startTime: "08:15",
        endTime: "09:45",
        startDate: "2025-04-01",
        endDate: "2025-07-31"
      },
      {
        dayOfWeek: 5, // Freitag
        startTime: "10:00",
        endTime: "11:30",
        startDate: "2025-04-01",
        endDate: "2025-07-31"
      }
    ]
  },
  {
    id: "l5",
    name: "Web Engineering",
    abbreviation: "WEB",
    professor: "Prof. Dr. Netz",
    roomId: "201",
    schedule: [
      {
        dayOfWeek: 4, // Donnerstag
        startTime: "14:00",
        endTime: "17:00",
        startDate: "2025-04-01",
        endDate: "2025-07-31"
      }
    ]
  }
];

// Ergänzung für src/data/mockData.ts
import type { Event } from '@/models';

export const mockEvents: Event[] = [
  {
    id: "e1",
    designation: "Gastvortrag: KI in der modernen Softwareentwicklung",
    professor: "Dipl.-Inf. Markus Schmidt (Extern)",
    roomId: "104", // Findet im Hörsaal H1 statt
    schedule: [
      {
        date: "2026-01-14", // Heute (Mittwoch)
        dayOfWeek: 3,       // Mittwoch
        startTime: "17:00",
        endTime: "18:30"
      }
    ]
  },
  {
    id: "e2",
    designation: "Nachprüfung Grundlagen der Informatik",
    professor: "Prof. Dr. Wörzberger",
    roomId: "101", // Findet im Raum A1.01 statt
    schedule: [
      {
        date: "2026-01-16", // Kommender Freitag
        dayOfWeek: 5,       // Freitag
        startTime: "09:00",
        endTime: "12:00"
      }
    ]
  }
];