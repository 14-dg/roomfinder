import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import './timetablebuilderNew.css';
import { Room } from '@/models';

// Typdefinitionen
interface Lecturer {
  id: string;
  name: string;
  department: string;
  email: string;
  officeHours: string;
  events: Event[];
}

// interface Room {
//   id: number;
//   roomNumber: string;
//   floor: number;
//   capacity: number;
//   occupiedSeats: number;
//   hasBeamer: boolean;
//   isLocked: boolean;
// }

interface Module {
  id: number;
  name: string;
}

interface Event {
  id?: number;
  day: string;
  startTime: string;
  endTime: string;
  name: string;
  lecturer: Lecturer | null;
  room: Room | null;
  module: Module | null;
  typeOf: string;
  duration: number;
  column: number;
}

interface Timetable {
  courseOfStudy: string;
  semester: string;
  year: number;
  days: string[];
  events: Event[];
}

interface TimetableBuilderProps {
  courseOfStudy: string;
  semester: string;
  year: number;
}

// Zeit-Slots
const timeSlots = [
  '08:00', '08:50', '09:45', '10:35', '11:30', '12:20', '13:15', '14:05',
  '15:00', '15:50', '16:45', '17:35', '18:30', '19:20'
];

const dayTimes = [
  '08:00', '08:50', '09:45', '10:35', '11:30', '12:20', '13:15', '14:05',
  '15:00', '15:50', '16:45', '17:35', '18:30', '19:20', '20:15'
];

const initialDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const typeOptions = [
  'Lecture',
  'Practical Course',
  'Exercise',
  'Seminar',
  'Other'
];

// Utility-Funktionen
const saveTimetable = (key: string, timetable: Timetable): void => {
  localStorage.setItem(key, JSON.stringify(timetable));
};

const loadTimetable = (key: string): Timetable | null => {
  const data = localStorage.getItem(key);
  if(!data) return null;
  const parsedData = JSON.parse(data);
  return {
    ...parsedData,
    events: parsedData.events || []
  };
};

const createTimetable = (
  courseOfStudy: string,
  semester: string,
  year: number,
  includeSaturday: boolean = false
): Timetable => {
  return {
    courseOfStudy,
    semester,
    year,
    days: includeSaturday ? [...initialDays, 'Saturday'] : initialDays,
    events: []
  };
};

const loadLecturers = (): Lecturer[] => {
  const data = localStorage.getItem('lecturers');
  return data ? JSON.parse(data) : [];
}

const loadRooms = (): Room[] => {
  const data = localStorage.getItem('rooms');
  return data ? JSON.parse(data) : []
}

const saveModules = (modules: Module[]): void => {
  localStorage.setItem('modules', JSON.stringify(modules));
};

const loadModules =(): Module[] => {
  const data = localStorage.getItem('modules');
  return data ? JSON.parse(data) : [];
}

// EventForm-Komponente
interface EventFormProps {
  formData: Partial<Event>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Event>>>;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  isEditing: boolean;
  includeSaturday: boolean;
  lecturers: Lecturer[];
  rooms: Room[];
  modules: Module[];
  addModule: (newModule: Module) => void;
}

const EventForm = ({ formData, setFormData, onSubmit, onCancel, onDelete, isEditing, includeSaturday, lecturers, rooms, modules, addModule }: EventFormProps) => {
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleId, setNewModuleId] = useState('');

  const availableDays = includeSaturday
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Berechne verfügbare Endzeiten basierend auf der Startzeit
  const getAvailableEndTimes = () => {
    if (!formData.startTime) return [];
    const startIndex = dayTimes.indexOf(formData.startTime);
    return dayTimes.slice(startIndex + 1);
  };

  // Berechne verfügbare Dauer-Optionen basierend auf der Startzeit
  const getAvailableDurations = () => {
    if (!formData.startTime) return [];
    const startIndex = dayTimes.indexOf(formData.startTime);
    const maxDuration = timeSlots.length - startIndex;
    return Array.from({ length: maxDuration }, (_, i) => i + 1);
  };

  // Berechne die Endzeit basierend auf Startzeit und Dauer
  const calculateEndTime = (duration: number) => {
    if (!formData.startTime) return '';
    const startIndex = dayTimes.indexOf(formData.startTime);
    const endIndex = startIndex + duration;
    return endIndex < dayTimes.length ? dayTimes[endIndex] : dayTimes[dayTimes.length - 1];
  };

  // Berechne die Dauer basierend auf Startzeit und Endzeit
  const calculateDuration = (endTime: string) => {
    if (!formData.startTime) return 1;
    const startIndex = dayTimes.indexOf(formData.startTime);
    const endIndex = dayTimes.indexOf(endTime);
    return endIndex >= startIndex ? (endIndex - startIndex) : 1;
  };

  // Aktualisiere die Endzeit, wenn sich die Dauer ändert
  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const duration = parseInt(e.target.value);
    const endTime = calculateEndTime(duration);
    setFormData({
      ...formData,
      duration: duration,
      endTime: endTime
    });
  };

  // Aktualisiere die Dauer, wenn sich die Endzeit ändert
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const endTime = e.target.value;
    const duration = calculateDuration(endTime);
    setFormData({
      ...formData,
      endTime: endTime,
      duration: duration
    });
  };

  const handleAddModule = () => {
    if (newModuleName && newModuleId) {
      const newModule = {
        id: parseInt(newModuleId),
        name: newModuleName
      };
      addModule(newModule);
      setFormData({
        ...formData,
        module: newModule
      });
      setNewModuleName('');
      setNewModuleId('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'lecturer') {
      const selectedLecturer = lecturers.find(l => l.id === value) || null;
      setFormData({
        ...formData,
        lecturer: selectedLecturer
      });
    } else if (name === 'room') {
      const selectedRoom = rooms.find(r => r.id.toString() === value) || null;
      setFormData({
        ...formData,
        room: selectedRoom
      });
    } else if (name === 'module') {
      const selectedModule = modules.find(m => m.id.toString() === value) || null;
      setFormData({
        ...formData,
        module: selectedModule,
        name: selectedModule?.name
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <div className="event-form-popup">
      <h4>{isEditing ? 'Veranstaltung bearbeiten' : 'Neue Veranstaltung hinzufügen'}</h4>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}>
        <div className="form-group">
          <label>Tag:</label>
          {/* <input
            name='day'
            value={formData.day || ''}
            readOnly
          /> */}
          <select
            name="day"
            value={formData.day || ''}
            onChange={handleChange}
            required
          >
            <option value="">Wählen Sie einen Tag</option>
            {availableDays.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Startzeit:</label>
          <select
            name="startTime"
            value={formData.startTime || ''}
            onChange={handleChange}
            required
          >
            {timeSlots.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>

        {/* Duration-Dropdown */}
        <div className="form-group">
          <label>Dauer (Zeitslots):</label>
          <select
            name="duration"
            value={formData.duration || 1}
            onChange={handleDurationChange}
            required
          >
            {getAvailableDurations().map(duration => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </select>
        </div>

        {/* EndTime-Dropdown */}
        <div className="form-group">
          <label>Endzeit:</label>
          <select
            name="endTime"
            value={formData.endTime || '' }
            onChange={handleEndTimeChange}
            required
          >
            {getAvailableEndTimes().map(slot => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Typ:</label>
          <select
            name="typeOf"
            value={formData.typeOf || ''}
            onChange={handleChange}
            required
          >
            <option value="">Wählen Sie einen Typ</option>
            {typeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Dozent:</label>
          <select
            name="lecturer"
            value={formData.lecturer?.id || ''}
            onChange={handleChange}
            required
          >
            <option value="">Wählen Sie einen Dozenten</option>
            {lecturers.map(lecturer => (
              <option key={lecturer.id} value={lecturer.id}>{lecturer.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Raum:</label>
          <select
            name="room"
            value={formData.room?.id || ''}
            onChange={handleChange}
            required
          >
            <option value="">Wählen Sie einen Raum</option>
            {rooms.map(room => (
              <option key={room.id} value={room.roomName}>{room.roomName}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Modul:</label>
          <select
            name="module"
            value={formData.module?.id || ''}
            onChange={handleChange}
            required
          >
            <option value="">Wählen Sie ein Modul</option>
            {modules.map(module => (
              <option key={module.id} value={module.id}>{module.name}</option>
            ))}
          </select>
          {!formData.module?.id && (
            <div className="new-module-container">
              <input
                type="number"
                placeholder="Modul-ID"
                value={newModuleId}
                onChange={(e) => setNewModuleId(e.target.value)}
              />
              <input
                type="text"
                placeholder="Modulname"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
              />
              <button type="button" onClick={handleAddModule}>Hinzufügen</button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit">{isEditing ? 'Aktualisieren' : 'Hinzufügen'}</button>
          <button type="button" onClick={onCancel}>Abbrechen</button>
          {isEditing && onDelete && (
            <button type="button" className="delete-button" onClick={onDelete}>
              Löschen
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// TimetableCell-Komponente
const TimetableCell = ({
  day,
  timeSlot,
  timeSlots,
  events,
  column,
  onClick
}: {
  day: string;
  timeSlot: string;
  timeSlots: string[];
  events: Event[];
  column: number;
  onClick: (e: React.MouseEvent, day: string, timeSlot: string, column: number) => void;
}) => {
  const event = events.find(e =>
    e.day === day &&
    e.column === column &&
    timeSlots.indexOf(e.startTime) <= timeSlots.indexOf(timeSlot) &&
    timeSlots.indexOf(timeSlot) < timeSlots.indexOf(e.startTime) + e.duration
  );

  const getEventClass = (typeOf: string) => {
    switch(typeOf.toLowerCase()) {
      case 'lecture':
        return 'event-lecture';
      case 'practical course':
        return 'event-practical-course';
      case 'exercise':
        return 'event-exercise';
      case 'seminar':
        return 'event-seminar';
      default:
        return 'event-other'
    }
  };

  const isFirstTimeSlotOfEvent = (event: Event) => {
    return timeSlots.indexOf(event.startTime) === timeSlots.indexOf(timeSlot);
  };

  return (
    <td
      className={`time-slot ${event ? 'occupied' : 'available'}`}
      onClick={(e) => onClick(e, day, timeSlot, column)}
      style={{
        position: 'relative',
        height: '60px',
        border: event && !isFirstTimeSlotOfEvent(event) ? 'none' : '1px solid #ddd'
      }}
    >
      {event && isFirstTimeSlotOfEvent(event) && (
        <div
          className={`event-container ${getEventClass(event.typeOf)}`}
          style={{
            height: `${event.duration * 60}px`,
          }}
        >
          <div className="event-info">
            <div className="event-name">{event.name}</div>
            <div className="event-details">
              {event.lecturer?.name} | {event.room?.roomName} | {event.typeOf}
            </div>
          </div>
        </div>
      )}
    </td>
  );
};

// Hauptkomponente
const TimetableBuilder: React.FC<TimetableBuilderProps> = ({ courseOfStudy, semester, year }) => {
  const [includeSaturday, setIncludeSaturday] = useState(false);
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [modules, setModules] = useState<Module[]>([]);

  // Initialer Formulardaten
  const initialFormData: Partial<Event> = {
    day: '',
    startTime: '08:00',
    endTime: '08:50',
    name: '',
    typeOf: '',
    duration: 1,
    column: 0,
    lecturer: null,
    room: null,
    module: null
  };

  const [formData, setFormData] = useState<Partial<Event>>(initialFormData);

  // Erstellen Sie einen eindeutigen Schlüssel für diesen Stundenplan
  const timetableKey = `timetable_${courseOfStudy}_${semester}_${year}`;

  // Laden oder Erstellen des Stundenplans beim ersten Render
  useEffect(() => {
    const loadedTimetable = loadTimetable(timetableKey);
    const lecturers = loadLecturers();
    const rooms = loadRooms();
    const modules = loadModules();

    if (loadedTimetable) {
      setTimetable(loadedTimetable);
      setIncludeSaturday(loadedTimetable.days.includes('Saturday'));
    } else {
      const newTimetable = createTimetable(courseOfStudy, semester, year, includeSaturday);
      saveTimetable(timetableKey, newTimetable);
      setTimetable(newTimetable);
    }

    if(lecturers.length > 0) setLecturers(lecturers);
    if(rooms.length > 0) setRooms(rooms);
    if(modules.length > 0) setModules(modules);
  }, [courseOfStudy, semester, year, timetableKey]);

  const handleCellClick = (e: React.MouseEvent, day: string, timeSlot: string, column: number) => {
    if (!timetable) return;

    const event = timetable.events.find((e: Event) =>
      e.day === day &&
      e.column === column &&
      timeSlots.indexOf(e.startTime) <= timeSlots.indexOf(timeSlot) &&
      timeSlots.indexOf(timeSlot) < timeSlots.indexOf(e.startTime) + e.duration
    );

    if (event) {
      setEditingEvent(event);
      setFormData({
        ...initialFormData,
        ...event,
        lecturer: event.lecturer,
        room: event.room,
        module: event.module
      });
    } else {
      setEditingEvent(null);
      setFormData({
        ...initialFormData,
        day,
        startTime: timeSlot,
        column
      });
    }
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    if (!timetable) return;

    if (
      !formData.day ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.name ||
      !formData.typeOf ||
      !formData.duration ||
      formData.duration <= 0
    ) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.');
      return;
    }

    let updatedEvents: Event[] = [...timetable.events];

    if (editingEvent) {
      updatedEvents = updatedEvents.map((e: Event) =>
        e.id === editingEvent.id ? { ...e, ...formData } : e
      );
    } else {
      const newEvent: Event = {
        id: timetable.events.length > 0
        ? Math.max(...timetable.events.map((e: Event) => e.id || 0)) + 1
        : 1,
        day: formData.day!,
        startTime: formData.startTime!,
        endTime: formData.endTime!,
        name: formData.name!,
        typeOf: formData.typeOf!,
        duration: formData.duration!,
        column: formData.column!,
        lecturer: formData.lecturer || null,
        room: formData.room || null,
        module: formData.module || null
      };
      updatedEvents.push(newEvent);
    }

    const updatedTimetable: Timetable = {
      ...timetable,
      events: updatedEvents
    };

    setTimetable(updatedTimetable);
    saveTimetable(timetableKey, updatedTimetable);
    setShowForm(false);
    setFormData(initialFormData);
  };

  const handleDelete = () => {
    if (!timetable || !editingEvent) return;

    const updatedEvents: Event[] = timetable.events.filter((e: Event) => e.id !== editingEvent.id);
    const updatedTimetable: Timetable = {
      ...timetable,
      events: updatedEvents
    };

    setTimetable(updatedTimetable);
    saveTimetable(timetableKey, updatedTimetable);
    setShowForm(false);
    setFormData(initialFormData);
  };

  const handleIncludeSaturdayChange = (checked: boolean) => {
    if (!timetable) return;

    const updatedTimetable: Timetable = {
      ...timetable,
      days: checked ? [...initialDays, 'Saturday'] : initialDays
    };

    setIncludeSaturday(checked);
    saveTimetable(timetableKey, updatedTimetable);
    setTimetable(updatedTimetable);
  };

  const addModule = (newModule: Module) => {
    const currentModules = loadModules();
    const updatedModules = [...currentModules, newModule];
    saveModules(updatedModules);
    setModules(updatedModules)
  }

  if (!timetable) return <div>Loading...</div>;

  return (
    <div className="timetable-builder">
      <h3>Stundenplan: {courseOfStudy}, {semester} Semester, {year}</h3>

      <div className="flex items-center gap-2">
        {/* <input
          type="checkbox"
          id="include-saturday"
          checked={includeSaturday}
          onChange={(e) => handleIncludeSaturdayChange(e.target.checked)}
        /> */}
        <Switch 
          id='include-saturday'
          checked={includeSaturday}
          onCheckedChange={handleIncludeSaturdayChange}
        />
        <Label htmlFor="include-saturday">Samstag einschließen</Label>
      </div>

      <div className="timetable-container">
        <table className="timetable">
          <thead>
            <tr>
              <th className='day-column'>Tag</th>
              <th className='time-column'>Zeit</th>
              <th colSpan={5}>Veranstaltung</th>
              {/* {Array.from({ length: 5 }, (_, i) => (
                <th key={i}>Veranstaltung {i+1}</th>
              ))} */}
            </tr>
          </thead>
          <tbody>
            {timetable.days.map((day: string) => (
              <React.Fragment key={day}>
                {timeSlots.map((timeSlot) => (
                  <tr key={`${day}-${timeSlot}`}>
                    <td className='day-column'>{day}</td>
                    <td className='time-column'>{timeSlot}</td>
                    {Array.from({ length: 5 }, (_, column) => (
                      <TimetableCell
                        key={column}
                        day={day}
                        timeSlot={timeSlot}
                        timeSlots={timeSlots}
                        events={timetable.events}
                        column={column}
                        onClick={handleCellClick}
                      />
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
      </div>

      {showForm && (
        <div className="form-overlay">
          <EventForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setFormData(initialFormData);
            }}
            onDelete={handleDelete}
            isEditing={!!editingEvent}
            includeSaturday={includeSaturday}
            lecturers={lecturers}
            rooms={rooms}
            modules={modules}
            addModule={addModule}
          />
        </div>
      )}
    </div>
  );
};

export default TimetableBuilder;