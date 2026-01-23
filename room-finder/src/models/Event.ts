export interface EventSession {
  dayOfWeek: number; 
  startTime: string; 
  endTime: string; 
  date: string;
}

export interface Event {
  id: string;
  designation: string;
  professor: string;
  roomId: string;

  schedule: EventSession[];
}