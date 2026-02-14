/**
 * Event interface represents a scheduled event in the timetable builder.
 * Used for creating and managing custom events with full scheduling details.
 * 
 * Used in: src/screens/admin/timetablebuilder/TimetableBuilder.tsx
 * Example: Friday, 13:15, SYP Lecture (MS4)
 */
export interface Event {
    /** Optional unique identifier for the event */
    id?: number;
    /** Day of the week (e.g., "Friday") */
    day: string;
    /** Start time in HH:MM format */
    startTime: string;
    /** End time in HH:MM format */
    endTime: string;
    /** Event name or title */
    name: string;
    /** Name of the lecturer teaching this event */
    lecturer: string;
    /** Room number or location */
    room: string;
    /** Module code or identifier (e.g., "SYP") */
    module: string;
    /** Type of event (e.g., "Lecture", "Exercise", "Lab") */
    typeOf: string;
    /** Duration in minutes */
    duration: number;
    /** Column position in the timetable grid layout */
    column: number;
}