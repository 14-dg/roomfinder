import { useState, useMemo } from "react";
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
  GraduationCap,
} from "lucide-react";
import ScreenHeader from "@/components/ScreenHeader";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { getOccupancyColor, getOccupancyIcon, getOccupancyLevel } from "@/utils/occupancy";
import { RoomDetailLegend } from "./RoomDetailLegend";
import { RoomWeeklySchedule } from "./RoomWeeklySchedule";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Event, Timetable } from "@/models";

/* ------------------------------ screen ------------------------------------ */

/**
 * Helper to group events by day and sort them by start time.
 * Filters out days that have no events.
 */
function groupEventsByDay(events: Event[]) {
  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const grouped = events.reduce((acc, event) => {
    const day = event.day;
    if (!acc[day]) acc[day] = [];
    acc[day].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return daysOrder
    .filter(day => grouped[day] && grouped[day].length > 0)
    .map(day => ({
      day,
      slots: grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime))
    }));
}

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
    timetables,
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

  // Get room events from timetables
  const roomEvents = useMemo(() => {
    if (!timetables) return [];

    const eventsInRoom: Event[] = timetables.flatMap((timetable: Timetable) =>
      timetable.events
        .filter(event => event.room?.id === roomId)
        .map(event => ({
          ...event,
          courseOfStudy: timetable.courseOfStudy,
          semester: timetable.semester
        }))
    );

    return groupEventsByDay(eventsInRoom);
  }, [roomId, timetables]);

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

        {/* Events/Lectures in this Room */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Scheduled Lectures</h3>

          {roomEvents.length > 0 ? (
            <div className="space-y-6">
              {roomEvents.map((dayGroup) => (
                <div key={dayGroup.day} className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b pb-1">
                    {dayGroup.day}
                  </h4>
                  <div className="grid gap-3">
                    {dayGroup.slots.map((event) => (
                      <div
                        key={event.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-white border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
                      >
                        <div className="mb-2 sm:mb-0">
                          <p className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                            {event.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {event.startTime} - {event.endTime}
                            </span>
                            {event.lecturer && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                {event.lecturer.name}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-blue-600 font-medium">
                              <GraduationCap className="w-3.5 h-3.5" />
                              {(event as any).courseOfStudy}, Sem. {(event as any).semester}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-10 text-center border-dashed border-slate-300 bg-slate-50/50">
              <p className="text-sm text-slate-500 italic">No scheduled lectures found for this room.</p>
            </Card>
          )}
        </div>

        
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
