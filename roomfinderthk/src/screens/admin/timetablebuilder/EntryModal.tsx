import React, { useEffect, useState } from 'react';
import { Lecture, LectureType } from '@/models';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: any[];
  lecturers: any[];
  timeSlots: string[];
  allowedDays: string[];
  initialDay: string;
  initialSlot: string;
  activeLecture: Lecture | null;
  onSave: (
    formData: {
      name: string;
      day: string;
      start: string;
      duration: number;
      type: LectureType;
      room: string;
      prof: string;
    },
    active: Lecture | null
  ) => Promise<void>;
  onDelete: (lectureId: string) => Promise<void>;
}

/**
 * Popup component used by the timetable builder when the user wants to create or
 * edit an entry.  All form state, validation and save/delete logic lives here
 * so the parent screen can stay focused on the calendar layout instead of the
 * details of the modal.
 */
const EntryModal: React.FC<EntryModalProps> = ({
  isOpen,
  onClose,
  rooms,
  lecturers,
  timeSlots,
  allowedDays,
  initialDay,
  initialSlot,
  activeLecture,
  onSave,
  onDelete,
}) => {
  const [form, setForm] = useState({
    name: '',
    day: initialDay,
    start: initialSlot,
    duration: 1,
    type: 'Vorlesung' as LectureType,
    room: '',
    prof: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activeLecture) {
      setForm({
        name: activeLecture.name,
        day: activeLecture.day,
        start: activeLecture.startTime,
        duration: Math.max(
          1,
          timeSlots.indexOf(activeLecture.endTime) -
            timeSlots.indexOf(activeLecture.startTime)
        ),
        type: activeLecture.type,
        room: activeLecture.roomId,
        prof: activeLecture.professor,
      });
    } else {
      setForm({
        name: '',
        day: initialDay,
        start: initialSlot,
        duration: 1,
        type: 'Vorlesung',
        room: '',
        prof: '',
      });
    }
  }, [activeLecture, initialDay, initialSlot, timeSlots]);

  const getGermanDay = (day: string) => {
    const days: any = {
      Monday: 'Montag',
      Tuesday: 'Dienstag',
      Wednesday: 'Mittwoch',
      Thursday: 'Donnerstag',
      Friday: 'Freitag',
      Saturday: 'Samstag',
    };
    return days[day] || day;
  };

  const handleSave = async () => {
    if (!form.name || !form.room || !form.prof) {
      alert('Bitte füllen Sie Titel, Raum und Dozent aus.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(form, activeLecture);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (activeLecture && window.confirm('Löschen?')) {
      await onDelete(activeLecture.id!);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{activeLecture ? 'Eintrag bearbeiten' : 'Termin planen'}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="input-group full">
            <label>Veranstaltungstitel</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="z.B. Einführung in die BWL"
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Tag</label>
              <select
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
              >
                {allowedDays.map((d) => (
                  <option key={d} value={d}>
                    {getGermanDay(d)}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Startzeit</label>
              <select
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Dauer (Blöcke)</label>
              <div className="block-picker">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    className={form.duration === n ? 'active' : ''}
                    onClick={() => setForm({ ...form, duration: n })}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>Typ</label>
            <div className="type-picker">
              {['Vorlesung', 'Uebung', 'Praktikum', 'Seminar'].map((t) => (
                <button
                  key={t}
                  className={form.type === t ? 'active' : ''}
                  onClick={() => setForm({ ...form, type: t as any })}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Dozent/in</label>
              <select
                value={form.prof}
                onChange={(e) => setForm({ ...form, prof: e.target.value })}
              >
                <option value="">-- Wählen --</option>
                {lecturers.map((l: any) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Raum</label>
              <select
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
              >
                <option value="">-- Wählen --</option>
                {rooms.map((r: any) => (
                  <option key={r.id} value={r.id}>
                    {r.roomName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {activeLecture && (
            <button className="btn-delete" onClick={handleDelete}>
              Löschen
            </button>
          )}
          <button className="btn-save" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Speichert...' : 'Termin speichern'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryModal;
