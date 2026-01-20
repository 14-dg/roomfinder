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
  getRooms,
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
} from "@/services/firebase";

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
    const loadAll = async () => {
      setIsLoading(true);

      const [
        roomsData,
        bookingsData,
        checkinsData,
        schedulesData,
        classesData,
        timetableData,
        lecturersData,
      ] = await Promise.all([
        getRooms(),
        getAllBookings(),
        getAllStudentCheckins(),
        getAllCustomSchedules(),
        getAllLectures(),
        getAllUserTimetableEntries(),
        getLecturers(),
      ]);

      setRooms(roomsData);
      setBookings(bookingsData);
      setStudentCheckins(checkinsData);
      setCustomSchedules(schedulesData);
      setClasses(classesData);
      setUserTimetableEntries(timetableData);
      setLecturers(lecturersData);

      setIsLoading(false);
    };

    loadAll();
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

  const addRoom = async (room: Omit<RoomWithStatus, "id">) => {
    await addRoomService(room);
    setRooms(await getRooms());
  };

  const updateRoom = async (id: string, updates: Partial<RoomWithStatus>) => {
    await updateRoomService(id, updates);
    setRooms(await getRooms());
  };

  const deleteRoom = async (id: string) => {
    await deleteRoomService(id);
    setRooms(await getRooms());
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
