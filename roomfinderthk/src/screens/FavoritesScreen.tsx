import { useState } from "react";
import { BookmarkCheck } from "lucide-react";
import { RoomCard } from "@/components/RoomCard";
import { RoomTimetable } from "@/components/RoomTimetable";
import { RoomWithStatus } from "@/models";

interface FavoritesScreenProps {
  favoriteRooms: RoomWithStatus[];
}

export default function FavoritesScreen({ favoriteRooms }: FavoritesScreenProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomWithStatus | null>(null);

  if (selectedRoom) {
    return (
      <RoomTimetable
        roomId={selectedRoom.id}
        roomNumber={selectedRoom.roomNumber}
        floor={selectedRoom.floor}
        capacity={selectedRoom.capacity}
        hasBeamer={selectedRoom.hasBeamer}
        isAvailable={selectedRoom.isAvailable}
      />
    );
  }

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
    <div className="space-y-3">
      {favoriteRooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onClick={() => setSelectedRoom(room)}
        />
      ))}
    </div>
  );
}
