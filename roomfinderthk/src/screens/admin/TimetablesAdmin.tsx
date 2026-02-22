import { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TimetableBuilder from './timetablebuilder/TimetableBuilder';
import { useData } from '@/contexts/DataContext';

// same TimeUtils as timetablebuilder (could be exported there but copy is fine)
const TimeUtils = {
  slots: ['08:00', '08:50', '09:45', '10:35', '11:30', '12:20', '13:15', '14:05', '15:00', '15:50', '16:45', '17:35', '18:30', '19:20', '20:15'],
  getGermanDay: (day: string) => {
    const days: any = { Monday: 'Montag', Tuesday: 'Dienstag', Wednesday: 'Mittwoch', Thursday: 'Donnerstag', Friday: 'Freitag', Saturday: 'Samstag' };
    return days[day] || day;
  }
};

export default function TimetablesAdmin() {
  const [courseOfStudy, setCourseOfStudy] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [isExporting, setIsExporting] = useState(false); // Neuer Lade-State

  const coursesOfStudy = ['Technische Informatik', 'Elektrotechnik', 'Medientechnologie'];


  const { classes, rooms, lecturers } = useData();

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // build temporary container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '800px';
      container.style.background = '#f8fafc';
      container.style.color = '#1e293b';
      container.style.fontFamily = 'Inter, system-ui, sans-serif';
      container.style.padding = '1rem';

      const header = document.createElement('div');
      header.innerHTML = `<h2 style="text-align:center;">${courseOfStudy}</h2><p style="text-align:center;">${semester}semester ${year}/${year + 1}</p><hr/>`;
      container.appendChild(header);

      const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const timeSlots = TimeUtils.slots.slice(0, -1);

      days.forEach(day => {
        const daySection = document.createElement('div');
        daySection.style.marginBottom = '2rem';

        const dayTitle = document.createElement('h3');
        dayTitle.textContent = TimeUtils.getGermanDay(day);
        daySection.appendChild(dayTitle);

        const table = document.createElement('table');
        table.className = 'timetable-grid';
        table.style.width = '100%';
        const thead = document.createElement('thead');
        thead.innerHTML = '<tr><th class="time-col-header">Zeit</th><th class="day-col-header">' + TimeUtils.getGermanDay(day) + '</th></tr>';
        table.appendChild(thead);
        const tbody = document.createElement('tbody');

        timeSlots.forEach(slot => {
          const row = document.createElement('tr');
          const timeCell = document.createElement('td');
          timeCell.className = 'time-label';
          timeCell.textContent = slot;
          row.appendChild(timeCell);

          const cell = document.createElement('td');
          cell.className = 'timetable-cell';
          cell.style.position = 'relative';

          const lecturesForSlot = classes.filter(
            l => l.subject === courseOfStudy && l.day === day && l.startTime === slot
          );

          if (lecturesForSlot.length) {
            const wrapper = document.createElement('div');
            wrapper.className = 'cell-content-wrapper';
            lecturesForSlot.forEach(l => {
              const duration = TimeUtils.slots.indexOf(l.endTime) - TimeUtils.slots.indexOf(l.startTime);
              const roomName = rooms.find(r => r.id === l.roomId)?.roomName || '';
              const profName = lecturers.find(p => p.id === l.professor)?.name || '';
              const card = document.createElement('div');
              card.className = `lecture-card type-${l.type.toLowerCase()}`;
              card.style.position = 'absolute';
              card.style.top = '0';
              card.style.left = '0';
              card.style.width = '100%';
              card.style.height = `calc(${duration * 100}% + ${(duration - 1) * 2}px)`;
              card.innerHTML = `<div class="card-inner"><span class="card-title">${l.name}</span><div class="card-meta"><span class="meta-item">📍 ${roomName}</span>${
                duration > 1 ? `<span class="meta-item">👤 ${profName}</span>` : ''
              }</div></div>`;
              wrapper.appendChild(card);
            });
            cell.appendChild(wrapper);
          }
          row.appendChild(cell);
          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        daySection.appendChild(table);
        container.appendChild(daySection);
      });

      document.body.appendChild(container);
      const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: false, backgroundColor: '#f8fafc' });
      document.body.removeChild(container);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Stundenplan_${courseOfStudy}_${semester}_${year}.pdf`);
    } catch (error) {
      console.error("PDF Export fehlgeschlagen:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const isFormComplete = courseOfStudy !== '' && semester !== '' && year > 1999;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Choose Timetable</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Course of Study*/}
          <div>
            <Label htmlFor="courseOfStudy">Course of Study</Label>
            <Select
              value={courseOfStudy}
              onValueChange={setCourseOfStudy}  
            >
              <SelectTrigger id="courseOfStudy" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {coursesOfStudy.map((courseOfStudy) => (
                  <SelectItem key={courseOfStudy} value={courseOfStudy}>
                    {courseOfStudy}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Semester */}
          <div>
            <Label htmlFor="semester">Semester</Label>
            <Select
              value={semester}
              onValueChange={setSemester}
            >
              <SelectTrigger id="semester" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Winter", "Summer"].map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester} Semester
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="Year"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              min={2000}
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      {isFormComplete && (
        <>
          <Card className="p-6">
            <TimetableBuilder courseOfStudy={courseOfStudy} semester={semester} year={year} />
          </Card>

          <Card className="p-6">
            <Button
              className="w-full"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? 'Generiere PDF...' : 'PDF-Export herunterladen'}
            </Button>
          </Card>
        </>
      )}
    </div>
  );
}