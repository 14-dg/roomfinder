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


// -------------------------------------------------------------------------
// Neue TimetableCell mit Multi-Event-Support
// -------------------------------------------------------------------------
const TimetableCell = ({
  day,
  timeSlot,
  timeSlots,
  lectures,
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
  
  // 1. Suche ALLE Lectures, die in diesem Slot starten (nicht nur eine)
  const slotLectures = lectures.filter(l => {
    return l.day === day && l.startTime === timeSlot;
  });

  // 2. Prüfen, ob dieser Slot von einer laufenden Lecture verdeckt wird 
  // (Nur für Border-Styling relevant, Rendering passiert absolut)
  const isCoveredByLecture = lectures.some(l => {
    if (l.day !== day) return false;
    const startIdx = timeSlots.indexOf(l.startTime);
    const endIdx = timeSlots.indexOf(l.endTime); 
    const currentIdx = timeSlots.indexOf(timeSlot);
    // Wir sind "covered", wenn wir zwischen Start und Ende liegen
    return currentIdx > startIdx && currentIdx < endIdx;
  });

  // Styles
  const getEventClass = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'vorlesung': return 'event-lecture';
      case 'uebung': return 'event-exercise';
      case 'praktikum': return 'event-practical-course';
      case 'tutorium': return 'event-tutorial';
      case 'seminar': return 'event-seminar';
      default: return 'event-other';
    }
  };

  // Namensauflösung (sicher)
  const getProfName = (prof: any) => {
    if (!prof) return "";
    if (typeof prof === 'object') return prof.name || "Unbekannt";
    const found = lecturers.find(l => l.id === prof);
    return found ? found.name : prof;
  };

  const getRoomName = (roomRef: any) => {
    if (!roomRef) return "";
    if (typeof roomRef === 'object') return roomRef.roomName || roomRef.name || "Unbekannt";
    const found = rooms.find(r => r.id === roomRef);
    return found ? found.roomName : roomRef;
  };

  const getDuration = (l: Lecture) => {
      const startIdx = timeSlots.indexOf(l.startTime);
      const endIdx = timeSlots.indexOf(l.endTime);
      if (startIdx === -1 || endIdx === -1) return 1;
      return endIdx - startIdx;
  };

  return (
    <td
      className={`time-slot ${slotLectures.length > 0 ? 'occupied' : ''}`}
      // Klick auf die Zelle selbst erstellt neuen Eintrag (undefined übergeben)
      onClick={(e) => onClick(e, undefined)}
      style={{
        position: 'relative',
        height: '60px',
        // Border nur anzeigen, wenn wir nicht mitten in einem Block sind
        border: isCoveredByLecture ? 'none' : '1px solid #ddd',
        padding: 0,
        verticalAlign: 'top'
      }}
    >
      {/* Wir rendern JETZT alle Lectures, die hier starten */}
      {slotLectures.map((lecture, index) => {
        
        // Dynamische Breite berechnen: 
        // Wenn 2 Lectures da sind, hat jede 50% Breite.
        const width = 100 / slotLectures.length;
        const left = width * index;

        return (
          <div
            key={lecture.id || index}
            className={`event-container ${getEventClass(lecture.type)}`}
            // Klick auf das Event stoppen, damit nicht "Neu erstellen" ausgelöst wird
            onClick={(e) => {
              e.stopPropagation(); 
              onClick(e, lecture);
            }}
            style={{
              height: `${getDuration(lecture) * 60 - 2}px`, // -2px für kleinen Gap
              position: 'absolute',
              top: 0, 
              // Nebeneinander anordnen
              left: `${left}%`, 
              width: `${width}%`,
              zIndex: 10 + index, // Damit sie sich sauber überlagern falls nötig
              borderLeft: index > 0 ? '1px solid white' : 'none', // Trennlinie
              overflow: 'hidden'
            }}
            title={`${lecture.name} (${getProfName(lecture.professor)})`}
          >
            <div className="event-info p-1">
              <div className="event-name text-xs font-bold truncate leading-tight">
                {lecture.name}
              </div>
              <div className="event-details text-[10px] truncate opacity-90">
                {getRoomName(lecture.roomId)}
              </div>
            </div>
          </div>
        );
      })}
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