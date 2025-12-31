export interface EventSession {
  dayOfWeek: number; 
  startTime: string; 
  endTime: string; 
  date: string;
}

export interface Event {
  id: string;
  bezeichnung: string;
  professor: string;
  roomId: string;

  schedule: EventSession[];
}