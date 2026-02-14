import { useState, useCallback } from 'react';
import { Lecture, Timetable, Module, UserTimetableEntry } from '@/models';
import { 
  addLecture as addLectureService, 
  removeLecture as removeLectureService,
  saveTimetableFire, 
  saveModulesFire,
  uploadTimetableAsLectures 
} from "@/services/firebase";
import { toast } from 'sonner';

/**
 * Custom hook for managing lectures, timetables, and user course registrations.
 * Handles CRUD operations for course data and bulk timetable operations.
 * 
 * @returns Object containing lecture data and operations
 */
export function useLectureData() {
  const [classes, setClasses] = useState<Lecture[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [userTimetableEntries, setUserTimetableEntries] = useState<UserTimetableEntry[]>([]);

  /**
   * Adds a new lecture/course to the system.
   * 
   * @param lectureData - Lecture data to add (without ID)
   * @returns The created lecture object with generated ID
   */
  const addLecture = async (lectureData: Omit<Lecture, 'id'>) => {
    const added = await addLectureService(lectureData);
    setClasses(prev => [...prev, added]);
    return added;
  };

  /**
   * Removes a lecture/course from the system.
   * 
   * @param id - ID of the lecture to remove
   */
  const removeLecture = async (id: string) => {
    await removeLectureService(id);
    setClasses(prev => prev.filter(l => l.id !== id));
  };

  /**
   * Bulk imports a room schedule as lectures.
   * Converts a day-based schedule into individual lecture entries.
   * 
   * @param roomId - ID of the room to assign lectures to
   * @param schedule - Array of day schedules with time slots
   */
  const uploadTimetable = async (roomId: string, schedule: any[]) => {
    await uploadTimetableAsLectures(roomId, schedule);
    toast.success("Stundenplan importiert");
  };

  return { 
    classes, setClasses, timetables, setTimetables, modules, setModules, 
    userTimetableEntries, setUserTimetableEntries, addLecture, removeLecture, uploadTimetable 
  };
}