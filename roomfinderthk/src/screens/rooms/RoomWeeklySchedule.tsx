import { Card } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { getOccupancyLevel, getOccupancyColor, getOccupancyIcon } from "@/utils/occupancy";
import { Clock, Users, Badge } from "lucide-react";

export function RoomWeeklySchedule() {

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

      const schedule = getRoomSchedule(room.id);
      
    return (
        <>
            {
                schedule.map((daySchedule) => (
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
                                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${slot.isBooked
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
                ))
            }
        </>
    );
}