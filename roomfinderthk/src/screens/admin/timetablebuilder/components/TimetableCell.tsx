import React from 'react';
import { Event } from '@/models';
import { getEventForSlot } from '../utils';

interface TimetableCellProps {
  day: string;
  timeSlot: string;
  events: Event[];
  column: number;
  onClick: (e: React.MouseEvent, day: string, timeSlot: string, column: number) => void;
}

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

export const TimetableCell: React.FC<TimetableCellProps> = ({
  day,
  timeSlot,
  events,
  column,
  onClick
}) => {
  const event = getEventForSlot(events, day, timeSlot, timeSlots, column);

  return (
    <td
      className={`time-slot ${event ? 'occupied' : 'available'}`}
      onClick={(e) => onClick(e, day, timeSlot, column)}
    >
      {event && (
        <div className="event-info">
          <div className="event-name">{event.name}</div>
          <div className="event-details">{event.room?.roomNumber}</div>
        </div>
      )}
    </td>
  );
};
