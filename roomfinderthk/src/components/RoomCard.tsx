import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import {
  Users,
  Projector,
  MapPin,
  Lock,
  Compass,
  Heart,
} from "lucide-react";
import { RoomWithStatus, Direction } from "@/models";
import { useFavorites } from "@/contexts/FavoritesContext";

interface RoomCardProps {
  room: RoomWithStatus;
  onClick?: () => void;
}

const getDirectionColor = (direction: Direction) => {
  switch (direction) {
    case 'north':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'south':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'east':
      return 'bg-red-100 text-red-700 border-red-300';
    case 'west':
      return 'bg-green-100 text-green-700 border-green-300';
  }
};

export function RoomCard({ room, onClick }: RoomCardProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(room.id);

  const handleFavoriteClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    toggleFavorite(room.id);
  };

  return (
    <Card
      onClick={onClick}
      className={`relative p-4 cursor-pointer transition-shadow hover:shadow-lg ${
        room.isLocked ? "opacity-75 bg-gray-50" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg">{room.roomNumber}</h3>
            {room.isLocked && <Lock className="w-4 h-4 text-red-600" />}
          </div>
          <div className="flex items-center gap-1 text-gray-600 mt-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Floor {room.floor}</span>
            {room.direction && (
              <>
                <span className="mx-1">•</span>
                <Compass className="w-4 h-4" />
                <span className={`text-xs px-2 py-0.5 rounded border capitalize ${getDirectionColor(room.direction)}`}>
                  {room.direction}
                </span>
              </>
            )}
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
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{room.occupiedSeats}/{room.capacity} seats</span>
        </div>
        {room.hasBeamer && (
          <div className="flex items-center gap-1">
            <Projector className="w-4 h-4" />
            <span>Beamer</span>
          </div>
        )}
      </div>

      {!room.isLocked && room.isAvailable && room.availableUntil && (
        <p className="text-xs text-green-600 mt-2">
            Available until {room.availableUntil}
          </p>
        )}

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