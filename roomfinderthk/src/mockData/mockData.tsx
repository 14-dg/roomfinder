import { RoomWithStatus, Booking, TimeSlot, Lecture } from '@/models';

// Initial mock data++
export const initialRooms: RoomWithStatus[] = [
  { id: "1",  roomName: "A101", floor: 1, capacity: 20, hasBeamer: true,  isAvailable: true,  isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "2",  roomName: "A102", floor: 1, capacity: 30, hasBeamer: true,  isAvailable: false, isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "3",  roomName: "A103", floor: 1, capacity: 15, hasBeamer: false, isAvailable: true,  isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "4",  roomName: "A104", floor: 1, capacity: 25, hasBeamer: true,  isAvailable: true,  isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "5",  roomName: "B201", floor: 2, capacity: 40, hasBeamer: true,  isAvailable: true,  isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "6",  roomName: "B202", floor: 2, capacity: 50, hasBeamer: true,  isAvailable: false, isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "7",  roomName: "B203", floor: 2, capacity: 20, hasBeamer: false, isAvailable: true,  isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "8",  roomName: "B204", floor: 2, capacity: 35, hasBeamer: true,  isAvailable: true,  isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "9",  roomName: "C301", floor: 3, capacity: 60, hasBeamer: true,  isAvailable: false, isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "10", roomName: "C302", floor: 3, capacity: 45, hasBeamer: true,  isAvailable: true,  isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "11", roomName: "C303", floor: 3, capacity: 15, hasBeamer: false, isAvailable: true,  isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "12", roomName: "C304", floor: 3, capacity: 30, hasBeamer: false, isAvailable: true,  isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "13", roomName: "D401", floor: 4, capacity: 25, hasBeamer: true,  isAvailable: true,  isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "14", roomName: "D402", floor: 4, capacity: 20, hasBeamer: false, isAvailable: false, isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "15", roomName: "D403", floor: 4, capacity: 35, hasBeamer: true,  isAvailable: true,  isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "16", roomName: "D404", floor: 4, capacity: 15, hasBeamer: false, isAvailable: true,  isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "17", roomName: "E501", floor: 5, capacity: 80, hasBeamer: true,  isAvailable: true,  isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "18", roomName: "E502", floor: 5, capacity: 40, hasBeamer: true,  isAvailable: false, isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "19", roomName: "E503", floor: 5, capacity: 20, hasBeamer: false, isAvailable: true,  isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
  { id: "20", roomName: "E504", floor: 5, capacity: 50, hasBeamer: true,  isAvailable: true,  isLocked: false, campus: "deutz", building: "zentralgebäude", roomType: "seminarraum", checkins : 0, },
]; 

export const defaultSchedulePattern: TimeSlot[] = [
  { start: "08:00", end: "10:00", isBooked: false },
  { start: "10:00", end: "12:00", isBooked: false },
  { start: "12:00", end: "14:00", isBooked: false },
  { start: "14:00", end: "16:00", isBooked: false },
  { start: "16:00", end: "18:00", isBooked: false },
  { start: "18:00", end: "20:00", isBooked: false },
];

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const initialClasses: Lecture[] = [
  // Computer Science
  { id: "c1", name: "Introduction to Programming", subject: "Computer Science", professor: "Dr. Smith", roomId: "2", day: "Monday", timeSlot: "08:00-10:00" },
  { id: "c2", name: "Data Structures", subject: "Computer Science", professor: "Dr. Smith", roomId: "5", day: "Tuesday", timeSlot: "10:00-12:00" },
  { id: "c3", name: "Algorithms", subject: "Computer Science", professor: "Dr. Johnson", roomId: "9", day: "Wednesday", timeSlot: "14:00-16:00" },
  { id: "c4", name: "Database Systems", subject: "Computer Science", professor: "Dr. Williams", roomId: "10", day: "Thursday", timeSlot: "08:00-10:00" },
  { id: "c5", name: "Web Development", subject: "Computer Science", professor: "Dr. Brown", roomId: "6", day: "Friday", timeSlot: "12:00-14:00" },
  
  // Mathematics
  { id: "c6", name: "Calculus I", subject: "Mathematics", professor: "Prof. Davis", roomId: "17", day: "Monday", timeSlot: "10:00-12:00" },
  { id: "c7", name: "Linear Algebra", subject: "Mathematics", professor: "Prof. Davis", roomId: "17", day: "Wednesday", timeSlot: "08:00-10:00" },
  { id: "c8", name: "Statistics", subject: "Mathematics", professor: "Prof. Miller", roomId: "5", day: "Thursday", timeSlot: "14:00-16:00" },
  { id: "c9", name: "Discrete Mathematics", subject: "Mathematics", professor: "Prof. Wilson", roomId: "10", day: "Tuesday", timeSlot: "16:00-18:00" },
  
  // Physics
  { id: "c10", name: "Classical Mechanics", subject: "Physics", professor: "Dr. Anderson", roomId: "8", day: "Monday", timeSlot: "14:00-16:00" },
  { id: "c11", name: "Electromagnetism", subject: "Physics", professor: "Dr. Anderson", roomId: "8", day: "Wednesday", timeSlot: "10:00-12:00" },
  { id: "c12", name: "Quantum Physics", subject: "Physics", professor: "Dr. Taylor", roomId: "15", day: "Friday", timeSlot: "08:00-10:00" },
  
  // Business
  { id: "c13", name: "Marketing Fundamentals", subject: "Business", professor: "Prof. Martinez", roomId: "20", day: "Tuesday", timeSlot: "08:00-10:00" },
  { id: "c14", name: "Financial Accounting", subject: "Business", professor: "Prof. Garcia", roomId: "18", day: "Monday", timeSlot: "12:00-14:00" },
  { id: "c15", name: "Business Strategy", subject: "Business", professor: "Prof. Martinez", roomId: "20", day: "Thursday", timeSlot: "10:00-12:00" },
  
  // Engineering
  { id: "c16", name: "Circuit Design", subject: "Engineering", professor: "Dr. Lee", roomId: "13", day: "Tuesday", timeSlot: "14:00-16:00" },
  { id: "c17", name: "Thermodynamics", subject: "Engineering", professor: "Dr. Lee", roomId: "13", day: "Thursday", timeSlot: "16:00-18:00" },
  { id: "c18", name: "Materials Science", subject: "Engineering", professor: "Dr. White", roomId: "4", day: "Friday", timeSlot: "10:00-12:00" },
  
  // Biology
  { id: "c19", name: "Cell Biology", subject: "Biology", professor: "Prof. Clark", roomId: "7", day: "Monday", timeSlot: "16:00-18:00" },
  { id: "c20", name: "Genetics", subject: "Biology", professor: "Prof. Clark", roomId: "7", day: "Wednesday", timeSlot: "12:00-14:00" },
  { id: "c21", name: "Ecology", subject: "Biology", professor: "Dr. Harris", roomId: "12", day: "Friday", timeSlot: "14:00-16:00" },
];