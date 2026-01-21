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
  Calendar,
} from "lucide-react";
import ScreenHeader from "@/components/ScreenHeader";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { getOccupancyColor, getOccupancyIcon, getOccupancyLevel } from "@/utils/occupancy";
import { RoomDetailLegend } from "./RoomDetailLegend";
import { RoomWeeklySchedule } from "./RoomWeeklySchedule";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/* ------------------------------ screen ------------------------------------ */

export default function RoomDetailScreen() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  // für checkin Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [duration, setDuration] = useState("60");

  const {
    rooms,
    studentCheckins,
    getRoomSchedule,
    getCurrentDayAndTimeSlot,
    updateRoom,
    addStudentCheckin,
    removeStudentCheckin,
    bookings,
  } = useData();

  const {
    user,
  } = useAuth();

  if (!roomId) return <p className="text-center py-10">Invalid room</p>;

  const room = rooms.find((r) => r.id === roomId);
  if (!room) return <p className="text-center py-10">Room not found</p>;

  const schedule = getRoomSchedule(room.id);
  const currentSlot = getCurrentDayAndTimeSlot();

  // Get room bookings (timetable entries)
  const roomBookings = bookings.filter(b => b.roomId === roomId);

  const myCheckIn = studentCheckins.find(c => c.userId === user?.id);
  const isCheckedInHere = myCheckIn?.roomId === roomId;

  /* --------------------------- handlers ----------------------------------- */

  const handleToggleLock = async () => {
    if (!room) return;
    await updateRoom(room.id, { isLocked: !room.isLocked });
    toast.success(!room.isLocked ? "Room marked as locked" : "Room marked as unlocked");
  };

  const handleToggleCheckin = async () => {

    if (!room) return;

    if (isCheckedInHere) {
      
      if (myCheckIn) {
        removeStudentCheckin(myCheckIn.id);
        toast.success("Erfolgreich ausgecheckt");
      }
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleConfirmCheckIn = async () => {
    if (!user || !room) return;

    if (myCheckIn) {
      await removeStudentCheckin(myCheckIn.id);
    }

    const now = new Date();
    const minutesToAdd = parseInt(duration);
    const endTime = new Date(now.getTime() + minutesToAdd * 60000);

    // neues checkin erstellen
    await addStudentCheckin({
      roomId: room.id,
      userId: user.id,
      startTime: now.toISOString(),
      endTime: endTime.toISOString(),
    });

    toast.success(`Eingecheckt in ${room.roomName}`, {
      description: `Bis ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} Uhr`
    });
    
    // 4. Dialog schließen & Reset
    setIsDialogOpen(false);
  };

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
            variant={isCheckedInHere ? "default" : "outline"}
            className={`w-full ${
              isCheckedInHere 
                ? "border-red-200 text-red-600 hover:bg-red-50" 
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isCheckedInHere ? (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Check Out
              </>
            ) : (
              <>
                <DoorOpen className="w-4 h-4 mr-2" />
                Check In
              </>
            )}
          </Button>

          <Button onClick={() => navigate(-1)} variant="ghost" className="w-full mt-2">
            Back
          </Button>
        </Card>

        {/* Current Status */}
        {(
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-blue-900">Current Status</h3>
            </div>
            <div className="flex items-center justify-between p-3 rounded border bg-white">
              <div>
                <span
                  className={`ml-2 text-xs ${getOccupancyColor(
                    getOccupancyLevel(
                      room.checkins
                    )
                  )}`}
                >
                  {getOccupancyIcon(
                    getOccupancyLevel(
                      room.checkins
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
            </div>
          </Card>
        )}

        {/* Legende */}
        <RoomDetailLegend/>

        {/* Timetable - Room Bookings */}
        {roomBookings.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Room Bookings</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Booked By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.day}</TableCell>
                      <TableCell>{booking.timeSlot}</TableCell>
                      <TableCell>{booking.subject}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {booking.bookedByName}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {/* Weekly Schedule */}
        {/*<RoomWeeklySchedule></RoomWeeklySchedule>*/}

        {/* Check In Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check In: {room?.roomName}</DialogTitle>
            <DialogDescription>
              Wähle deine Aufenthaltsdauer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            
            {/* Dauer Auswahl */}
            <div className="space-y-2">
              <Label>Wie lange bleibst du?</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Dauer wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Minuten</SelectItem>
                  <SelectItem value="60">1 Stunde</SelectItem>
                  <SelectItem value="90">1.5 Stunden</SelectItem>
                  <SelectItem value="120">2 Stunden</SelectItem>
                  <SelectItem value="240">4 Stunden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
               <Button onClick={handleConfirmCheckIn} className="w-full">
                 Jetzt Einchecken
               </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
}
