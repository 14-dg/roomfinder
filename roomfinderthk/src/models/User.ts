export default interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'professor' | 'admin';

  favourites: string[];
  timetable: string[];

  // Additional fields for professors
  department?: string;
  officeHours?: string;
  officeLocation?: string;
  lectures?: string[];
}