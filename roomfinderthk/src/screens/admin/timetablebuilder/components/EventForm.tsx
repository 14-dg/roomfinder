import React, { useState } from 'react';
import { EventFormProps } from '../types';
import { timeSlots, dayTimes, typeOptions, initialDays } from '../constants';

const EventForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  onDelete,
  isEditing,
  includeSaturday,
  lecturers,
  rooms,
  modules,
  addModule
}: EventFormProps) => {
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

        <div className="form-group">
          <label>Endzeit:</label>
          <select
            name="endTime"
            value={formData.endTime || ''}
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
              <option key={room.id} value={room.id}>{room.roomName}</option>
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

export default EventForm;
