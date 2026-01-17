import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import {
  MoveVertical,
  Projector,
  Lock,
  Heart,
} from "lucide-react";
import { RoomWithStatus } from "@/models";
import { useFavorites } from "@/contexts/FavoritesContext";

interface RoomCardProps {
  room: RoomWithStatus;
  onClick?: () => void;
}

export function RoomCard({ room, onClick }: RoomCardProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(room.id);

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleFavorite(room.id);
  };

  return (
    <Card
      onClick={onClick}
      className={`relative p-4 cursor-pointer transition-shadow hover:shadow-lg ${room.isLocked ? "opacity-75 bg-gray-50" : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg">{room.roomName}</h3>
            {room.isLocked && <Lock className="w-4 h-4 text-red-600" />}
          </div>
          <div className="flex items-center gap-1 text-gray-600 mt-1">
            <MoveVertical className="w-4 h-4" />
            <span className="text-sm">Floor {room.floor}</span>
          </div>
        </div>
        {room.isLocked ? (
          <Badge variant="destructive">Locked</Badge>
        ) : (
          <Badge variant={room.isAvailable ? "default" : "secondary"}>
            {room.isAvailable ? "Available" : "Occupied"}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
        {room.hasBeamer && (
          <div className="flex items-center gap-1">
            <Projector className="w-4 h-4" />
            <span>Beamer</span>
          </div>
        )}
      </div>

      {room.isLocked && (
        <p className="text-xs text-red-600 mt-2">
          Room is currently locked/closed
        </p>
      )}

      <button
        aria-label="Toggle favorite"
        onClick={handleFavoriteClick}
        className="
          absolute bottom-0 right-0
          w-16 h-16
          flex items-center justify-center
          rounded-full
          hover:bg-gray-100
          z-20
        "
      >
        <Heart
          className={`size-6 ${
            isFavorite
              ? "fill-red-600 text-red-600"
              : "text-gray-400"
          }`}
        />
      </button>
    </Card>
  );
}