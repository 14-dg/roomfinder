export default interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'professor' | 'admin';

  favourites: string[];
  timetable: string[];
}
