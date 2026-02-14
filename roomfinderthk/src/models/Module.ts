/**
 * Module interface represents an academic module or course grouping.
 * Used for organizing events in the timetable builder.
 * 
 * Used in: src/screens/admin/timetablebuilder/TimetableBuilder.tsx
 * Example: "Systems Design Practical - SYP"
 */
export interface Module {
    /** Optional unique identifier for the module */
    id?: number;
    /** Name or title of the module (e.g., "Systementwurfs Praktikum - SYP") */
    name: string;
}