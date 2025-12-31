export type RoomCategory = 'Seminarraum' | 'PC-Pool' | 'Hörsaal' | 'Labor' | 'Offener Bereich';

export interface Room {
    id: string;
    floor: number;
    building: string;
    roomType: RoomCategory;
    checkIns: number;
    label: string;
    isOccupiedByLecture: boolean;
    currentLectureName?: string;
}