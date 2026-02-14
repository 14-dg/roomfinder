/**
 * TimeSlot represents a single hour or time period in a daily schedule.
 * Contains booking and occupancy information for that time slot.
 */
export interface TimeSlot {
    /** Start time in HH:MM format (e.g., "08:00") */
    start: string;
    /** End time in HH:MM format (e.g., "09:00") */
    end: string;
    /** Subject or course name occupying this slot */
    subject: string;
    /** Room or location for this time slot */
    room: string;
}