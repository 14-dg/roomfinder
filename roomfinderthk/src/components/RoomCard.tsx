import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Users, Projector, MapPin, Lock, Compass } from "lucide-react";

interface RoomCardProps {
  roomNumber: string;
  floor: number;
  capacity: number;
  occupiedSeats?: number;
  hasBeamer: boolean;
  isAvailable: boolean;
  isLocked: boolean;
  direction?: 'north' | 'south' | 'east' | 'west';
  availableUntil?: string;
  onClick?: () => void;
}

const getDirectionColor = (direction: 'north' | 'south' | 'east' | 'west') => {
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

export function RoomCard({
  roomNumber,
  floor,
  capacity,
  occupiedSeats = 0,
  hasBeamer,
  isAvailable,
  isLocked,
  direction,
  availableUntil,
  onClick,
}: RoomCardProps) {
  return (
    <Card 
      className={`p-4 hover:shadow-lg transition-shadow cursor-pointer active:scale-98 ${
        isLocked ? 'opacity-75 bg-gray-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg">{roomNumber}</h3>
            {isLocked && (
              <Lock className="w-4 h-4 text-red-600" />
            )}
          </div>
          <div className="flex items-center gap-1 text-gray-600 mt-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Floor {floor}</span>
            {direction && (
              <>
                <span className="mx-1">•</span>
                <Compass className="w-4 h-4" />
                <span className={`text-xs px-2 py-0.5 rounded border capitalize ${getDirectionColor(direction)}`}>
                  {direction}
                </span>
              </>
            )}
          </div>
        </div>
        {isLocked ? (
          <Badge variant="destructive">Locked</Badge>
        ) : (
          <Badge variant={isAvailable ? "default" : "secondary"}>
            {isAvailable ? "Available" : "Occupied"}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{occupiedSeats}/{capacity} seats</span>
        </div>
        {hasBeamer && (
          <div className="flex items-center gap-1">
            <Projector className="w-4 h-4" />
            <span>Beamer</span>
          </div>
        )}
      </div>

      {!isLocked && isAvailable && availableUntil && (
        <p className="text-xs text-green-600 mt-2">
          Available until {availableUntil}
        </p>
      )}
      
      {isLocked && (
        <p className="text-xs text-red-600 mt-2">
          Room is currently locked/closed
        </p>
      )}
    </Card>
  );
}