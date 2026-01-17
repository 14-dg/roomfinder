import React, { useEffect, useRef, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import './timetablebuilder.css'
import { Timetable,  Event, Lecturer, Module, Room} from '@/models';


interface TimetableBuilderProps {
    courseOfStudy: string;
    semester: string;
    year: number;
}

// Datacontext ziehen
// useData aus datacontext.tsx -> fuer datenzugriff
const TimetableBuilder: React.FC<TimetableBuilderProps> = ({ courseOfStudy, semester, year }) => {
    const [includeSaturday, setIncludeSaturday] = useState(false);
    const [timetable, setTimetable] = useState<Timetable[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [lecturers, setLecturers] = useState<Lecturer[]>([]);
    const [modules, setModules] = useState<Module[]>([]);

    const days: string[] = includeSaturday ? [
        'Monday', 
        'Tuesday', 
        'Wednesday', 
        'Thursday', 'Friday', 
        'Saturday'
    ] : [
        'Monday', 
        'Tuesday', 
        'Wednesday', 
        'Thursday', 
        'Friday'
    ];
    const timeSlots: string[] = [
        '08:00', 
        '08:50', 
        '09:45', 
        '10:35', 
        '11:30', 
        '12:20', 
        '13:15', 
        '14:05', 
        '15:00', 
        '15:50', 
        '16:45', 
        '17:35', 
        '18:30', 
        '19:20'
    ];
    const times: string[] = [
        '08:00', 
        '08:50', 
        '09:45', 
        '10:35', 
        '11:30', 
        '12:20', 
        '13:15', 
        '14:05', 
        '15:00', 
        '15:50', 
        '16:45', 
        '17:35', 
        '18:30', 
        '19:20', 
        '20:15'
    ];
    const endDay: string = '20:15';

    const handleTimeSlotClick = (day: string, startTime: string) => {
        alert(`Tag: ${day}, Uhrzeit: ${startTime}`);
    };

    return (
        <>
            <h3 className="text-lg font-semibold">Timetable Builder: {courseOfStudy}, {semester} Semester, {year}</h3>

            <div className="flex items-center gap-2">
              <Switch
                id="include-saturday"
                checked={includeSaturday}
                onCheckedChange={(checked: boolean) =>
                  setIncludeSaturday(checked)
                }
              />
              <Label htmlFor="include-saturday">Saturday</Label>
            </div>

            <table className="timetable">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Time</th>
                        <th colSpan={5}>Events</th>
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