import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Room, Lecture, Event } from "@/models";
import { isSessionActiveNow } from '@/utils/isSessionActiveNow';
import { mockEvents, mockLectures, mockRooms } from '@/data/mockData';

interface DataContextType {
    rooms: Room[];
    lectures: Lecture[];
    events: Event[];
    isLoading: boolean;
    refreshStatus: () => void;
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
      
      setIsLoading(false);
    };

    loadData();

    //Aktualisiere den Status jede Minute
    const interval = setInterval(() => {
        
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DataContext.Provider value={{ 
      rooms,
      lectures,
      events,
      isLoading,
      refreshStatus: () => calculateCurrentStatus(mockRooms, mockLectures,mockEvents) 
    }}>
      {children}
    </DataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}