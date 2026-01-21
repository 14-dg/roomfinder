export type LectureType = 'Vorlesung' | 'Uebung' | 'Praktikum' | 'Tutorium' | 'Seminar' | 'Other' | 'Anderes';

export interface Lecture {
    id: string;
    name: string;
    type: LectureType;
    subject?: string;
    professor: string;
    roomId: string;
    day: string;
    startTime: string;  // HH:MM
    endTime: string;    // HH:MM
    startDate?: string;
    endDate?: string;
}