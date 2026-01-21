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

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (roomId: string) => void;
  removeFavorite: (roomId: string) => void;
  toggleFavorite: (roomId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites when user logs in
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    getFavoritesFromFirestore(user.id).then(setFavorites);
  }, [user]);

  const addFavorite = async (roomId: string) => {
    if (!user || favorites.includes(roomId)) return;

    setFavorites((prev) => [...prev, roomId]); // optimistic UI
    await addFavoriteToFirestore(user.id, roomId);
  };

  const removeFavorite = async (roomId: string) => {
    if (!user) return;

    setFavorites((prev) => prev.filter((id) => id !== roomId));
    await removeFavoriteFromFirestore(user.id, roomId);
  };

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

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
