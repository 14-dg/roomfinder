import { Event } from "@/models";

export const saveTimetable = (key: string, events: Event[]): void => {
  localStorage.setItem(key, JSON.stringify(events));
};

export const loadTimetable = (key: string): Event[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const clearTimetable = (key: string): void => {
  localStorage.removeItem(key);
};
