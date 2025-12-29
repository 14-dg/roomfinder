// src/contexts/FavoritesContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext"; // optional, falls Favoriten pro User gespeichert werden sollen
import { getFavoritesFromFirestore, saveFavoritesToFirestore } from "@/services/firebase"; // Platzhalter für Firestore-Integration

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (roomId: string) => void;
  removeFavorite: (roomId: string) => void;
  toggleFavorite: (roomId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  // optional: lade Favoriten aus Firestore, wenn user angemeldet
  useEffect(() => {
    if (!user) return;
    getFavoritesFromFirestore(user.uid).then((favs) => {
      setFavorites(favs);
    });
  }, [user]);

  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    if (user) saveFavoritesToFirestore(user.uid, newFavorites);
  };

  const addFavorite = (roomId: string) => {
    if (!favorites.includes(roomId)) {
      saveFavorites([...favorites, roomId]);
    }
  };

  const removeFavorite = (roomId: string) => {
    saveFavorites(favorites.filter((id) => id !== roomId));
  };

  const toggleFavorite = (roomId: string) => {
    if (favorites.includes(roomId)) removeFavorite(roomId);
    else addFavorite(roomId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite }}>
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
