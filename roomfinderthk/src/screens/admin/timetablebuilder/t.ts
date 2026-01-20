import { Timetable, Module, Lecturer, Room } from '@/models';
import { timeSlots, dayTimes, initialDays, typeOptions } from './constants';

// firebase weil localstorage
export const saveTimetable = (key: string, timetable: Timetable): void => {
  localStorage.setItem(key, JSON.stringify(timetable));
};

// firebase kann auch weniger logik sein habibi
export const loadTimetable = (key: string): Timetable | null => {
  const data = localStorage.getItem(key);
  if (!data) return null;
  const parsedData = JSON.parse(data);
  return {
    ...parsedData,
    events: parsedData.events || []
  };
};

export const createTimetable = (
  courseOfStudy: string,
  semester: string,
  year: number,
  includeSaturday: boolean = false
): Timetable => ({
  courseOfStudy,
  semester,
  year,
  days: includeSaturday ? [...initialDays, 'Saturday'] : initialDays,
  events: []
});

// firebase getLecturers()
export const loadLecturers = (): Lecturer[] => {
  const data = localStorage.getItem('lecturers');
  return data ? JSON.parse(data) : [];
};

// firebase getRooms()
export const loadRooms = (): Room[] => {
  const data = localStorage.getItem('rooms');
  return data ? JSON.parse(data) : [];
};

// firebase wie addRoom
export const saveModules = (modules: Module[]): void => {
  localStorage.setItem('modules', JSON.stringify(modules));
};

// firebase wie get irgendwas
export const loadModules = (): Module[] => {
  const data = localStorage.getItem('modules');
  return data ? JSON.parse(data) : [];
};
