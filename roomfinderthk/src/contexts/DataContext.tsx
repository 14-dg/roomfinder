import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  RoomWithStatus,
  Booking,
  Lecture,
  CheckIn,
  UserTimetableEntry,
  DaySchedule,
  RoomSchedule,
} from "@/models";

import {
  getAllRooms,
  getAllBookings,
  getAllLectures,
  getAllStudentCheckins,
  getAllUserTimetableEntries,
  getAllCustomSchedules,
  getLecturers,
  addRoom as addRoomService,
  updateRoom as updateRoomService,
  deleteRoom as deleteRoomService,
  registerProfessor,
  updateLecturerProfile,
  deleteProfessorAndLecturer,
  sendEmailToProfessorForPassword,
  addStudentCheckin as addStudentCheckinService,
  removeStudentCheckin as removeStudentCheckinService,
  } from "@/services/firebase";
import { start } from 'repl';
import { toast } from 'sonner';

import { days, defaultSchedulePattern } from "@/mockData/mockData";

interface DataContextType {
  rooms: RoomWithStatus[];
  bookings: Booking[];
  studentCheckins: CheckIn[];
  classes: Lecture[];
  lecturers: any[];
  userTimetableEntries: UserTimetableEntry[];
  isLoading: boolean;

  getRoomSchedule: (roomId: string) => DaySchedule[];
  getStudentCheckinsForSlot: (roomId: string, day: string, timeSlot: string) => CheckIn[];
  getOccupancyLevel: (
    roomId: string,
    day: string,
    timeSlot: string,
    capacity: number
  ) => "empty" | "moderate" | "full";

  addRoom: (room: Omit<RoomWithStatus, "id">) => Promise<void>;
  updateRoom: (id: string, updates: Partial<RoomWithStatus>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;

  addProfessor: (email: string, name: string) => Promise<void>;
  updateOfficeHours: (id: string, time: string, room: string) => Promise<void>;
  removeProfessor: (id: string) => Promise<void>;

  getUserClasses: (userId: string) => Lecture[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<RoomWithStatus[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [studentCheckins, setStudentCheckins] = useState<CheckIn[]>([]);
  const [customSchedules, setCustomSchedules] = useState<RoomSchedule[]>([]);
  const [classes, setClasses] = useState<Lecture[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [userTimetableEntries, setUserTimetableEntries] = useState<UserTimetableEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    const custom = customSchedules.find(s => s.roomId === roomId);

    const baseSchedule = custom
      ? custom.schedule
      : days.map(day => ({
          day,
          slots: defaultSchedulePattern.map(slot => ({
            ...slot,
            isBooked: false,
          })),
        }));

    return baseSchedule.map(daySchedule => ({
      ...daySchedule,
      slots: daySchedule.slots.map(slot => {
        const booking = bookings.find(
          b =>
            b.roomId === roomId &&
            b.day === daySchedule.day &&
            b.timeSlot === `${slot.start}-${slot.end}`
        );

        return booking
          ? {
              ...slot,
              isBooked: true,
              subject: booking.subject,
              bookedBy: booking.bookedByName,
              bookedByRole: booking.bookedByRole,
            }
          : slot;
      }),
    }));
  };

  const getStudentCheckinsForSlot = (
    roomId: string,
    day: string,
    timeSlot: string
  ) =>
    studentCheckins.filter(
      c => c.roomId === roomId && c.day === day && c.timeSlot === timeSlot
    );

  const getOccupancyLevel = (
    roomId: string,
    day: string,
    timeSlot: string,
    capacity: number
  ): "empty" | "moderate" | "full" => {
    const count = getStudentCheckinsForSlot(roomId, day, timeSlot).length;
    if (count === 0) return "empty";
    if (count <= capacity / 2) return "moderate";
    return "full";
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

  const addStudentCheckin = async (checkin: Omit<CheckIn, 'id'>) => {
    const newCheckin: CheckIn = {
      ...checkin,
      id: Date.now().toString(),
    };
    try {
      setStudentCheckins(prev => [...prev, newCheckin]);
      await addStudentCheckinService(newCheckin);

      setRooms(prevRooms => prevRooms.map(room => {
        if (room.id === checkin.roomId) {
          return { ...room, checkins: (room.checkins || 0) + 1 }; 
        }
        return room;
      }));

      const room = rooms.find(r => r.id === checkin.roomId);
      if (room) {
         await updateRoomService(room.id, { checkins: (room.checkins || 0) + 1 });
      }

    } catch(error) {
      toast.error("Check-in fehlgeschlagen");
    }
  };

  const removeStudentCheckin = async (id: string) => {
    try {

      const checkInToRemove = studentCheckins.find(c => c.id === id);

      setStudentCheckins(prev => prev.filter(c => c.id !== id));

      await removeStudentCheckinService(id);
      
      if (checkInToRemove) {
        setRooms(prevRooms => prevRooms.map(room => {
          if (room.id === checkInToRemove.roomId) {
            // Sicherstellen, dass man nicht unter 0 checkins haben kann
            const newCount = (room.checkins || 0) - 1;
            return { ...room, checkins: newCount < 0 ? 0 : newCount };
          }
          return room;
        }));
      }
      
    } catch(error) {
      toast.error("Check-out fehlgeschlagen");
    }
  };

  const addRoom = async (room: RoomWithStatus) => {
    // const updatedRooms = [...rooms, room];
    // setRooms(updatedRooms);
    // localStorage.setItem('rooms', JSON.stringify(updatedRooms));

    await addRoomService(room);
    await refreshRooms();
  };

  const updateRoom = async (id: string, updates: Partial<RoomWithStatus>) => {
    // const updatedRooms = rooms.map((r) => r.id === id ? { ...r, ...updates } : r);
    // setRooms(updatedRooms);
    // localStorage.setItem('rooms', JSON.stringify(updatedRooms));

    await updateRoomService(id, updates);
    await refreshRooms();
  };

  const deleteRoom = async (id: string) => {
    // const updatedRooms = rooms.filter(r => r.id !== id);
    // setRooms(updatedRooms);
    // localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    
    // // Also remove bookings for this room
    // const updatedBookings = bookings.filter(b => b.roomId !== id);
    // setBookings(updatedBookings);
    // localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
    await deleteRoomService(id);
    await refreshRooms();
  };

  const addProfessor = async (email: string, name: string) => {
    await registerProfessor(email, name);
    setLecturers(await getLecturers());
  };

  const updateOfficeHours = async (id: string, time: string, room: string) => {
    await updateLecturerProfile(id, { officeHours: time, officeLocation: room });
    setLecturers(await getLecturers());
  };

  const removeProfessor = async (id: string) => {
    await deleteProfessorAndLecturer(id);
    setLecturers(await getLecturers());
  };

  const getUserClasses = (userId: string): Lecture[] =>
    userTimetableEntries
      .filter(e => e.userId === userId)
      .map(e => classes.find(c => c.id === e.classId))
      .filter(Boolean) as Lecture[];

  return (
    <DataContext.Provider
      value={{
        rooms,
        bookings,
        studentCheckins,
        classes,
        lecturers,
        userTimetableEntries,
        isLoading,
        getRoomSchedule,
        getStudentCheckinsForSlot,
        getOccupancyLevel,
        addRoom,
        updateRoom,
        deleteRoom,
        addProfessor,
        updateOfficeHours,
        removeProfessor,
        getUserClasses,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
