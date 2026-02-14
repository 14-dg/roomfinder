/**
 * UserTimetableEntry represents a user's enrollment in a course or event.
 * Links a user to a specific class/event in their personal timetable.
 */
export interface UserTimetableEntry {
  /** Unique identifier for this timetable entry */
  id: string;
  /** ID of the class or event this entry refers to */
  classId: string;
  /** ID of the user enrolled in this class */
  userId: string;
}