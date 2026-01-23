import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Room, Lecture, Event } from "@/models";
import { mockEvents, mockLectures, mockRooms } from '@/data/mockData';

interface DataContextType {
    rooms: Room[];
    lectures: Lecture[];
    events: Event[];
    isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  // Initiales Laden
  useEffect(() => {
    const loadData = async () => {
      
      setIsLoading(true);

      setLectures(mockLectures);

      setEvents(mockEvents);

      setRooms(mockRooms);

      
      
      setIsLoading(false);
    };

    loadData();
  }, []);

}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}