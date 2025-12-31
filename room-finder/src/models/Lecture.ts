export interface LectureSession {
  dayOfWeek: number; 
  startTime: string; 
  endTime: string; 
  startDate: string; 
  endDate: string;
}

export interface Lecture {
  id: string;
  name: string;
  abbreviation: string;
  professor: string;
  roomId: string;

  schedule: LectureSession[];
}