import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { 
  RoomWithStatus, Booking, Lecture, CheckIn, UserTimetableEntry, 
  DaySchedule, Timetable, Module, Event 
} from '@/models';
import { defaultSchedulePattern, days } from "../mockData/mockData";
import * as fb from "@/services/firebase";
import { toast } from 'sonner';

// Import der neuen Hooks
import { useRoomData } from './hooks/useRoomData';
import { useBookingData } from './hooks/useBookingData';
import { useLectureData } from './hooks/useLectureData';
import { useLecturerData } from './hooks/useLecturerData';

const activityNoiseLevel: Record<string, number> = {
  'Quiet Study': 1, 'Reading': 1, 'Exam Preparation': 2,
  'Presentation Prep': 3, 'Project Work': 3, 'Online Meeting': 4, 'Group Discussion': 5,
};

interface DataContextType {
  // States
  rooms: RoomWithStatus[];
  bookings: Booking[];
  studentCheckins: CheckIn[];
  classes: Lecture[];
  lecturers: any[];
  userTimetableEntries: UserTimetableEntry[];
  timetables: Timetable[];
  modules: Module[];

  // Selektoren & Helper
  getRoomSchedule: (roomId: string) => DaySchedule[];
  getRoomLectures: (roomId: string) => Lecture[];
  getRoomBookings: (roomId: string) => Booking[];
  getProfessorLectures: (profId: string) => Lecture[];
  getStudentCheckinsForSlot: (roomId: string, day: string, timeSlot: string) => CheckIn[];
  getLoudestActivity: (roomId: string, day: string, timeSlot: string) => string;
  getOccupancyLevel: (roomId: string, day: string, timeSlot: string, capacity: number) => 'empty' | 'moderate' | 'full';
  getCurrentDayAndTimeSlot: () => { day: string; timeSlot: string } | null;
  getUserClasses: (userId: string) => Lecture[];
  getUserEvents: (userId: string) => (UserTimetableEntry & { event?: Event })[];

  // Actions
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<void>;
  removeBooking: (id: string) => Promise<void>;
  addStudentCheckin: (checkin: Omit<CheckIn, 'id'>) => Promise<void>;
  removeStudentCheckin: (id: string) => Promise<void>;
  addRoom: (room: RoomWithStatus) => Promise<void>;
  updateRoom: (id: string, updates: Partial<RoomWithStatus>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
  addProfessor: (email: string, name: string) => Promise<void>;
  updateOfficeHours: (id: string, time: string, room: string) => Promise<void>;
  removeProfessor: (id: string) => Promise<void>;
  addLecture: (lecture: Omit<Lecture, 'id'>) => Promise<Lecture | null>;
  removeLecture: (id: string) => Promise<void>;
  saveTimetable: (t: Timetable) => Promise<void>;
  saveModules: (m: Module[]) => Promise<void>;
  uploadTimetable: (roomId: string, schedule: DaySchedule[]) => Promise<void>;
  addEventToUserTimetable: (cId: string, uId: string, e: Event) => Promise<void>;
  removeEventFromUserTimetable: (cId: string, uId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // 1. Initialisiere Hooks
  const lectureModule = useLectureData();
  const roomModule = useRoomData(lectureModule.classes, []); 
  const lecturerModule = useLecturerData(lectureModule.classes);
  const bookingModule = useBookingData(roomModule.rooms, roomModule.refreshRooms);

  // 2. Daten laden (Initial Sync)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [r, b, s, c, l, t, m, u] = await Promise.all([
          fb.getAllRooms(), fb.getAllBookings(), fb.getAllStudentCheckins(),
          fb.getAllLectures(), fb.getLecturers(), fb.loadTimetables(),
          fb.loadModules(), fb.getAllUserTimetableEntries()
        ]);
        roomModule.setRooms(r);
        bookingModule.setBookings(b);
        bookingModule.setStudentCheckins(s);
        lectureModule.setClasses(c);
        lecturerModule.setLecturers(l);
        lectureModule.setTimetables(t);
        lectureModule.setModules(m);
        lectureModule.setUserTimetableEntries(u);
      } catch (e) { console.error("Data fetch error", e); }
    };
    fetchData();
  }, []);

  // 3. Selektoren (Zusammenführung der Daten aus verschiedenen Hooks)
  const getRoomLectures = useCallback((roomId: string) => 
    lectureModule.classes.filter(l => l.roomId === roomId), [lectureModule.classes]);

  const getRoomBookings = useCallback((roomId: string) => 
    bookingModule.bookings.filter(b => b.roomId === roomId), [bookingModule.bookings]);

  const getRoomSchedule = useCallback((roomId: string): DaySchedule[] => {
    const roomLectures = getRoomLectures(roomId);
    const roomBookings = getRoomBookings(roomId);
    return days.map(day => ({
      day,
      slots: defaultSchedulePattern.map(slot => {
        const timeStr = `${slot.start}-${slot.end}`;
        const lMatch = roomLectures.find(l => l.day === day && `${l.startTime}-${l.endTime}` === timeStr);
        const bMatch = roomBookings.find(b => b.roomId === roomId && b.day === day && b.timeSlot === timeStr);
        return {
          ...slot,
          isBooked: !!(lMatch || bMatch),
          subject: lMatch?.name || bMatch?.subject || '',
          bookedBy: lMatch?.professor || bMatch?.bookedByName || '',
          isLecture: !!lMatch
        };
      }),
    }));
  }, [getRoomLectures, getRoomBookings]);

  // 4. Hilfsfunktionen (Noise & Occupancy)
  const getStudentCheckinsForSlot = (roomId: string, day: string, timeSlot: string) => 
    bookingModule.studentCheckins.filter(c => c.roomId === roomId && c.day === day && c.timeSlot === timeSlot);

  const getLoudestActivity = (roomId: string, day: string, timeSlot: string) => {
    const checkins = getStudentCheckinsForSlot(roomId, day, timeSlot);
    let loudest = ''; let maxNoise = 0;
    checkins.forEach(c => {
      const level = activityNoiseLevel[c.activity] || 0;
      if (level > maxNoise) { maxNoise = level; loudest = c.activity; }
    });
    return loudest;
  };

  const getOccupancyLevel = (roomId: string, day: string, timeSlot: string, capacity: number) => {
    const count = getStudentCheckinsForSlot(roomId, day, timeSlot).length;
    if (count === 0) return 'empty';
    return count <= capacity / 2 ? 'moderate' : 'full';
  };

  const getCurrentDayAndTimeSlot = () => {
    const now = new Date();
    const currentDay = days[now.getDay() - 1];
    const hour = now.getHours(); const min = now.getMinutes();
    for (const slot of defaultSchedulePattern) {
      const [sH, sM] = slot.start.split(':').map(Number);
      const [eH, eM] = slot.end.split(':').map(Number);
      if ((hour > sH || (hour === sH && min >= sM)) && (hour < eH || (hour === eH && min < eM))) {
        return { day: currentDay, timeSlot: `${slot.start}-${slot.end}` };
      }
    }
    return null;
  };

  const getUserClasses = (userId: string) => lectureModule.userTimetableEntries
    .filter(e => e.userId === userId)
    .map(e => lectureModule.classes.find(c => c.id === e.classId))
    .filter((c): c is Lecture => !!c);

  const getUserEvents = useCallback((userId: string) => {
    return lectureModule.userTimetableEntries
      .filter(e => e.userId === userId)
      .map(entry => {
        const parts = entry.classId.split('-');
        let event: Event | undefined;
        if (parts.length === 3) {
          const tIdx = parseInt(parts[0]); const eIdx = parseInt(parts[1]);
          if (lectureModule.timetables[tIdx]) event = lectureModule.timetables[tIdx].events[eIdx];
        }
        return { ...entry, event };
      });
  }, [lectureModule.userTimetableEntries, lectureModule.timetables]);

  const value = {
    ...roomModule,
    ...bookingModule,
    ...lectureModule,
    ...lecturerModule,
    getRoomSchedule,
    getRoomLectures,
    getRoomBookings,
    getStudentCheckinsForSlot,
    getLoudestActivity,
    getOccupancyLevel,
    getCurrentDayAndTimeSlot,
    getUserClasses,
    getUserEvents,
  };

  return <DataContext.Provider value={value as DataContextType}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
}