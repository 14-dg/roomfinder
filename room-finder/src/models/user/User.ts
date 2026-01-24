export type UserRole = 'professor' | 'admin';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface ProfessorUser extends AuthenticatedUser {
  role: 'professor';
  name: string;
}

export interface AdminUser extends AuthenticatedUser {
  role: 'admin';
}

export type AppStateUser = ProfessorUser | AdminUser | null;