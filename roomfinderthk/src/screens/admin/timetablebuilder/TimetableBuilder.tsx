import React, { useState, useCallback } from 'react';
import EntryModal from './EntryModal';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/DataContext';
import { Lecture, LectureType } from '@/models';

import './timetablebuilder.css';

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

interface TimetableCellProps {
  day: string;
  slot: string;
  lectures: Lecture[];
  rooms: any[];
  lecturers: any[];
  onCellClick: (lec: any | null, day?: string, slot?: string) => void;
  onDropLecture: (lectureId: string, newDay: string, newStart: string) => void;
  onStartDrag: (e: React.PointerEvent, lec: any) => void;
  pointerDrag: {lec:any;x:number;y:number} | null;
  layoutMap: Record<string, { col: number; cols: number }>;
}

const TimetableCell: React.FC<TimetableCellProps> = ({
  day,
  slot,
  lectures,
  rooms,
  lecturers,
  onCellClick,
  onDropLecture,
  onStartDrag,
  pointerDrag,
  layoutMap,
}) => {
  const currentLectures = lectures.filter((l: any) => l.day === day && l.startTime === slot);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // set explicit effect so cursor shows move
    e.dataTransfer.dropEffect = 'move';
    // highlight cell itself (use parent if coming from card)
    const target = e.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
    // support both custom and plain text types
    const lectureId = e.dataTransfer.getData("lectureId") || e.dataTransfer.getData("text/plain");
    if (lectureId) {
      // ignore drops that don't change position
      const lec = lectures.find(l => l.id === lectureId);
      if (lec && lec.day === day && lec.startTime === slot) return;
      onDropLecture(lectureId, day, slot);
    }
  };

  return (
    <td 
      className="timetable-cell" 
      data-day={day}
      data-slot={slot}
      onClick={() => onCellClick(null, day, slot)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragOverCapture={handleDragOver}
      onDropCapture={handleDrop}
    >
      <div className="cell-content-wrapper">
        {currentLectures.map((lec: any) => {
          const duration = TimeUtils.calculateDuration(lec.startTime, lec.endTime);
          const room = rooms.find((r: any) => r.id === lec.roomId)?.roomName || 'N.N.';
          const prof = lecturers.find((p: any) => p.id === lec.professor)?.name || 'Dozent N.N.';
          const layout = layoutMap[lec.id!] || { col: 0, cols: 1 };
          const widthPct = 100 / layout.cols;
          const leftPct = layout.col * widthPct;

          return (
            <div
              key={lec.id}
              onPointerDown={(e) => onStartDrag(e, lec)}
              onClick={(e) => { e.stopPropagation(); onCellClick(lec); }}
              className={`lecture-card type-${lec.type.toLowerCase()} ${pointerDrag?.lec.id === lec.id ? 'dragging' : ''}`}
              style={{
                position: 'absolute',
                top: 0,
                left: `${leftPct}%`,
                width: `${widthPct}%`,
                height: `calc(${duration * 100}% + ${(duration - 1) * 2}px)`,
                zIndex: TimeUtils.slots.indexOf(lec.startTime) + 1 // later start = higher z
              }}
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
  
  const [showSat, setShowSat] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [modalDefaults, setModalDefaults] = useState<{ day: string; slot: string }>({ day: 'Monday', slot: '08:00' });

  // new view state: week or single day
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState('Monday');

  // layout map for overlapping lectures (day independent)
  const layoutMap = React.useMemo(() => {
    const all = classes.filter((l: any) => l.subject === courseOfStudy);

    const timesOverlap = (a: any, b: any) => {
      const as = TimeUtils.slots.indexOf(a.startTime);
      const ae = TimeUtils.slots.indexOf(a.endTime);
      const bs = TimeUtils.slots.indexOf(b.startTime);
      const be = TimeUtils.slots.indexOf(b.endTime);
      return as < be && bs < ae;
    };

    const map: Record<string, { col: number; cols: number }> = {};

    // compute per-day groups so lectures on different days don't influence each other
    const daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    daysOfWeek.forEach(day => {
      const lecturesForDay = all.filter(l => l.day === day);
      const groups: any[][] = [];
      lecturesForDay.sort((a: any, b: any) =>
        TimeUtils.slots.indexOf(a.startTime) - TimeUtils.slots.indexOf(b.startTime)
      );
      lecturesForDay.forEach((lec: any) => {
        let placed = false;
        for (const grp of groups) {
          if (grp.some((g) => timesOverlap(lec, g))) {
            grp.push(lec);
            placed = true;
            break;
          }
        }
        if (!placed) groups.push([lec]);
      });

      groups.forEach((grp) => {
        const colsEnd: number[] = [];
        grp.sort(
          (a, b) =>
            TimeUtils.slots.indexOf(a.startTime) -
            TimeUtils.slots.indexOf(b.startTime)
        );
        grp.forEach((lec: any) => {
          const s = TimeUtils.slots.indexOf(lec.startTime);
          const dur = TimeUtils.calculateDuration(lec.startTime, lec.endTime);
          const e = s + dur;
          let assigned = false;
          for (let i = 0; i < colsEnd.length; i++) {
            if (s >= colsEnd[i]) {
              colsEnd[i] = e;
              map[lec.id!] = { col: i, cols: colsEnd.length };
              assigned = true;
              break;
            }
          }
          if (!assigned) {
            colsEnd.push(e);
            map[lec.id!] = { col: colsEnd.length - 1, cols: colsEnd.length };
          }
        });
        const total = colsEnd.length;
        grp.forEach((lec: any) => {
          if (map[lec.id!]) map[lec.id!].cols = total;
        });
      });
    });

    return map;
  }, [classes, courseOfStudy]);


  // compute allowed days based on saturday toggle
  const allowedDays = showSat
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // make sure selectedDay stays valid when allowedDays change
  React.useEffect(() => {
    if (!allowedDays.includes(selectedDay)) {
      setSelectedDay(allowedDays[0]);
    }
  }, [allowedDays, selectedDay]);

  // decide which days to render based on view mode
  const days = viewMode === 'week' ? allowedDays : [selectedDay];
  const timeSlots = TimeUtils.slots.slice(0, -1);

  const handleOpenEditor = (lec?: any, day?: string, slot?: string) => {
    setActiveLecture(lec || null);
    setModalDefaults({
      day: day || selectedDay || 'Monday',
      slot: slot || '08:00',
    });
    setModalOpen(true);
  };

  // pointer drag state for touch/mobile and desktop fallback
  const [pointerDrag, setPointerDrag] = useState<{lec:any;x:number;y:number}|null>(null);
  const pointerDragRef = React.useRef<{lec:any;x:number;y:number}|null>(null);
  const lastCellRef = React.useRef<HTMLElement | null>(null);

  const onPointerMove = useCallback((e: PointerEvent) => {
    const prev = pointerDragRef.current;
    if (prev) {
      const updated = { ...prev, x: e.clientX, y: e.clientY };
      pointerDragRef.current = updated;
      setPointerDrag(updated);
    }
    const elem = document.elementFromPoint(e.clientX, e.clientY);
    const cell = elem?.closest('.timetable-cell') as HTMLElement | null;
    if (cell !== lastCellRef.current) {
      if (lastCellRef.current) lastCellRef.current.classList.remove('drag-over');
      if (cell) cell.classList.add('drag-over');
      lastCellRef.current = cell;
    }
  }, []);

  const handleDropLecture = useCallback(async (lectureId: string, newDay: string, newStart: string) => {
    const lec = classes.find((l: any) => l.id === lectureId);
    if (!lec) return;

    const duration = TimeUtils.calculateDuration(lec.startTime, lec.endTime);
    
    try {
      await removeLecture(lec.id!);
      await addLecture({
        ...lec,
        day: newDay,
        startTime: newStart,
        endTime: TimeUtils.calculateEndTime(newStart, duration)
      });
    } catch (e) {
      console.error("Fehler beim Verschieben:", e);
    }
  }, [classes, addLecture, removeLecture]);

  const onPointerUp = useCallback((e: PointerEvent) => {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    document.body.classList.remove('dragging-any');
    if (lastCellRef.current) {
      lastCellRef.current.classList.remove('drag-over');
      const cell = lastCellRef.current;
      lastCellRef.current = null;
      const drag = pointerDragRef.current;
      if (drag) {
        const day = cell.getAttribute('data-day') || '';
        const slot = cell.getAttribute('data-slot') || '';
        if (!(drag.lec.day === day && drag.lec.startTime === slot)) {
          console.log('dropping', drag.lec.id, day, slot);
          handleDropLecture(drag.lec.id, day, slot);
        }
      }
    }
    pointerDragRef.current = null;
    setPointerDrag(null);
  }, [handleDropLecture]);

  const startPointerDrag = useCallback((e: React.PointerEvent, lec: any) => {
    e.preventDefault();
    const initial = { lec, x: e.clientX, y: e.clientY };
    pointerDragRef.current = initial;
    setPointerDrag(initial);
    document.body.classList.add('dragging-any');
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }, [onPointerMove, onPointerUp]);


  return (
    <div className="builder-screen" id="timetable-to-export">
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

          {/* view selector: week or day */}
          {/* modern toggle for week/day view */}
          <div className="control-group view-toggle">
            <button
              className={viewMode === 'week' ? 'active' : ''}
              onClick={() => setViewMode('week')}
            >
              Woche
            </button>
            <button
              className={viewMode === 'day' ? 'active' : ''}
              onClick={() => setViewMode('day')}
            >
              Tag
            </button>
          </div>

          {viewMode === 'day' && (
            <div className="control-group day-toggle">
              {allowedDays.map(d => (
                <button
                  key={d}
                  className={selectedDay === d ? 'active' : ''}
                  onClick={() => setSelectedDay(d)}
                >
                  {TimeUtils.getGermanDay(d)}
                </button>
              ))}
            </div>
          )}

              <button className="btn-primary" onClick={() => handleOpenEditor()}>
            + Neuer Eintrag
          </button>
        </div>
      </header>

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
                      onDropLecture={handleDropLecture}
                      onStartDrag={startPointerDrag}
                      pointerDrag={pointerDrag}
                      layoutMap={layoutMap}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {pointerDrag && (
        <div
          className="drag-ghost"
          style={{
            position: 'fixed',
            top: pointerDrag.y + 5,
            left: pointerDrag.x + 5,
            pointerEvents: 'none',
            zIndex: 2000,
            background: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: '0.75rem',
            fontWeight: '700',
          }}
        >
          {pointerDrag.lec.name}
        </div>
      )}

      <EntryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        rooms={rooms}
        lecturers={lecturers}
        timeSlots={timeSlots}
        allowedDays={allowedDays}
        initialDay={modalDefaults.day}
        initialSlot={modalDefaults.slot}
        activeLecture={activeLecture}
        onSave={async (formData, lecture) => {
          if (lecture) await removeLecture(lecture.id!);
          await addLecture({
            name: formData.name,
            type: formData.type,
            professor: formData.prof,
            roomId: formData.room,
            day: formData.day,
            startTime: formData.start,
            endTime: TimeUtils.calculateEndTime(formData.start, formData.duration),
            subject: courseOfStudy,
            startDate: semester === 'Winter' ? `01.10.${year}` : `01.04.${year}`,
            endDate: semester === 'Winter' ? `31.03.${year + 1}` : `30.09.${year}`,
          });
        }}
        onDelete={async (id) => {
          await removeLecture(id);
        }}
      />
    </div>
  );
};

export default TimetableBuilder;