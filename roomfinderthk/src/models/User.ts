/**
 * User interface represents a registered user in the system.
 * Can be a student, professor, or administrator with different permissions.
 */
export default interface User {
  /** Unique identifier (Firebase UID) */
  id: string;
  /** Email address for authentication and communication */
  email: string;
  /** Display name of the user */
  name: string;
  /** User's role determining their permissions and features */
  role: 'student' | 'professor' | 'admin';

  /** Array of favorite room IDs saved by the user */
  favourites: string[];
  /** Array of course/class IDs in the user's personal timetable */
  timetable: string[];

  /** Optional: Department name (for professors) */
  department?: string;
  /** Optional: Office hours in time format (for professors) */
  officeHours?: string;
  /** Optional: Office location/room number (for professors) */
  officeLocation?: string;
  /** Optional: Array of lecture IDs taught by this professor */
  lectures?: string[];
}