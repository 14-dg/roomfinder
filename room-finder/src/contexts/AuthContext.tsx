import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AppStateUser } from '@/models';
import { signInWithFirebase } from '@/services/auth.service';

interface AuthContextType {
  user: AppStateUser;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppStateUser>(null);

  const login = async (email: string, pass: string) => {
    try {
      // 1. Rufe den Service auf (Backend-Anfrage)
      const userData = await signInWithFirebase(email, pass);
      // 2. Speichere das Ergebnis im globalen State
      setUser(userData as any); 
    } catch (error) {
      console.error("Login fehlgeschlagen", error);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth muss innerhalb eines AuthProviders verwendet werden");
  return context;
};