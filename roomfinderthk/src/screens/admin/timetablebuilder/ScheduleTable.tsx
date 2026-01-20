import React from "react";

interface Event {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    day: string;
}

interface Schedule {
    days: string[];
    times: string[];
    events: Event[];
}

interface ScheduleTableProps {
    schedule: Schedule;
}

// muss eingelesen werden, oder neu erstellt, wenn noch nicht vorhanden
// const schedule: Schedule = {
//     days: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'],
//     times: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
//     events: [
//         { id: 1, name: 'Mathe', startTime: '08:00', endTime: '10:00', day: 'Montag' },
//         { id: 2, name: 'Englisch', startTime: '10:00', endTime: '12:00', day: 'Montag' },
//         { id: 3, name: 'Biologie', startTime: '13:00', endTime: '15:00', day: 'Dienstag' },
//         { id: 4, name: 'Chemie', startTime: '15:00', endTime: '17:00', day: 'Dienstag' },
//         { id: 5, name: 'Sport', startTime: '09:00', endTime: '11:00', day: 'Mittwoch' },
//         { id: 6, name: 'Kunst', startTime: '11:00', endTime: '13:00', day: 'Mittwoch' },
//         { id: 7, name: 'Geschichte', startTime: '08:00', endTime: '10:00', day: 'Donnerstag' },
//         { id: 8, name: 'Physik', startTime: '10:00', endTime: '12:00', day: 'Donnerstag' },
//     ],
// };

const getRowSpan = (startTime: string, endTime: string, times: string[]) => {
    const startIndex = times.indexOf(startTime);
    const endIndex = times.indexOf(endTime);
    return endIndex - startIndex + 1;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedule }) => {
    const renderEvents = (day: string) => {
        const events = schedule.events.filter(event => event.day === day);
        return events.map(event => {
            const rowSpan = getRowSpan(event.startTime, event.endTime, schedule.times);
            const startIndex = schedule.times.indexOf(event.startTime);
            return (
                <React.Fragment key={event.id}>
                    {schedule.times.slice(startIndex, startIndex + rowSpan).map((time, index) => (
                        <tr key={`${event.id}-${index}`}>
                            {index === 0 && <td rowSpan={rowSpan} style={{ border: '1px solid black', padding: '5px', verticalAlign: 'top' }}>{event.name}</td>}
                            <td>{time}</td>
                            <td></td>
                        </tr>
                    ))}
                </React.Fragment>
            );
        });
    };

    return (
        <table border={1} style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
                <tr>
                    <th>Tag</th>
                    <th>Uhrzeit</th>
                    <th>Veranstaltungen</th>
                </tr>
            </thead>
            <tbody>
                {schedule.days.map(day => (
                    <React.Fragment key={day}>
                        {renderEvents(day)}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default ScheduleTable;