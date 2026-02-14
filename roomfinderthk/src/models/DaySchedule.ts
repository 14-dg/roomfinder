import { TimeSlot } from "./TimeSlot";

/**
 * DaySchedule represents the full schedule for a specific day.
 * Contains all time slots for the day with availability and booking information.
 */
export interface DaySchedule {
    /** Day of the week (e.g., "Monday", "Tuesday") */
    day: string;
    /** Array of time slots for this day, each with availability info */
    slots: TimeSlot[];
}