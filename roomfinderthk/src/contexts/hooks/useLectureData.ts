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

export function useLectureData() {
  const [classes, setClasses] = useState<Lecture[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [userTimetableEntries, setUserTimetableEntries] = useState<UserTimetableEntry[]>([]);

  const addLecture = async (lectureData: Omit<Lecture, 'id'>) => {
    const added = await addLectureService(lectureData);
    setClasses(prev => [...prev, added]);
    return added;
  };

  const removeLecture = async (id: string) => {
    await removeLectureService(id);
    setClasses(prev => prev.filter(l => l.id !== id));
  };

  const uploadTimetable = async (roomId: string, schedule: any[]) => {
    await uploadTimetableAsLectures(roomId, schedule);
    toast.success("Stundenplan importiert");
  };

  return { 
    classes, setClasses, timetables, setTimetables, modules, setModules, 
    userTimetableEntries, setUserTimetableEntries, addLecture, removeLecture, uploadTimetable 
  };
}