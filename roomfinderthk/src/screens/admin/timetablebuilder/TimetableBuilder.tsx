import React, { useEffect, useRef, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import './timetablebuilder.css'
import { Lecture } from '@/models';

interface TimetableBuilderProps {
    courseOfStudy: string;
    semester: string;
    year: number;
}

interface Timetable {
    days: string[];
    events: Event[];
}

interface Event {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    name: string;
    lecturer: Lecturer;
    room: Room;
    module: Module;
    type: string;
}

interface Lecturer {
    id: string;
    name: string;
    department: string;
    email: string;
    officeHours: string;
    events: Event[];
}

interface Room {
    id: number;
    roomNumber: string;
    floor: number;
    capacity: number;
    occupiedSeats: number;
    hasBeamer: boolean;
    isLocked: boolean;
}

interface Module {
    id: number
    name: string;
}

// Datacontext ziehen
// useData aus datacontext.tsx -> fuer datenzugriff
const TimetableBuilder: React.FC<TimetableBuilderProps> = ({ courseOfStudy, semester, year }) => {
    const days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots: string[] = ['08:00', '08:50', '09:45', '10:35', '11:30', '12:20', '13:15', '14:05', '15:00', '15:50', '16:45', '17:35', '18:30', '19:20'];
    const endDay: string = '20:15';

    // const [events, setEventTimetableBuilder] = useState<Event[]>([]);

    const [events, setEvents] = useState();
    const [rooms, setRooms] = useState();
    const [lecturers, setLecturers] = useState();
    const [modules, setModules] = useState();

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ day: '', time: 0, event: null });
    const [contextMenu, setContextMenu] = useState(null);
    const contextMenuRef = useRef(null);
    const timetableRef = useRef(null);


    const handleTimeSlotClick = (day: string, startTime: string) => {
        alert(`Tag: ${day}, Uhrzeit: ${startTime}`);
    };

    return (
        <>
            <h3 className="text-lg font-semibold">Timetable Builder: {courseOfStudy}, {semester} Semester, {year}</h3>

            {/* <div className="flex items-center gap-2">
              <Switch
                id="hasBeamer"
                checked={newRoom.hasBeamer}
                onCheckedChange={(checked) =>
                  setNewRoom({ ...newRoom, hasBeamer: checked })
                }
              />
              <Label htmlFor="hasBeamer">Has Beamer</Label>
            </div> */}

            <table className="timetable">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Time</th>
                        {Array.from({ length: 5 }, (_, i) => (
                            <th key={i} />
                        ))}
                    </tr>
                </thead>
                    <tbody>
                    {days.map((day) => (
                        <React.Fragment key={day}>
                            {timeSlots.map((timeSlot) => (
                                <tr key={`${day}-${timeSlot}`}>
                                    <td>{day}</td>
                                    <td>{timeSlot}</td>
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <td key={i} onClick={() => handleTimeSlotClick(day, timeSlot)} className="clickable-timeSlot"></td>
                                    ))}
                                </tr>
                            ))}
                            <tr className="day-separator">
                                <td colSpan={7}></td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default TimetableBuilder;