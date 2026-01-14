import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Room, Lecture, Event } from "@/models";
import { isSessionActiveNow } from '@/utils/isSessionActiveNow';
import { mockLectures, mockRooms } from '@/data/mockData';

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

  const calculateCurrentStatus = (currentRooms: Room[], currentLectures: Lecture[]) => {
    const now = new Date();
    
    const updatedRooms = currentRooms.map((room) => {

      const roomLectures = currentLectures.filter((lecture) => lecture.roomId === room.id);
      
      const activeLecture = roomLectures.find((lecture) => 
        lecture.schedule.some(session => isSessionActiveNow(session, now))
      );

      if (activeLecture) {
        return {
          ...room,
          isOccupiedByLecture: true,
          currentLectureName: activeLecture.name,
        };
      } else {
        return {
          ...room,
          isOccupiedByLecture: false,
          currentLectureName: undefined,
        };
      }
    });

    setRooms(updatedRooms);
  };

  // Initiales Laden
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Simuliere Netzwerk-Verzögerung
      await new Promise(r => setTimeout(r, 200));

      setLectures(mockLectures);
      
      calculateCurrentStatus(mockRooms, mockLectures);
      
      setIsLoading(false);
    };

    loadData();

    //Aktualisiere den Status jede Minute
    const interval = setInterval(() => {
        calculateCurrentStatus(mockRooms, mockLectures);
    }, 60000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <DataContext.Provider value={{ 
      rooms,
      lectures,
      events,
      isLoading,
      refreshStatus: () => calculateCurrentStatus(mockRooms, mockLectures) 
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