import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Users,
  Projector,
  MapPin,
  Clock,
  Lock,
  Unlock,
  Compass,
  LogOut,
  DoorOpen,
} from "lucide-react";
import ScreenHeader from "@/components/ScreenHeader";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { getOccupancyColor, getOccupancyIcon } from "@/utils/occupancy";
import { RoomDetailLegend } from "./RoomDetailLegend";
import { RoomWeeklySchedule } from "./RoomWeeklySchedule";

/* ------------------------------ screen ------------------------------------ */

export default function RoomDetailScreen() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const {
    rooms,
    studentCheckins,

    getRoomSchedule,
    addStudentCheckin,
    getStudentCheckinsForSlot,
    getLoudestActivity,
    getOccupancyLevel,
    getCurrentDayAndTimeSlot,
    updateRoom,
  } = useData();

  const { user } = useAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    day: string;
    start: string;
    end: string;
  } | null>(null);
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("2h");

  if (!roomId) return <p className="text-center py-10">Invalid room</p>;

  const room = rooms.find((r) => r.id === roomId);
  if (!room) return <p className="text-center py-10">Room not found</p>;

  const {
    roomName,
    floor,
    capacity,
    hasBeamer,
    isAvailable,
    isLocked = false,
  } = room;

  const schedule = getRoomSchedule(roomId);
  const currentSlot = getCurrentDayAndTimeSlot();

  /* --------------------------- handlers ----------------------------------- */

  const handleToggleLock = () => {
    updateRoom(roomId, { isLocked: !isLocked });
    toast.success(!isLocked ? "Room marked as locked" : "Room unlocked");
  };

  const handleToggleCheckin = () => {
    updateRoom(roomId, {});

  };

  return (
    <>
      <ScreenHeader title="Room Details" subtitle={`Details for ${roomName}`} />
      <div className="space-y-4">
        {/* Room Header */}
        <Card className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2>{roomName}</h2>
                {isLocked && <Lock className="w-5 h-5 text-red-600" />}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Floor {floor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{capacity} seats</span>
                </div>
                {hasBeamer && (
                  <div className="flex items-center gap-1">
                    <Projector className="w-4 h-4" />
                    <span>Beamer</span>
                  </div>
                )}
              </div>
            </div>

            <Badge variant={isLocked ? "destructive" : isAvailable ? "default" : "secondary"}>
              {isLocked ? "Locked" : isAvailable ? "Available" : "Occupied"}
            </Badge>
          </div>

          {/* Lock Button */}
          <Button
            onClick={handleToggleLock}
            variant={isLocked ? "default" : "outline"}
            className="w-full"
          >
            {isLocked ? (
              <>
                <Unlock className="w-4 h-4 mr-2" />
                Mark as unlocked
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Mark as locked
              </>
            )}
          </Button>

          {/* Checkin Button */}
          <Button
            onClick={handleToggleCheckin}
            variant={isLocked ? "default" : "outline"}
            className="w-full"
          >
            {isLocked ? (
              <>
                <Unlock className="w-4 h-4 mr-2" />
                Check Out
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Check In
              </>
            )}
          </Button>

          <Button onClick={() => navigate(-1)} variant="ghost" className="w-full mt-2">
            Back
          </Button>
        </Card>

        {/* Current Status */}
        {currentSlot && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-blue-900">Current Status</h3>
            </div>
            <div className="flex items-center justify-between p-3 rounded border bg-white">
              <div>
                <span className="text-sm">Now ({currentSlot.timeSlot})</span>
                <span
                  className={`ml-2 text-xs ${getOccupancyColor(
                    getOccupancyLevel(
                      roomId,
                      currentSlot.day,
                      currentSlot.timeSlot,
                      capacity
                    )
                  )}`}
                >
                  {getOccupancyIcon(
                    getOccupancyLevel(
                      roomId,
                      currentSlot.day,
                      currentSlot.timeSlot,
                      capacity
                    )
                  )}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600">
                    {getStudentCheckinsForSlot(roomId, currentSlot.day, currentSlot.timeSlot).length}/{capacity} students
                  </span>
                </div>
              </div>
              <div>
                <Badge variant={getLoudestActivity(roomId, currentSlot.day, currentSlot.timeSlot) ? "secondary" : "default"}>
                  {getLoudestActivity(roomId, currentSlot.day, currentSlot.timeSlot) || "Available"}
                </Badge>
              </div>
            </div>
          </Card>
        )}

        {/* Legende */}
        <RoomDetailLegend/>

        {/* Weekly Schedule */}
        {/*<RoomWeeklySchedule></RoomWeeklySchedule>*/}

        {/* Check In Dialog */}
      </div>
    </>
  );
}
