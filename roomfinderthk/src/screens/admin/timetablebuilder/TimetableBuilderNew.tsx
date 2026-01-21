import React, { useState, useMemo } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import './timetablebuilderNew.css';
import { useData } from '@/contexts/DataContext';
import { RoomWithStatus, Lecturer, Module, Lecture, LectureType } from '@/models';

interface TimetableBuilderProps {
  courseOfStudy: string;
  semester: string;
  year: number;
}

// Zeit-Slots für das Raster
const timeSlots = [
  '08:00', '08:50', '09:45', '10:35', '11:30', '12:20', '13:15', '14:05',
  '15:00', '15:50', '16:45', '17:35', '18:30', '19:20'
];

// Für Dropdowns (Startzeiten)
const dayTimes = [
  '08:00', '08:50', '09:45', '10:35', '11:30', '12:20', '13:15', '14:05',
  '15:00', '15:50', '16:45', '17:35', '18:30', '19:20', '20:15'
];

const initialDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Temporäres Interface für das Formular (nur UI, keine DB!)
interface UIEventFormData {
  id?: string;
  day: string;
  startTime: string;
  endTime: string;
  name: string;
  typeOf: string;
  duration: number;
  lecturerId: string;
  roomId: string;
}

interface EventFormProps {
  formData: UIEventFormData;
  setFormData: React.Dispatch<React.SetStateAction<UIEventFormData>>;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  isEditing: boolean;
  includeSaturday: boolean;
  lecturers: any[];
  rooms: RoomWithStatus[];
  modules: Module[];
}

const EventForm = ({ formData, setFormData, onSubmit, onCancel, onDelete, isEditing, includeSaturday, lecturers, rooms }: EventFormProps) => {
  const availableDays = includeSaturday
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getAvailableEndTimes = () => {
    if (!formData.startTime) return [];
    const startIndex = dayTimes.indexOf(formData.startTime);
    return dayTimes.slice(startIndex + 1);
  };

  const getAvailableDurations = () => {
    if (!formData.startTime) return [];
    const startIndex = dayTimes.indexOf(formData.startTime);
    const maxDuration = timeSlots.length - startIndex;
    return Array.from({ length: maxDuration }, (_, i) => i + 1);
  };

  const calculateEndTime = (duration: number) => {
    if (!formData.startTime) return '';
    const startIndex = dayTimes.indexOf(formData.startTime);
    const endIndex = startIndex + duration;
    return endIndex < dayTimes.length ? dayTimes[endIndex] : dayTimes[dayTimes.length - 1];
  };

  const calculateDuration = (endTime: string) => {
    if (!formData.startTime) return 1;
    const startIndex = dayTimes.indexOf(formData.startTime);
    const endIndex = dayTimes.indexOf(endTime);
    return endIndex >= startIndex ? (endIndex - startIndex) : 1;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const duration = parseInt(e.target.value);
    const endTime = calculateEndTime(duration);
    setFormData(prev => ({ ...prev, duration, endTime }));
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const endTime = e.target.value;
    const duration = calculateDuration(endTime);
    setFormData(prev => ({ ...prev, endTime, duration }));
  };

  return (
    <div className="event-form-popup">
      <h4>{isEditing ? 'Veranstaltung bearbeiten' : 'Neue Veranstaltung'}</h4>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        
        <div className="form-group">
          <label>Tag:</label>
          <select name="day" value={formData.day} onChange={handleChange} required>
            <option value="">Bitte wählen</option>
            {availableDays.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Startzeit:</label>
          <select name="startTime" value={formData.startTime} onChange={handleChange} required>
             {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Dauer (Blöcke):</label>
          <select name="duration" value={formData.duration} onChange={handleDurationChange} required>
             {getAvailableDurations().map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Endzeit:</label>
          <select name="endTime" value={formData.endTime} onChange={handleEndTimeChange} required>
             {getAvailableEndTimes().map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Typ:</label>
          <select name="typeOf" value={formData.typeOf} onChange={handleChange} required>
            <option value="">Bitte wählen</option>
            {['Vorlesung', 'Uebung', 'Praktikum', 'Tutorium', 'Seminar'].map(t => (
                <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Dozent:</label>
          <select name="lecturerId" value={formData.lecturerId} onChange={handleChange} required>
            <option value="">Bitte wählen</option>
            {lecturers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Raum:</label>
          <select name="roomId" value={formData.roomId} onChange={handleChange} required>
            <option value="">Bitte wählen</option>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.roomName}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Name der Veranstaltung:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-buttons">
          <button type="submit">{isEditing ? 'Speichern' : 'Hinzufügen'}</button>
          <button type="button" onClick={onCancel}>Abbrechen</button>
          {isEditing && onDelete && (
            <button type="button" className="delete-button" onClick={onDelete}>Löschen</button>
          )}
        </div>
      </form>
    </div>
  );
};


// Die Zelle im Stundenplan - bekommt jetzt direkt die Lecture
const TimetableCell = ({
  day,
  timeSlot,
  timeSlots,
  lectures, // Das sind jetzt echte Lecture-Objekte
  onClick,
  rooms,
  lecturers
}: {
  day: string;
  timeSlot: string;
  timeSlots: string[];
  lectures: Lecture[];
  onClick: (e: React.MouseEvent, lecture?: Lecture) => void;
  rooms: RoomWithStatus[];
  lecturers: any[];
}) => {
  
  // Wir suchen eine Lecture, die an diesem Tag zu dieser Zeit stattfindet
  const lecture = lectures.find(l => {
    if (l.day !== day) return false;
    
    // Einfache Prüfung: Startzeit stimmt überein
    // (Für komplexere Überlappungen müsste man Minuten berechnen, aber hier nutzen wir Strings)
    return l.startTime === timeSlot;
  });

  // Prüfen, ob wir uns IN einer laufenden Lecture befinden (aber nicht am Start)
  // Das ist nötig, damit die Zelle weiß, ob sie von einer Lecture "überdeckt" wird
  const isCoveredByLecture = lectures.find(l => {
    if (l.day !== day) return false;
    const startIdx = timeSlots.indexOf(l.startTime);
    const endIdx = timeSlots.indexOf(l.endTime); // endTime muss in timeSlots existieren oder Mapping nötig
    const currentIdx = timeSlots.indexOf(timeSlot);
    return currentIdx > startIdx && currentIdx < endIdx;
  });

  // Wenn wir in einem laufenden Block sind, rendern wir NICHTS (damit der rowspan wirken kann)
  // oder wir rendern eine leere Zelle, wenn wir kein rowspan nutzen.
  // Hier nutzen wir CSS absolute positioning im Builder, also rendern wir einfach leer.
  // ACHTUNG: Der Builder nutzt rowspan nicht, sondern absolute Divs IN der ersten Zelle.
  
  // Helper für Darstellung
  const getEventClass = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'vorlesung': return 'event-lecture';
      case 'uebung': return 'event-exercise';
      case 'praktikum': return 'event-practical-course';
      default: return 'event-other';
    }
  };

  // Namen auflösen
  const roomName = rooms.find(r => r.id === lecture?.roomId)?.roomName || lecture?.roomId;
  const profName = lecturers.find(l => l.id === lecture?.professor)?.name || lecture?.professor;

  // Dauer berechnen für Höhe
  const getDuration = (l: Lecture) => {
      const startIdx = timeSlots.indexOf(l.startTime);
      // Wenn Endzeit nicht in der Liste ist (z.B. 10:00), müssen wir sie finden
      // Einfachheitshalber: Wir nehmen an, endTime matched einen Slot oder wir berechnen Differenz
      // Hier Fallback:
      const endIdx = timeSlots.indexOf(l.endTime);
      if (startIdx === -1 || endIdx === -1) return 1;
      return endIdx - startIdx;
  };

  return (
    <td
      className={`time-slot ${lecture ? 'occupied' : ''}`}
      onClick={(e) => onClick(e, lecture)} // Klick auf Zelle
      style={{
        position: 'relative',
        height: '60px',
        border: isCoveredByLecture ? 'none' : '1px solid #ddd',
        padding: 0
      }}
    >
      {lecture && (
        <div
          className={`event-container ${getEventClass(lecture.type)}`}
          style={{
            height: `${getDuration(lecture) * 60}px`,
            position: 'absolute',
            top: 0, left: 0, right: 0, zIndex: 10
          }}
        >
          <div className="event-info">
            <div className="event-name">{lecture.name}</div>
            <div className="event-details">
              {profName} | {roomName} | {lecture.type}
            </div>
          </div>
        </div>
      )}
    </td>
  );
};


const TimetableBuilder: React.FC<TimetableBuilderProps> = ({ courseOfStudy, semester, year }) => {
  const [includeSaturday, setIncludeSaturday] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);

  // WICHTIG: Wir holen NUR noch classes (Lectures). Keine Timetables/Events mehr.
  const { classes, rooms, lecturers, modules, addLecture, removeLecture } = useData();

  const initialFormData: UIEventFormData = {
    day: '',
    startTime: '08:00',
    endTime: '08:50',
    name: '',
    typeOf: '',
    duration: 1,
    lecturerId: '',
    roomId: ''
  };

  const [formData, setFormData] = useState<UIEventFormData>(initialFormData);

  // Filter: Wir zeigen nur Lectures an, die zum gewählten Semester/Jahr passen
  // ACHTUNG: Da 'courseOfStudy' im Lecture Model fehlt, filtern wir hier nur nach Datum.
  // Du müsstest das Lecture Model erweitern oder 'subject' dafür nutzen.
  const currentSemesterLectures = useMemo(() => {
    return classes.filter(lecture => {
      if (!lecture.startDate) return true; // Fallback wenn kein Datum

      // Datumsparser (DD.MM.YYYY)
      const parseDate = (str: string) => {
        const [d, m, y] = str.split('.');
        return new Date(`${y}-${m}-${d}`);
      };

      try {
          const start = parseDate(lecture.startDate);
          // Check ob das Jahr passt (grobe Prüfung)
          return start.getFullYear() === year;
      } catch (e) {
          return true; 
      }
    });
  }, [classes, year, semester]); // courseOfStudy müsste hier auch rein, wenn im Model vorhanden


  const handleCellClick = (e: React.MouseEvent, lecture?: Lecture) => {
    if (lecture) {
      // Editieren
      setEditingLecture(lecture);
      
      // Zeit Slots berechnen für Dauer
      const startIdx = dayTimes.indexOf(lecture.startTime);
      const endIdx = dayTimes.indexOf(lecture.endTime);
      const duration = (startIdx > -1 && endIdx > -1) ? endIdx - startIdx : 1;

      setFormData({
        id: lecture.id,
        day: lecture.day,
        startTime: lecture.startTime,
        endTime: lecture.endTime,
        name: lecture.name,
        typeOf: lecture.type,
        duration: duration,
        lecturerId: lecture.professor, // Ist jetzt eine ID
        roomId: lecture.roomId // Ist eine ID
      });
    } else {
      // Neu erstellen (Daten aus Klickposition könnte man hier übernehmen, wenn man wollte)
      setEditingLecture(null);
      setFormData(initialFormData);
    }
    setShowForm(true);
  };

  const handleFormSubmit = async () => {
    // Validierung
    if (!formData.day || !formData.startTime || !formData.name || !formData.lecturerId || !formData.roomId) {
      alert('Bitte alle Felder ausfüllen');
      return;
    }

    // Wenn wir editieren: Altes löschen (einfachste Art des Updates bei Immutable Data)
    // oder Update-Funktion nutzen, falls vorhanden.
    if (editingLecture && editingLecture.id) {
       await removeLecture(editingLecture.id);
    }

    // Neue Lecture erstellen
    const newLecture: any = { // 'any' oder Omit<Lecture, 'id'>, damit TS nicht meckert
      name: formData.name,
      type: formData.typeOf as LectureType,
      professor: formData.lecturerId, // ID speichern
      roomId: formData.roomId,        // ID speichern
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
      // Semesterdaten setzen für Filterung
      startDate: (semester === "Winter") ? `01.10.${year}` : `01.04.${year}`,
      endDate: (semester === "Winter") ? `31.01.${year + 1}` : `31.07.${year}`,
      subject: courseOfStudy // Wir "missbrauchen" Subject für den Studiengang, damit wir filtern können
    };

    await addLecture(newLecture);

    setShowForm(false);
    setFormData(initialFormData);
  };

  const handleDelete = async () => {
    if (editingLecture && editingLecture.id) {
      await removeLecture(editingLecture.id);
      setShowForm(false);
      setFormData(initialFormData);
    }
  };

  return (
    <div className="timetable-builder">
      <h3>Stundenplan: {courseOfStudy}, {semester} Semester, {year}</h3>

      <div className="flex items-center gap-2 mb-4">
        <Switch
          id='include-saturday'
          checked={includeSaturday}
          onCheckedChange={setIncludeSaturday}
        />
        <Label htmlFor="include-saturday">Samstag anzeigen</Label>
      </div>

      <div className="timetable-container">
        <table className="timetable">
          <thead>
            <tr>
              <th className='day-column'>Tag</th>
              <th className='time-column'>Zeit</th>
              {/* Spaltenüberschrift leer lassen oder entfernen */}
              <th>Veranstaltungen</th>
            </tr>
          </thead>
          <tbody>
            {(includeSaturday ? [...initialDays, 'Saturday'] : initialDays).map((day: string) => (
              <React.Fragment key={day}>
                {timeSlots.map((timeSlot) => (
                  <tr key={`${day}-${timeSlot}`}>
                    <td className='day-column'>{day}</td>
                    <td className='time-column'>{timeSlot}</td>
                    
                    {/* Zelle für den Inhalt */}
                    <TimetableCell
                        day={day}
                        timeSlot={timeSlot}
                        timeSlots={dayTimes} // Nutze dayTimes für Index-Suche (enthält alle Zeiten)
                        lectures={currentSemesterLectures}
                        onClick={handleCellClick}
                        rooms={rooms}
                        lecturers={lecturers}
                      />
                  </tr>
                ))}
                <tr className="day-separator">
                   {/* Colspan anpassen */}
                  <td colSpan={3}></td>
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
            onCancel={() => { setShowForm(false); setFormData(initialFormData); }}
            onDelete={handleDelete}
            isEditing={!!editingLecture}
            includeSaturday={includeSaturday}
            lecturers={lecturers}
            rooms={rooms}
            modules={modules}
          />
        </div>
      )}
    </div>
  );
};

export default TimetableBuilder;