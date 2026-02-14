import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getFavoritesFromFirestore,
  addFavoriteToFirestore,
  removeFavoriteFromFirestore,
} from "@/services/firebase";

/**
 * FavoritesContextType defines operations for managing a user's favorite rooms.
 */
interface FavoritesContextType {
  favorites: string[];
  addFavorite: (roomId: string) => void;
  removeFavorite: (roomId: string) => void;
  toggleFavorite: (roomId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

/**
 * FavoritesProvider component that manages user's favorite rooms.
 * Loads favorites from Firestore when user logs in and persists changes.
 * 
 * @param children - React components to wrap with favorites context
 */
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  /**
   * Effect hook that loads user's favorite rooms from Firestore
   * when they log in, and clears favorites when they log out.
   */
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    getFavoritesFromFirestore(user.id).then(setFavorites);
  }, [user]);

  /**
   * Adds a room to the user's favorites.
   * Updates local state immediately for responsive UI, then persists to Firestore.
   * 
   * @param roomId - ID of the room to add to favorites
   */
  const addFavorite = async (roomId: string) => {
    if (!user || favorites.includes(roomId)) return;

    setFavorites((prev) => [...prev, roomId]); // Optimistic UI update
    await addFavoriteToFirestore(user.id, roomId);
  };

  /**
   * Removes a room from the user's favorites.
   * Updates local state immediately, then persists change to Firestore.
   * 
   * @param roomId - ID of the room to remove from favorites
   */
  const removeFavorite = async (roomId: string) => {
    if (!user) return;

    setFavorites((prev) => prev.filter((id) => id !== roomId));
    await removeFavoriteFromFirestore(user.id, roomId);
  };

  /**
   * Toggles a room's favorite status.
   * Adds to favorites if not already favorited, removes if already favorited.
   * 
   * @param roomId - ID of the room to toggle
   */
  const toggleFavorite = (roomId: string) => {
    favorites.includes(roomId)
      ? removeFavorite(roomId)
      : addFavorite(roomId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

/**
 * Hook to access favorites context from any component.
 * Provides access to user's favorite rooms and operations to manage them.
 * 
 * @returns FavoritesContextType containing favorites list and management functions
 * @throws Error if used outside of FavoritesProvider
 */
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
