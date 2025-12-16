import { TimeSlot } from "./TimeSlot";

export interface DaySchedule {
    day: string;
    slots: TimeSlot[];
}