import type { AppStateUser, UserRole } from '@/models';

/**
 * MOCK LOGIN SERVICE
 * Simuliert einen API-Aufruf (Login).
 * * Studenten haben keinen Login -> daher nur 'professor' oder 'admin'.
 */
export const signInWithFirebase = async (role: UserRole): Promise<AppStateUser> => {
  
  // 1. Simuliere Netzwerk-Ladezeit (damit man den Lade-Spinner sieht)
  await new Promise(resolve => setTimeout(resolve, 800));

  // 2. Mock-User zurückgeben basierend auf der Rolle
  if (role === 'professor') {
    // Professor hat laut deinem Interface einen 'name'
    return {
      id: 'prof_1',
      name: 'Prof. Dr. Muster',
      email: 'muster@th-koeln.de',
      role: 'professor'
    };
  } 
  
  if (role === 'admin') {
    // Admin hat laut deinem Interface KEINEN Namen, nur Email/ID
    return {
      id: 'admin_1',
      email: 'admin@th-koeln.de',
      role: 'admin'
    };
  }

  // Sollte eigentlich nicht passieren, da TypeScript 'student' hier verbietet
  throw new Error("Login für diese Rolle nicht erlaubt.");
};

/**
 * MOCK LOGOUT
 */
export const signOutUser = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Hier würde später der Firebase Logout stehen
    return;
};