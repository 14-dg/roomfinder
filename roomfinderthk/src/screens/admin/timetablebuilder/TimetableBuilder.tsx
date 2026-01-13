import React from 'react';
import './timetablebuilder.css'

interface TimetableBuilderProps {
    courseOfStudy: string;
    semester: string;
    year: number;
}

const TimetableBuilder: React.FC<TimetableBuilderProps> = ({ courseOfStudy, semester, year }) => {
    const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
    const timeSlots: string[] = [];
    let startHour = 8;
    let startMinute = 0;
    for (let i = 0; i < 14; i++) {
        const duration = i % 2 === 0 ? 50 : 55;
        const startStr = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
        timeSlots.push(startStr);
        const endTime = new Date(2023, 0, 1, startHour, startMinute + duration);
        startHour = endTime.getHours();
        startMinute = endTime.getMinutes();
    }


    const handleTimeSlotClick = (day: string, hour: string) => {
        alert(`Tag: ${day}, Uhrzeit: ${hour}`);
    };

    return (
        <>
            <h3 className="text-lg font-semibold">Timetable Builder: {courseOfStudy}, {semester} Semester, {year}</h3>

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