import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { RoomWithStatus, Booking, Lecture, CheckIn, UserTimetableEntry, DaySchedule, RoomSchedule } from '@/models';
import {initialClasses, initialRooms, defaultSchedulePattern, days} from "../mockData/mockData";
import {
  getAllBookings,
  getAllCustomSchedules,
  getAllLectures,
  getAllRooms,
  getAllStudentCheckins,
  getAllUserTimetableEntries,
  getBookings,
  getRoomDetailScreen,
  getRooms,
  addRoom as addRoomService,
  updateRoom as updateRoomService,
  deleteRoom as deleteRoomService,
  getLecturers,
  registerProfessor,
  updateLecturerProfile,
  deleteProfessorAndLecturer,
  sendEmailToProfessorForPassword
  } from "@/services/firebase";

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

interface DataContextType {
  rooms: RoomWithStatus[];
  bookings: Booking[];
  studentCheckins: CheckIn[];
  classes: Lecture[];
  lecturers: any[];
  userTimetableEntries: UserTimetableEntry[];
  getRoomSchedule: (roomId: string) => DaySchedule[];
  getStudentCheckinsForSlot: (roomId: string, day: string, timeSlot: string) => CheckIn[];
  getLoudestActivity: (roomId: string, day: string, timeSlot: string) => string;
  getOccupancyLevel: (roomId: string, day: string, timeSlot: string, capacity: number) => 'empty' | 'moderate' | 'full';
  getCurrentDayAndTimeSlot: () => { day: string; timeSlot: string } | null;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  removeBooking: (id: string) => void;
  addStudentCheckin: (checkin: Omit<CheckIn, 'id' | 'createdAt'>) => void;
  removeStudentCheckin: (id: string) => void;
  addRoom: (room: RoomWithStatus) => void;
  updateRoom: (id: string, updates: Partial<RoomWithStatus>) => void;
  deleteRoom: (id: string) => void;
  addProfessor: (email: string, name: string) => Promise<void>;
  updateOfficeHours: (id: string, time: string, room: string) => Promise<void>;
  removeProfessor: (id: string) => Promise<void>;
  uploadTimetable: (roomId: string, schedule: DaySchedule[]) => void;
  clearAllBookings: () => void;
  addClassToTimetable: (classId: string, userId: string) => void;
  removeClassFromTimetable: (classId: string, userId: string) => void;
  getUserClasses: (userId: string) => Lecture[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {

  // const [rooms, setRooms] = useState<RoomWithStatus[]>(() => {
  //   const savedRooms = localStorage.getItem('rooms');
  //   return savedRooms ? JSON.parse(savedRooms) : initialRooms;
  // });
  const [rooms, setRooms] = useState<RoomWithStatus[]>([]);

  // const [bookings, setBookings] = useState<Booking[]>(() => {
  //   const savedBookings = localStorage.getItem('bookings');
  //   return savedBookings ? JSON.parse(savedBookings) : [];
  // });
  const [bookings, setBookings] = useState<Booking[]>([]);

  // const [studentCheckins, setStudentCheckins] = useState<CheckIn[]>(() => {
  //   const savedCheckins = localStorage.getItem('studentCheckins');
  //   return savedCheckins ? JSON.parse(savedCheckins) : [];
  // });
  const [studentCheckins, setStudentCheckins] = useState<CheckIn[]>([]);

  // const [customSchedules, setCustomSchedules] = useState<RoomSchedule[]>(() => {
  //   const savedSchedules = localStorage.getItem('customSchedules');
  //   return savedSchedules ? JSON.parse(savedSchedules) : [];
  // });
  const [customSchedules, setCustomSchedules] = useState<RoomSchedule[]>([]);

  // const [classes, setClasses] = useState<Lecture[]>(() => {
  //   const savedClasses = localStorage.getItem('classes');
  //   return savedClasses ? JSON.parse(savedClasses) : initialClasses;
  // });
  const [classes, setClasses] = useState<Lecture[]>([]);


  const [lecturers, setLecturers] = useState<any[]>([]);

  // const [userTimetableEntries, setUserTimetableEntries] = useState<UserTimetableEntry[]>(() => {
  //   const savedEntries = localStorage.getItem('userTimetableEntries');
  //   return savedEntries ? JSON.parse(savedEntries) : [];
  // });
  const [userTimetableEntries, setUserTimetableEntries] = useState<UserTimetableEntry[]>([]);

  const refreshLecturers = async () => {
    const data = await getLecturers();
    setLecturers(data);
  };

  useEffect(() => {

    const fetchData = async () => {
      try {
        const allRooms = await getAllRooms();
        setRooms(allRooms);

        const allBookings = await getAllBookings();
        setBookings(allBookings); 
        const allStudentCheckins = await getAllStudentCheckins();
        setStudentCheckins(allStudentCheckins);

        const allCustomSchedules = await getAllCustomSchedules();
        setCustomSchedules(allCustomSchedules);

        const allLectures = await getAllLectures();
        setClasses(allLectures);

        const allUserTimetableEntries = await getAllUserTimetableEntries();
        setUserTimetableEntries(allUserTimetableEntries);

        const allLecturers = await getLecturers();
        setLecturers(allLecturers);
      }
      finally {

      }
    }

    fetchData();
  }, []);

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

  const getStudentCheckinsForSlot = (roomId: string, day: string, timeSlot: string): CheckIn[] => {
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

  const addStudentCheckin = (checkin: Omit<CheckIn, 'id' | 'createdAt'>) => {
    const newCheckin: CheckIn = {
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
    // const updatedRooms = [...rooms, room];
    // setRooms(updatedRooms);
    // localStorage.setItem('rooms', JSON.stringify(updatedRooms));

    addRoomService(room);
  };

  const updateRoom = (id: string, updates: Partial<RoomWithStatus>) => {
    // const updatedRooms = rooms.map(r => r.id === id ? { ...r, ...updates } : r);
    // setRooms(updatedRooms);
    // localStorage.setItem('rooms', JSON.stringify(updatedRooms));

    updateRoomService(id, updates);
  };

  const deleteRoom = (id: string) => {
    // const updatedRooms = rooms.filter(r => r.id !== id);
    // setRooms(updatedRooms);
    // localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    
    // // Also remove bookings for this room
    // const updatedBookings = bookings.filter(b => b.roomId !== id);
    // setBookings(updatedBookings);
    // localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
    deleteRoomService(id);
  };


  const addProfessor = async (email: string, name: string) => {
    const password = "12345"; 
    await registerProfessor(email, password, name);
    await sendEmailToProfessorForPassword(email, password);
    await refreshLecturers();
  };

  const updateOfficeHours = async (id: string, time: string, room: string) => {
    await updateLecturerProfile(id, { officeHours: time, officeLocation: room });
    await refreshLecturers();
  };

  const removeProfessor = async (id: string) => {
    await deleteProfessorAndLecturer(id);
    await refreshLecturers();
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
    // const updatedEntries = userTimetableEntries.filter(e => e.classId !== classId || e.userId !== userId);
    // setUserTimetableEntries(updatedEntries);
    // localStorage.setItem('userTimetableEntries', JSON.stringify(updatedEntries));

    
  };

  const getUserClasses = (userId: string) => {
    const userClasses = userTimetableEntries
      .filter(e => e.userId === userId)
      .map(e => classes.find(c => c.id === e.classId))
      .filter((c): c is Lecture => c !== undefined);
    return userClasses;
  };

  return (
    <DataContext.Provider
      value={{
        rooms,
        bookings,
        studentCheckins,
        classes,
        lecturers,
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
        addProfessor,      
        updateOfficeHours, 
        removeProfessor,
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