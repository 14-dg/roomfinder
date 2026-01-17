import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Users,
  Projector,
  MapPin,
  Clock,
  Lock,
  Unlock,
  Compass,
} from "lucide-react";
import ScreenHeader from "@/components/ScreenHeader";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

/* -------------------------------- helpers -------------------------------- */

const getDirectionColor = (direction: "north" | "south" | "east" | "west") => {
  switch (direction) {
    case "north":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "south":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "east":
      return "bg-red-100 text-red-700 border-red-300";
    case "west":
      return "bg-green-100 text-green-700 border-green-300";
  }
};

const getOccupancyColor = (level: "empty" | "moderate" | "full") => {
  switch (level) {
    case "empty":
      return "text-green-600";
    case "moderate":
      return "text-yellow-600";
    case "full":
      return "text-red-600";
  }
};

const getOccupancyIcon = (level: "empty" | "moderate" | "full") => {
  switch (level) {
    case "empty":
      return "●○○";
    case "moderate":
      return "●●○";
    case "full":
      return "●●●";
  }
};

/* ------------------------------ screen ------------------------------------ */

export default function RoomDetailScreen() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const {
    rooms,
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

  const handleSlotClick = (
    day: string,
    slot: { start: string; end: string; isBooked: boolean }
  ) => {
    if (isLocked) {
      toast.error("This room is currently locked");
      return;
    }

    if (slot.isBooked) return;

    if (user?.role === "student") {
      setSelectedSlot({ day, start: slot.start, end: slot.end });
      setIsDialogOpen(true);
    }
  };

  const handleCheckIn = () => {
    if (!selectedSlot || !activity || !user) return;

    addStudentCheckin({
      roomId,
      day: selectedSlot.day,
      timeSlot: `${selectedSlot.start}-${selectedSlot.end}`,
      studentId: user.id,
      studentName: user.name,
      activity,
      //TODO duration,
    });

    toast.success("Successfully checked in!");
    setIsDialogOpen(false);
    setActivity("");
    setDuration("2h");
    setSelectedSlot(null);
  };

  const handleToggleLock = () => {
    updateRoom(roomId, { isLocked: !isLocked });
    toast.success(!isLocked ? "Room marked as locked" : "Room unlocked");
  };

  /* ------------------------------ UI -------------------------------------- */

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
                {/* {direction && (
                  <div className="flex items-center gap-1">
                    <Compass className="w-4 h-4" />
                    <span
                      className={`text-xs px-2 py-0.5 rounded border capitalize ${getDirectionColor(
                        direction
                      )}`}
                    >
                      {direction}
                    </span>
                  </div>
                )} */}
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
                Unlock Room
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Mark as Locked
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
            <span className="text-yellow-600">●○○</span>
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-600">●●●</span>
            <span>Full</span>
          </div>
        </div>

        {/* Weekly Schedule */}
        {schedule.map((daySchedule) => (
          <Card key={daySchedule.day} className="p-4">
            <h3 className="mb-3">{daySchedule.day}</h3>
            <div className="space-y-2">
              {daySchedule.slots.map((slot, index) => {
                const timeSlot = `${slot.start}-${slot.end}`;
                const checkins = getStudentCheckinsForSlot(roomId, daySchedule.day, timeSlot);
                const loudestActivity = getLoudestActivity(roomId, daySchedule.day, timeSlot);
                const occupancyLevel = getOccupancyLevel(roomId, daySchedule.day, timeSlot, capacity);
                const hasStudentActivity = checkins.length > 0;

                return (
                  <div
                    key={index}
                    onClick={() => handleSlotClick(daySchedule.day, slot)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      slot.isBooked
                        ? "bg-red-50 border-red-200"
                        : hasStudentActivity
                        ? "bg-yellow-50 border-yellow-200 cursor-pointer hover:bg-yellow-100"
                        : "bg-green-50 border-green-200 cursor-pointer hover:bg-green-100"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">{slot.start} - {slot.end}</span>
                        {hasStudentActivity && <span className={`text-xs ${getOccupancyColor(occupancyLevel)}`}>{getOccupancyIcon(occupancyLevel)}</span>}
                      </div>
                      {slot.isBooked && slot.bookedBy && (
                        <p className="text-xs text-gray-500 mt-1 ml-6">
                          Booked by: {slot.bookedBy} ({slot.bookedByRole})
                        </p>
                      )}
                      {hasStudentActivity && !slot.isBooked && (
                        <div className="flex items-center gap-2 mt-1 ml-6">
                          <Users className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-600">{checkins.length} student{checkins.length !== 1 ? "s" : ""} checked in</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {slot.isBooked ? (
                        <Badge variant="secondary" className="bg-red-100">{slot.subject || "Booked"}</Badge>
                      ) : hasStudentActivity ? (
                        <Badge variant="secondary" className="bg-yellow-100">{loudestActivity}</Badge>
                      ) : (
                        <Badge variant="default" className="bg-green-600">Available</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}

        {/* Check In Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Check In to {roomNumber}</DialogTitle>
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
      </div>
    </>
  );
}
