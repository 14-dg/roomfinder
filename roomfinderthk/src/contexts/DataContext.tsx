import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { 
  RoomWithStatus, Booking, Lecture, CheckIn, UserTimetableEntry, 
  DaySchedule, Timetable, Module, Event 
} from '@/models';
import { defaultSchedulePattern, days } from "../mockData/mockData";
import * as fb from "@/services/firebase";
import { toast } from 'sonner';

// Import data management hooks that handle specific business domains
import { useRoomData } from './hooks/useRoomData';
import { useBookingData } from './hooks/useBookingData';
import { useLectureData } from './hooks/useLectureData';
import { useLecturerData } from './hooks/useLecturerData';

/**
 * Maps activity types to noise level scores.
 * Used to determine the loudest activity in a room during a time slot.
 * Scale: 1 (silent) to 5 (very loud)
 */
const activityNoiseLevel: Record<string, number> = {
  'Quiet Study': 1, 'Reading': 1, 'Exam Preparation': 2,
  'Presentation Prep': 3, 'Project Work': 3, 'Online Meeting': 4, 'Group Discussion': 5,
};

/**
 * DataContextType interface defines all data and operations available
 * through the global DataContext. Includes state, selectors, and actions.
 */
interface DataContextType {
  // States - Current data loaded from database
  rooms: RoomWithStatus[];
  bookings: Booking[];
  studentCheckins: CheckIn[];
  classes: Lecture[];
  lecturers: any[];
  userTimetableEntries: UserTimetableEntry[];
  timetables: Timetable[];
  modules: Module[];

  // Selectors & Helper functions - Read-only data transformations
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

  // Actions - Async operations that modify data
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

/**
 * DataProvider component that wraps the application and provides global data access.
 * Initializes all data hooks, fetches initial data from Firebase, and exposes
 * selectors and actions through the DataContext.
 * 
 * @param children - React components to wrap with data context
 */
export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize individual data management modules
  const lectureModule = useLectureData();
  const roomModule = useRoomData(lectureModule.classes, []); 
  const lecturerModule = useLecturerData(lectureModule.classes);
  const bookingModule = useBookingData(roomModule.rooms, roomModule.refreshRooms);

  // Fetch all initial data from Firebase on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [r, b, s, c, l, t, m, u] = await Promise.all([
          fb.getAllRooms(), fb.getAllBookings(), fb.getAllStudentCheckins(),
          fb.getAllLectures(), fb.getLecturers(), fb.loadTimetables(),
          fb.loadModules(), fb.getAllUserTimetableEntries()
        ]);
        // Distribute loaded data to respective modules
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

  // Selector: Get all lectures scheduled in a specific room
  const getRoomLectures = useCallback((roomId: string) => 
    lectureModule.classes.filter(l => l.roomId === roomId), [lectureModule.classes]);

  // Selector: Get all bookings for a specific room
  const getRoomBookings = useCallback((roomId: string) => 
    bookingModule.bookings.filter(b => b.roomId === roomId), [bookingModule.bookings]);

  /**
   * Selector: Get complete schedule for a room across all days and time slots.
   * Combines lecture and booking information into a unified schedule view.
   */
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

  // Helper: Get all student check-ins for a specific room and time slot
  const getStudentCheckinsForSlot = (roomId: string, day: string, timeSlot: string) => 
    bookingModule.studentCheckins.filter(c => c.roomId === roomId && c.day === day && c.timeSlot === timeSlot);

  /**
   * Selector: Find the loudest activity happening in a room during a time slot.
   * Based on noise levels defined in activityNoiseLevel map.
   */
  const getLoudestActivity = (roomId: string, day: string, timeSlot: string) => {
    const checkins = getStudentCheckinsForSlot(roomId, day, timeSlot);
    let loudest = ''; let maxNoise = 0;
    checkins.forEach(c => {
      const level = activityNoiseLevel[c.activity] || 0;
      if (level > maxNoise) { maxNoise = level; loudest = c.activity; }
    });
    return loudest;
  };

  /**
   * Selector: Determine occupancy level of a room at a specific time.
   * Returns 'empty', 'moderate', or 'full' based on check-in count vs capacity.
   */
  const getOccupancyLevel = (roomId: string, day: string, timeSlot: string, capacity: number) => {
    const count = getStudentCheckinsForSlot(roomId, day, timeSlot).length;
    if (count === 0) return 'empty';
    return count <= capacity / 2 ? 'moderate' : 'full';
  };

  /**
   * Selector: Get current day of week and current time slot if applicable.
   * Returns null if current time doesn't fall within any scheduled slot.
   */
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

  // Selector: Get all lectures assigned to a specific user
  const getUserClasses = (userId: string) => lectureModule.userTimetableEntries
    .filter(e => e.userId === userId)
    .map(e => lectureModule.classes.find(c => c.id === e.classId))
    .filter((c): c is Lecture => !!c);

  /**
   * Selector: Get all events in a user's timetable with associated event details.
   * Parses class IDs to locate events in the timetables array.
   */
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

  // Assemble all data and selectors into context value
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

/**
 * Hook to access the global DataContext from any component.
 * Must be used within a component wrapped by DataProvider.
 * 
 * @returns DataContextType containing all global data and operations
 * @throws Error if used outside of DataProvider
 */
export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
}