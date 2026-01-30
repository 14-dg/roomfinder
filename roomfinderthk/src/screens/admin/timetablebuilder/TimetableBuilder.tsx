import React, { useState, useMemo, useCallback } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/DataContext';
import { RoomWithStatus, Lecture, LectureType, Lecturer } from '@/models';

// Import des externen Stylesheets
import './timetablebuilder.css';

/**
 * Hilfsklasse für die Zeitberechnungen (Sekretariats-Logik: Blöcke statt Minuten)
 */
const TimeUtils = {
  slots: ['08:00', '08:50', '09:45', '10:35', '11:30', '12:20', '13:15', '14:05', '15:00', '15:50', '16:45', '17:35', '18:30', '19:20', '20:15'],
  
  calculateEndTime: (start: string, blocks: number): string => {
    const startIndex = TimeUtils.slots.indexOf(start);
    if (startIndex === -1) return TimeUtils.slots[1];
    const endIndex = Math.min(startIndex + blocks, TimeUtils.slots.length - 1);
    return TimeUtils.slots[endIndex];
  },

  calculateDuration: (start: string, end: string): number => {
    const sIdx = TimeUtils.slots.indexOf(start);
    const eIdx = TimeUtils.slots.indexOf(end);
    return sIdx === -1 || eIdx === -1 ? 1 : Math.max(1, eIdx - sIdx);
  },

  getGermanDay: (day: string) => {
    const days: any = { Monday: 'Montag', Tuesday: 'Dienstag', Wednesday: 'Mittwoch', Thursday: 'Donnerstag', Friday: 'Freitag', Saturday: 'Samstag' };
    return days[day] || day;
  }
};

/**
 * Sub-Komponente für eine Tabellenzelle
 */
const TimetableCell: React.FC<any> = ({ day, slot, lectures, rooms, lecturers, onCellClick }) => {
  const currentLectures = lectures.filter((l: any) => l.day === day && l.startTime === slot);

  return (
    <td className="timetable-cell" onClick={() => onCellClick(null, day, slot)}>
      <div className="cell-content-wrapper">
        {currentLectures.map((lec: any) => {
          const duration = TimeUtils.calculateDuration(lec.startTime, lec.endTime);
          const room = rooms.find((r: any) => r.id === lec.roomId)?.roomName || 'N.N.';
          const prof = lecturers.find((p: any) => p.id === lec.professor)?.name || 'Dozent N.N.';

          return (
            <div
              key={lec.id}
              onClick={(e) => { e.stopPropagation(); onCellClick(lec); }}
              className={`lecture-card type-${lec.type.toLowerCase()}`}
              style={{ height: `calc(${duration * 100}% + ${(duration - 1) * 2}px)` }}
            >
              <div className="card-inner">
                <span className="card-title">{lec.name}</span>
                <div className="card-meta">
                  <span className="meta-item">📍 {room}</span>
                  {duration > 1 && <span className="meta-item">👤 {prof}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cell-hover-hint">Hinzufügen +</div>
    </td>
  );
};

export const TimetableBuilder: React.FC<any> = ({ courseOfStudy, semester, year }) => {
  const { classes, rooms, lecturers, addLecture, removeLecture } = useData();
  
  // UI States
  const [showSat, setShowSat] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);

  // Formular State
  const [form, setForm] = useState({
    name: '', day: 'Monday', start: '08:00', duration: 1, type: 'Vorlesung' as LectureType, room: '', prof: ''
  });

  const days = showSat ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = TimeUtils.slots.slice(0, -1); // Letzten Slot nicht als Startzeit anbieten

  const handleOpenEditor = (lec?: any, day?: string, slot?: string) => {
    if (lec) {
      setActiveLecture(lec);
      setForm({
        name: lec.name, day: lec.day, start: lec.startTime,
        duration: TimeUtils.calculateDuration(lec.startTime, lec.endTime),
        type: lec.type, room: lec.roomId, prof: lec.professor
      });
    } else {
      setActiveLecture(null);
      setForm({
        name: '', day: day || 'Monday', start: slot || '08:00', duration: 1, type: 'Vorlesung', room: '', prof: ''
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.room || !form.prof) {
      alert("Bitte füllen Sie Titel, Raum und Dozent aus.");
      return;
    }

    setIsSaving(true);
    try {
      if (activeLecture) await removeLecture(activeLecture.id!);
      
      await addLecture({
        name: form.name,
        type: form.type,
        professor: form.prof,
        roomId: form.room,
        day: form.day,
        startTime: form.start,
        endTime: TimeUtils.calculateEndTime(form.start, form.duration),
        subject: courseOfStudy,
        startDate: semester === 'Winter' ? `01.10.${year}` : `01.04.${year}`,
        endDate: semester === 'Winter' ? `31.03.${year + 1}` : `30.09.${year}`
      });
      setModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="builder-screen">
      {/* HEADER BEREICH */}
      <header className="builder-header">
        <div className="header-main">
          <div className="course-icon">{courseOfStudy.charAt(0)}</div>
          <div className="course-info">
            <h1>{courseOfStudy}</h1>
            <p>{semester}semester {year} / {year + 1}</p>
          </div>
        </div>

        <div className="header-controls">
          <div className="control-group">
            <Switch id="sat" checked={showSat} onCheckedChange={setShowSat} />
            <Label htmlFor="sat">Samstag</Label>
          </div>
          <button className="btn-primary" onClick={() => handleOpenEditor()}>
            + Neuer Eintrag
          </button>
        </div>
      </header>

      {/* KALENDER TABELLE */}
      <main className="calendar-container">
        <div className="table-card">
          <table className="timetable-grid">
            <thead>
              <tr>
                <th className="time-col-header">Zeit</th>
                {days.map(d => (
                  <th key={d} className="day-col-header">
                    {TimeUtils.getGermanDay(d)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(slot => (
                <tr key={slot}>
                  <td className="time-label">{slot}</td>
                  {days.map(day => (
                    <TimetableCell
                      key={`${day}-${slot}`}
                      day={day}
                      slot={slot}
                      lectures={classes.filter((l: any) => l.subject === courseOfStudy)}
                      rooms={rooms}
                      lecturers={lecturers}
                      onCellClick={handleOpenEditor}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* EINGABE-DIALOG (MODAL) */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{activeLecture ? 'Eintrag bearbeiten' : 'Termin planen'}</h2>
              <button className="close-btn" onClick={() => setModalOpen(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="input-group full">
                <label>Veranstaltungstitel</label>
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="z.B. Einführung in die BWL"
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Tag</label>
                  <select value={form.day} onChange={e => setForm({...form, day: e.target.value})}>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                      <option key={d} value={d}>{TimeUtils.getGermanDay(d)}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Dauer (Blöcke à 45 Min)</label>
                  <div className="block-picker">
                    {[1, 2, 3, 4].map(n => (
                      <button 
                        key={n}
                        className={form.duration === n ? 'active' : ''}
                        onClick={() => setForm({...form, duration: n})}
                      >{n}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label>Typ</label>
                <div className="type-picker">
                  {['Vorlesung', 'Uebung', 'Praktikum', 'Seminar'].map(t => (
                    <button 
                      key={t}
                      className={form.type === t ? 'active' : ''}
                      onClick={() => setForm({...form, type: t as any})}
                    >{t}</button>
                  ))}
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Dozent/in</label>
                  <select value={form.prof} onChange={e => setForm({...form, prof: e.target.value})}>
                    <option value="">-- Wählen --</option>
                    {lecturers.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Raum</label>
                  <select value={form.room} onChange={e => setForm({...form, room: e.target.value})}>
                    <option value="">-- Wählen --</option>
                    {rooms.map((r: any) => <option key={r.id} value={r.id}>{r.roomName}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {activeLecture && (
                <button className="btn-delete" onClick={async () => { if(confirm('Löschen?')) { await removeLecture(activeLecture.id!); setModalOpen(false); }}}>
                  Löschen
                </button>
              )}
              <button className="btn-save" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Speichert...' : 'Termin speichern'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableBuilder;