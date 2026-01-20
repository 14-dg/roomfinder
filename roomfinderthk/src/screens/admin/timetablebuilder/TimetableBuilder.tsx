import React, { useEffect, useRef, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { EventForm } from './components/EventForm';
import { TimetableCell } from './components/TimetableCell';
import { initialEvents } from './initialEvents';
import { 
    saveTimetable, 
    loadTimetable, 
    createTimetable,
    createEvent, 
    updateEvent, 
    deleteEvent, 
    getEventForSlot 
} from './utils';
import { includeSaturday, setIncludeSaturday, days, timeSlots } from './daysandtimeslots';
import { Timetable,  Event, Lecturer, Module, Room} from '@/models';
import { TimetableBuilderProps, EventFormProps } from './types';
import { timeSlots, dayTimes, initialDays, typeOptions } from './constants';
import { useData } from '@/contexts/DataContext';
import './timetablebuilder.css'

// Datacontext ziehen
// useData aus datacontext.tsx -> fuer datenzugriff
const TimetableBuilder: React.FC<TimetableBuilderProps> = ({ courseOfStudy, semester, year }) => {
    const [timetable, setTimetable] = useState<Timetable | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    // const [rooms, setRooms] = useState<Room[]>([]);
    // const [lecturers, setLecturers] = useState<Lecturer[]>([]);
    const [modules, setModules] = useState<Module[]>([
        { id: 1, name: 'Mathematik' },
        { id: 2, name: 'Informatik' },
        { id: 3, name: 'Physik' }
    ]);
    const [formData, setFormData] = useState<Partial<Event>>({
        day: '',
        startTime: '',
        endTime: '',
        name: '',
        lecturer: null,
        room: null,
        module: null,
        typeOf: '',
        duration: 1,
        column: 0
    });

    const endDay: string = '20:15';
    const timetableKey = `timetable_${courseOfStudy}_${semester}_${year}`;

    useEffect(() => {
        const loadedTimetable = loadTimetable(timetableKey);

        if(!loadedTimetable) {
            const newTimetable = createTimetable(courseOfStudy, semester, year, includeSaturday);
            saveTimetable(newTimetable);
            setTimetable(newTimetable);
        } else {
            setTimetable(loadedTimetable);
            setIncludeSaturday(loadedTimetable.days.includes('Saturday'));
        }
    }, [courseOfStudy, semester, year, includeSaturday, timetableKey]);

    const handleCellClick = (e: React.MouseEvent, day: string, timeSlot: string, column: number) => {
        if(!timetable) return;

        const event = getEventForSlot(timetable.events, day, timeSlot, timeSlots, column);
        if(event) {
            setEditingEvent(event);
            setFormData({
                ...event,
                lecturer: event.lecturer,
                room: event.room,
                module: event.module
            });
        } else {
            setEditingEvent(null);
            setFormData({
                day, startTime: timeSlot,
                endTime: timeSlot[timeSlots.indexOf(timeSlot) + 1] || endDay,
                name: '',
                typeOf: '',
                duration: 1,
                column
            });
        }
        setShowForm(true);
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = () => {
        if(!timetable) return;

        let updatedEvents;
        if(editingEvent) {
            updatedEvents = updateEvent(timetable.events, { ...formData, id: editingEvent.id } as Event);
        } else {
            updatedEvents = [...timetable.events, createEvent(timetable.events, formData as Event)];
        }
        setEvents(updatedEvents);
        saveTimetable(storageKey, updatedEvents);
        setShowForm(false);
    };

    const handleDelete = () => {
        if(editingEvent) {
            const updatedEvents = deleteEvent(events, editingEvent.id!);
            setEvents(updatedEvents);
            saveTimetable(storageKey, updatedEvents);
            setShowForm(false);
        }
    };

    const handleReset = () => {
        if(window.confirm('Are you sure you want do discard all the changes?')) {
            localStorage.removeItem(storageKey);
            setEvents(initialEvents);
        }
    };

    return (
        <div className='timetable-Builder'>
            <h3 className="text-lg font-semibold">
                Timetable Builder: {courseOfStudy}, {semester} Semester, {year}
            </h3>

            <div className="flex items-center gap-2">
              <Switch
                id="include-saturday"
                checked={includeSaturday}
                onCheckedChange={setIncludeSaturday}
              />
              <Label htmlFor="include-saturday">Include Saturday</Label>
            </div>

            <button onClick={handleReset} className='reset-button'>
                Reset
            </button>

            <div className='timetable-container'>
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
                                        {Array.from({ length: 5 }, (_, column) => (
                                          <TimetableCell
                                            key={column}
                                            day={day}
                                            timeSlot={timeSlot}
                                            timeSlots={timeSlots}
                                            events={events}
                                            column={column}
                                            onClick={handleCellClick}
                                          />  
                                        ))}
                                    </tr>
                                ))}
                                <tr className='day-separator'>
                                    <td colSpan={7}></td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className='form-overlay'>
                    <div className='event-form-container'>
                        <EventForm 
                            formData={formData}
                            onChange={handleFormChange}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setShowForm(false)}
                            onDelete={handleDelete}
                            isEditing={!!editingEvent}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimetableBuilder;

// laden von events
// anzeigen von events
// hinzufuegen von events mit linksklick
// bearbeiten von events mit linksklick
// speichern eines timetables
// laden eines timetables