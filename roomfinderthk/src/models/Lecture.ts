export type LectureType = 'Vorlesung' | 'Uebung' | 'Praktikum' | 'Tutorium';

export interface Lecture {
    id: string;
    name: string;
    type: LectureType;
    subject: string;
    professor: string;
    roomId: string;
    day: string;
    startTime: string;
    endTime: string;
    startDate?: string;
    endDate?: string;
}