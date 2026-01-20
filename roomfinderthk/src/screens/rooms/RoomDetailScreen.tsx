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

/* ------------------------------ screen ------------------------------------ */

export default function RoomDetailScreen() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const {
    rooms,
    studentCheckins,
<<<<<<< HEAD
    //user,
=======

>>>>>>> 8b0624d (added user and changed RoomDetailScreen)
    getRoomSchedule,
    getLoudestActivity,
    getOccupancyLevel,
    getCurrentDayAndTimeSlot,
    updateRoom,
    addStudentCheckin,
    removeStudentCheckin,
  } = useData();

  if (!roomId) return <p className="text-center py-10">Invalid room</p>;

  const room = rooms.find((r) => r.id === roomId);
  if (!room) return <p className="text-center py-10">Room not found</p>;

  const schedule = getRoomSchedule(room.id);
  const currentSlot = getCurrentDayAndTimeSlot();

  // für checkin Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [duration, setDuration] = useState("60");
  const myCheckIn = studentCheckins.find(c => c.userId === User.id);
  const isCheckedInHere = myCheckIn?.roomId === roomId;

  /* --------------------------- handlers ----------------------------------- */

  const handleToggleLock = async () => {
    if (!room) return;
    await updateRoom(room.id, { isLocked: !room.isLocked });
    toast.success(!room.isLocked ? "Room marked as locked" : "Room marked as unlocked");
  };

  const handleToggleCheckin = async () => {


  };

  const handleToggleCheckin = () => {
    updateRoom(roomId, {});

<<<<<<< HEAD
  };

=======
>>>>>>> restore-work
  return (
    <>
      <ScreenHeader title="Room Details" subtitle={`Details for ${room.roomName}`} />
      <div className="space-y-4">
        {/* Room Header */}
        <Card className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2>{room.roomName}</h2>
                {room.isLocked && <Lock className="w-5 h-5 text-red-600" />}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Floor {room.floor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{room.capacity} seats</span>
                </div>
                {room.hasBeamer && (
                  <div className="flex items-center gap-1">
                    <Projector className="w-4 h-4" />
                    <span>Beamer</span>
                  </div>
                )}
              </div>
            </div>

            <Badge variant={room.isLocked ? "destructive" : room.isAvailable ? "default" : "secondary"}>
              {room.isLocked ? "Locked" : room.isAvailable ? "Available" : "Occupied"}
            </Badge>
          </div>

          {/* Lock Button */}
          <Button
            onClick={handleToggleLock}
            variant={room.isLocked ? "default" : "outline"}
            className="w-full"
          >
            {room.isLocked ? (
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
            variant={room.isLocked ? "default" : "outline"}
            className="w-full"
          >
            {room.isLocked ? (
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
                      room.capacity
                    )
                  )}`}
                >
                  {getOccupancyIcon(
                    getOccupancyLevel(
                      roomId,
                      currentSlot.day,
                      currentSlot.timeSlot,
                      room.capacity
                    )
                  )}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600">
                    {room.checkins}/{room.capacity} students
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

<<<<<<< HEAD
        {/* Legende */}
        <RoomDetailLegend/>
=======
        {/* Legend */}
        <div className="flex items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span>Student Activity</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-600">○○○</span>
            <span>Empty</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-300">●○○</span>
            <span>Minimal</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-600">●●○</span>
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-600">●●●</span>
            <span>Full</span>
          </div>
        </div>
>>>>>>> restore-work

        {/* Weekly Schedule */}
        {/*<RoomWeeklySchedule></RoomWeeklySchedule>*/}

        {/* Check In Dialog */}
<<<<<<< HEAD
=======
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Check In to {roomName}</DialogTitle>
              <DialogDescription>
                Let others know you're using this room. Multiple students can check in simultaneously.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration" className="h-12">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30min">30 minutes</SelectItem>
                    <SelectItem value="1hour">1 hour</SelectItem>
                    <SelectItem value="2hours">2 hours</SelectItem>
                    <SelectItem value="3hours">3 hours</SelectItem>
                    <SelectItem value="4hours">4+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Activity */}
              <div className="space-y-2">
                <Label htmlFor="activity">Activity</Label>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger id="activity" className="h-12">
                    <SelectValue placeholder="Select activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quiet Study">📚 Quiet Study</SelectItem>
                    <SelectItem value="Reading">📖 Reading</SelectItem>
                    <SelectItem value="Exam Preparation">✏️ Exam Preparation</SelectItem>
                    <SelectItem value="Presentation Prep">🎤 Presentation Prep</SelectItem>
                    <SelectItem value="Project Work">💻 Project Work</SelectItem>
                    <SelectItem value="Online Meeting">💬 Online Meeting</SelectItem>
                    <SelectItem value="Group Discussion">👥 Group Discussion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCheckIn}
                className="w-full h-12"
                disabled={!selectedSlot || !activity}
              >
                Confirm Check In
              </Button>
            </div>
          </DialogContent>
        </Dialog>
>>>>>>> restore-work
      </div>
    </>
  );
}
