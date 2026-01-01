import { BookmarkCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RoomCard } from "@/components/RoomCard";
import ScreenHeader from "@/components/ScreenHeader";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useData } from "@/contexts/DataContext"; // um Rooms-Daten zu bekommen

export default function FavoritesScreen() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { rooms } = useData();

  // alle Favoriten-Rooms mit Status
  const favoriteRooms = rooms.filter((room) => favorites.includes(room.id));

  if (favoriteRooms.length === 0) {
    return (
      <div className="text-center py-16">
        <BookmarkCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No favorite rooms yet</p>
        <p className="text-sm text-gray-400 mt-2">
          Start adding rooms to your favorites
        </p>
      </div>
    );
  }

  return (
    <>
      <ScreenHeader title="Favorite Rooms" subtitle="Your saved favorite rooms" />
      <div className="space-y-3">
        {favoriteRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onClick={() => navigate(`/favorites/rooms/${room.id}`)}
          />
        ))}
      </div>
    </>
  );
}
