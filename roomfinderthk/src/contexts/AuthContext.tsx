import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase-config";
import { logoutUser } from "@/services/firebase";

/**
 * AppUser interface represents an authenticated user in the application.
 * Contains essential user information needed for the app to function.
 */
export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin';
};

/**
 * AuthContextType defines the shape of data and operations provided by AuthContext.
 */
interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  authReady: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component that manages user authentication state.
 * Listens to Firebase auth state changes and fetches user profile from Firestore.
 * 
 * @param children - React components to wrap with authentication context
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  /**
   * Logs out the current user from Firebase authentication.
   */
  const logout = async () => {
    logoutUser();
  };

  /**
   * Effect hook that listens to Firebase authentication state changes.
   * When user logs in, fetches their profile data from Firestore.
   * When user logs out, clears the user state.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile data from Firestore
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email ?? "",
            name: data.name,
            role: data.role,
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authReady,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context from any component.
 * Provides current user information and authentication status.
 * 
 * @returns AuthContextType containing user data and authentication operations
 * @throws Error if used outside of AuthProvider
 */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
