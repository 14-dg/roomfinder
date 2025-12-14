import { createContext, useContext, useState, ReactNode } from 'react';
import { RoomWithStatus } from '@/models';

export interface Booking {
  id: string;
  roomId: string;
  day: string;
  timeSlot: string;
  subject: string;
  bookedByName: string;
  bookedByRole: string;
  createdAt: Date;
}

export interface StudentCheckin {
  id: string;
  roomId: string;
  day: string;
  timeSlot: string;
  studentId: string;
  studentName: string;
  activity: string;
  createdAt: Date;
}

// Activity noise levels for determining "loudest" activity
const activityNoiseLevel: Record<string, number> = {
  'Quiet Study': 1,
  'Reading': 1,
  'Exam Preparation': 2,
  'Presentation Prep': 3,
  'Project Work': 3,
  'Online Meeting': 4,
  'Group Discussion': 5,
};

export interface Class {
  id: string;
  name: string;
  subject: string;
  professor: string;
  roomId: string;
  day: string;
  timeSlot: string;
}

export interface UserTimetableEntry {
  id: string;
  classId: string;
  userId: string;
}

interface DataContextType {
  rooms: RoomWithStatus[];
  bookings: Booking[];
  studentCheckins: StudentCheckin[];
  classes: Class[];
  userTimetableEntries: UserTimetableEntry[];
  getRoomSchedule: (roomId: string) => DaySchedule[];
  getStudentCheckinsForSlot: (roomId: string, day: string, timeSlot: string) => StudentCheckin[];
  getLoudestActivity: (roomId: string, day: string, timeSlot: string) => string;
  getOccupancyLevel: (roomId: string, day: string, timeSlot: string, capacity: number) => 'empty' | 'moderate' | 'full';
  getCurrentDayAndTimeSlot: () => { day: string; timeSlot: string } | null;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  removeBooking: (id: string) => void;
  addStudentCheckin: (checkin: Omit<StudentCheckin, 'id' | 'createdAt'>) => void;
  removeStudentCheckin: (id: string) => void;
  addRoom: (room: RoomWithStatus) => void;
  updateRoom: (id: string, updates: Partial<RoomWithStatus>) => void;
  deleteRoom: (id: string) => void;
  uploadTimetable: (roomId: string, schedule: DaySchedule[]) => void;
  clearAllBookings: () => void;
  addClassToTimetable: (classId: string, userId: string) => void;
  removeClassFromTimetable: (classId: string, userId: string) => void;
  getUserClasses: (userId: string) => Class[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial mock data
const initialRooms: RoomWithStatus[] = [
  { id: "1", roomNumber: "A101", floor: 1, capacity: 20, occupiedSeats: 5, hasBeamer: true, isAvailable: true, isLocked: false, direction: 'north', availableUntil: "18:00" },
  { id: "2", roomNumber: "A102", floor: 1, capacity: 30, occupiedSeats: 30, hasBeamer: true, isAvailable: false, isLocked: false, direction: 'east' },
  { id: "3", roomNumber: "A103", floor: 1, capacity: 15, occupiedSeats: 3, hasBeamer: false, isAvailable: true, isLocked: false, direction: 'south', availableUntil: "17:00" },
  { id: "4", roomNumber: "A104", floor: 1, capacity: 25, occupiedSeats: 12, hasBeamer: true, isAvailable: true, isLocked: false, direction: 'east', availableUntil: "20:00" },
  { id: "5", roomNumber: "B201", floor: 2, capacity: 40, occupiedSeats: 8, hasBeamer: true, isAvailable: true, isLocked: false, direction: 'west', availableUntil: "16:30" },
  { id: "6", roomNumber: "B202", floor: 2, capacity: 50, occupiedSeats: 50, hasBeamer: true, isAvailable: false, isLocked: false, direction: 'north' },
  { id: "7", roomNumber: "B203", floor: 2, capacity: 20, occupiedSeats: 2, hasBeamer: false, isAvailable: true, isLocked: false, direction: 'north', availableUntil: "19:00" },
  { id: "8", roomNumber: "B204", floor: 2, capacity: 35, occupiedSeats: 15, hasBeamer: true, isAvailable: true, isLocked: false, direction: 'south', availableUntil: "21:00" },
  { id: "9", roomNumber: "C301", floor: 3, capacity: 60, occupiedSeats: 60, hasBeamer: true, isAvailable: false, isLocked: false, direction: 'west' },
  { id: "10", roomNumber: "C302", floor: 3, capacity: 45, occupiedSeats: 18, hasBeamer: true, isAvailable: true, isLocked: false, direction: 'east', availableUntil: "18:30" },
  { id: "11", roomNumber: "C303", floor: 3, capacity: 15, occupiedSeats: 0, hasBeamer: false, isAvailable: true, isLocked: false, direction: 'west', availableUntil: "22:00" },
  { id: "12", roomNumber: "C304", floor: 3, capacity: 30, occupiedSeats: 7, hasBeamer: false, isAvailable: true, isLocked: false, direction: 'north', availableUntil: "17:30" },
  { id: "13", roomNumber: "D401", floor: 4, capacity: 25, occupiedSeats: 10, hasBeamer: true, isAvailable: true, isLocked: false, direction: 'south', availableUntil: "19:30" },
  { id: "14", roomNumber: "D402", floor: 4, capacity: 20, occupiedSeats: 20, hasBeamer: false, isAvailable: false, isLocked: false, direction: 'east' },
  { id: "15", roomNumber: "D403", floor: 4, capacity: 35, occupiedSeats: 4, hasBeamer: true, isAvailable: true, isLocked: false, direction: 'east', availableUntil: "20:30" },
  { id: "16", roomNumber: "D404", floor: 4, capacity: 15, occupiedSeats: 1, hasBeamer: false, isAvailable: true, isLocked: false, direction: 'west', availableUntil: "16:00" },
  { id: "17", roomNumber: "E501", floor: 5, capacity: 80, occupiedSeats: 25, hasBeamer: true, isAvailable: true, isLocked: false, direction: 'north', availableUntil: "18:00" },
  { id: "18", roomNumber: "E502", floor: 5, capacity: 40, occupiedSeats: 40, hasBeamer: true, isAvailable: false, isLocked: false, direction: 'south' },
  { id: "19", roomNumber: "E503", floor: 5, capacity: 20, occupiedSeats: 6, hasBeamer: false, isAvailable: true, isLocked: false, direction: 'south', availableUntil: "21:30" },
  { id: "20", roomNumber: "E504", floor: 5, capacity: 50, occupiedSeats: 22, hasBeamer: true, isAvailable: true, isLocked: false, direction: 'east', availableUntil: "19:00" },
];

const defaultSchedulePattern: TimeSlot[] = [
  { start: "08:00", end: "10:00", isBooked: false },
  { start: "10:00", end: "12:00", isBooked: false },
  { start: "12:00", end: "14:00", isBooked: false },
  { start: "14:00", end: "16:00", isBooked: false },
  { start: "16:00", end: "18:00", isBooked: false },
  { start: "18:00", end: "20:00", isBooked: false },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const initialClasses: Class[] = [
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

export function DataProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<RoomWithStatus[]>(() => {
    const savedRooms = localStorage.getItem('rooms');
    return savedRooms ? JSON.parse(savedRooms) : initialRooms;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const savedBookings = localStorage.getItem('bookings');
    return savedBookings ? JSON.parse(savedBookings) : [];
  });

  const [studentCheckins, setStudentCheckins] = useState<StudentCheckin[]>(() => {
    const savedCheckins = localStorage.getItem('studentCheckins');
    return savedCheckins ? JSON.parse(savedCheckins) : [];
  });

  const [customSchedules, setCustomSchedules] = useState<RoomSchedule[]>(() => {
    const savedSchedules = localStorage.getItem('customSchedules');
    return savedSchedules ? JSON.parse(savedSchedules) : [];
  });

  const [classes, setClasses] = useState<Class[]>(() => {
    const savedClasses = localStorage.getItem('classes');
    return savedClasses ? JSON.parse(savedClasses) : initialClasses;
  });

  const [userTimetableEntries, setUserTimetableEntries] = useState<UserTimetableEntry[]>(() => {
    const savedEntries = localStorage.getItem('userTimetableEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  const getRoomSchedule = (roomId: string): DaySchedule[] => {
    // Check if there's a custom schedule for this room
    const customSchedule = customSchedules.find(s => s.roomId === roomId);
    
    if (customSchedule) {
      // Apply bookings to custom schedule
      return customSchedule.schedule.map(daySchedule => ({
        ...daySchedule,
        slots: daySchedule.slots.map(slot => {
          const booking = bookings.find(
            b => b.roomId === roomId && 
                 b.day === daySchedule.day && 
                 b.timeSlot === `${slot.start}-${slot.end}`
          );
          if (booking) {
            return {
              ...slot,
              isBooked: true,
              subject: booking.subject,
              bookedBy: booking.bookedByName,
              bookedByRole: booking.bookedByRole,
            };
          }
          return slot;
        }),
      }));
    }

    // Generate default schedule with bookings
    return days.map(day => ({
      day,
      slots: defaultSchedulePattern.map(slot => {
        const booking = bookings.find(
          b => b.roomId === roomId && 
               b.day === day && 
               b.timeSlot === `${slot.start}-${slot.end}`
        );
        if (booking) {
          return {
            ...slot,
            isBooked: true,
            subject: booking.subject,
            bookedBy: booking.bookedByName,
            bookedByRole: booking.bookedByRole,
          };
        }
        return slot;
      }),
    }));
  };

  const getStudentCheckinsForSlot = (roomId: string, day: string, timeSlot: string): StudentCheckin[] => {
    return studentCheckins.filter(
      c => c.roomId === roomId && c.day === day && c.timeSlot === timeSlot
    );
  };

  const getLoudestActivity = (roomId: string, day: string, timeSlot: string): string => {
    const checkins = getStudentCheckinsForSlot(roomId, day, timeSlot);
    let loudestActivity = '';
    let maxNoiseLevel = 0;
    checkins.forEach(checkin => {
      const noiseLevel = activityNoiseLevel[checkin.activity] || 0;
      if (noiseLevel > maxNoiseLevel) {
        maxNoiseLevel = noiseLevel;
        loudestActivity = checkin.activity;
      }
    });
    return loudestActivity;
  };

  const getOccupancyLevel = (roomId: string, day: string, timeSlot: string, capacity: number): 'empty' | 'moderate' | 'full' => {
    const checkins = getStudentCheckinsForSlot(roomId, day, timeSlot);
    const occupiedSeats = checkins.length;
    if (occupiedSeats === 0) {
      return 'empty';
    } else if (occupiedSeats <= capacity / 2) {
      return 'moderate';
    } else {
      return 'full';
    }
  };

  const getCurrentDayAndTimeSlot = (): { day: string; timeSlot: string } | null => {
    const now = new Date();
    const currentDay = days[now.getDay() - 1]; // Adjust for 0-based index
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (const slot of defaultSchedulePattern) {
      const [startHour, startMinute] = slot.start.split(':').map(Number);
      const [endHour, endMinute] = slot.end.split(':').map(Number);

      if (
        (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
        (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute))
      ) {
        return { day: currentDay, timeSlot: `${slot.start}-${slot.end}` };
      }
    }

    return null;
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const removeBooking = (id: string) => {
    const updatedBookings = bookings.filter(b => b.id !== id);
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const addStudentCheckin = (checkin: Omit<StudentCheckin, 'id' | 'createdAt'>) => {
    const newCheckin: StudentCheckin = {
      ...checkin,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const updatedCheckins = [...studentCheckins, newCheckin];
    setStudentCheckins(updatedCheckins);
    localStorage.setItem('studentCheckins', JSON.stringify(updatedCheckins));
  };

  const removeStudentCheckin = (id: string) => {
    const updatedCheckins = studentCheckins.filter(c => c.id !== id);
    setStudentCheckins(updatedCheckins);
    localStorage.setItem('studentCheckins', JSON.stringify(updatedCheckins));
  };

  const addRoom = (room: RoomWithStatus) => {
    const updatedRooms = [...rooms, room];
    setRooms(updatedRooms);
    localStorage.setItem('rooms', JSON.stringify(updatedRooms));
  };

  const updateRoom = (id: string, updates: Partial<RoomWithStatus>) => {
    const updatedRooms = rooms.map(r => r.id === id ? { ...r, ...updates } : r);
    setRooms(updatedRooms);
    localStorage.setItem('rooms', JSON.stringify(updatedRooms));
  };

  const deleteRoom = (id: string) => {
    const updatedRooms = rooms.filter(r => r.id !== id);
    setRooms(updatedRooms);
    localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    
    // Also remove bookings for this room
    const updatedBookings = bookings.filter(b => b.roomId !== id);
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const uploadTimetable = (roomId: string, schedule: DaySchedule[]) => {
    const updatedSchedules = customSchedules.filter(s => s.roomId !== roomId);
    updatedSchedules.push({ roomId, schedule });
    setCustomSchedules(updatedSchedules);
    localStorage.setItem('customSchedules', JSON.stringify(updatedSchedules));
  };

  const clearAllBookings = () => {
    setBookings([]);
    localStorage.setItem('bookings', JSON.stringify([]));
  };

  const addClassToTimetable = (classId: string, userId: string) => {
    const newEntry: UserTimetableEntry = {
      id: Date.now().toString(),
      classId,
      userId,
    };
    const updatedEntries = [...userTimetableEntries, newEntry];
    setUserTimetableEntries(updatedEntries);
    localStorage.setItem('userTimetableEntries', JSON.stringify(updatedEntries));
  };

  const removeClassFromTimetable = (classId: string, userId: string) => {
    const updatedEntries = userTimetableEntries.filter(e => e.classId !== classId || e.userId !== userId);
    setUserTimetableEntries(updatedEntries);
    localStorage.setItem('userTimetableEntries', JSON.stringify(updatedEntries));
  };

  const getUserClasses = (userId: string) => {
    const userClasses = userTimetableEntries
      .filter(e => e.userId === userId)
      .map(e => classes.find(c => c.id === e.classId))
      .filter((c): c is Class => c !== undefined);
    return userClasses;
  };

  return (
    <DataContext.Provider
      value={{
        rooms,
        bookings,
        studentCheckins,
        classes,
        userTimetableEntries,
        getRoomSchedule,
        getStudentCheckinsForSlot,
        getLoudestActivity,
        getOccupancyLevel,
        getCurrentDayAndTimeSlot,
        addBooking,
        removeBooking,
        addStudentCheckin,
        removeStudentCheckin,
        addRoom,
        updateRoom,
        deleteRoom,
        uploadTimetable,
        clearAllBookings,
        addClassToTimetable,
        removeClassFromTimetable,
        getUserClasses,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}