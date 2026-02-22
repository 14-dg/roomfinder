import { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  const [isExporting, setIsExporting] = useState(false); // loading state for export
  const [showSat, setShowSat] = useState(false); // whether PDF should include Saturday
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState('Monday');

  const coursesOfStudy = ['Technische Informatik', 'Elektrotechnik', 'Medientechnologie'];


  const { classes, rooms, lecturers } = useData();

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // compute layoutMap for overlapping entries
      const all = classes.filter(l => l.subject === courseOfStudy);
      const timesOverlap = (a: any, b: any) => {
        const as = TimeUtils.slots.indexOf(a.startTime);
        const ae = TimeUtils.slots.indexOf(a.endTime);
        const bs = TimeUtils.slots.indexOf(b.startTime);
        const be = TimeUtils.slots.indexOf(b.endTime);
        return as < be && bs < ae;
      };
      const layoutMap: Record<string,{col:number;cols:number}> = {};
      ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].forEach(day => {
        const lecturesForDay = all.filter(l=>l.day===day);
        const groups:any[][] = [];
        lecturesForDay.sort((a,b)=>TimeUtils.slots.indexOf(a.startTime)-TimeUtils.slots.indexOf(b.startTime));
        lecturesForDay.forEach(lec=>{
          let placed=false;
          for(const grp of groups){
            if(grp.some(g=>timesOverlap(lec,g))){grp.push(lec);placed=true;break;}
          }
          if(!placed) groups.push([lec]);
        });
        groups.forEach(grp=>{
          const colsEnd:number[]=[];
          grp.sort((a,b)=>TimeUtils.slots.indexOf(a.startTime)-TimeUtils.slots.indexOf(b.startTime));
          grp.forEach((lec:any)=>{
            const s=TimeUtils.slots.indexOf(lec.startTime);
            const dur=TimeUtils.slots.indexOf(lec.endTime)-s;
            const e=s+dur;
            let assigned=false;
            for(let i=0;i<colsEnd.length;i++){
              if(s>=colsEnd[i]){colsEnd[i]=e;layoutMap[lec.id!]={col:i,cols:colsEnd.length};assigned=true;break;}
            }
            if(!assigned){colsEnd.push(e);layoutMap[lec.id!]={col:colsEnd.length-1,cols:colsEnd.length};}
          });
          const total=colsEnd.length;
          grp.forEach((lec:any)=>{if(layoutMap[lec.id!])layoutMap[lec.id!].cols=total;});
        });
      });
      // decide which days to export based on view mode and saturday toggle
      // use the same logic as the builder so the PDF stays consistent
      const allowedDays = showSat
        ? ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
        : ['Monday','Tuesday','Wednesday','Thursday','Friday'];
      let days: string[];
      if (viewMode === 'day') {
        // single day export
        days = [selectedDay];
      } else {
        // week view should always include at least Monday–Friday
        days = [...allowedDays];
      }
      const timeSlots = TimeUtils.slots.slice(0, -1);

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
      // more prominent course title
      header.innerHTML = `<h1 style="text-align:center; font-size:2.5rem; font-weight:700; margin:0;">${courseOfStudy}</h1><p style="text-align:center; margin:0.2rem 0;">${semester}semester ${year}/${year + 1}</p><hr/>`;
      container.appendChild(header);

      days.forEach(day => {
        const daySection = document.createElement('div');
        daySection.style.marginBottom = '2rem';

        // drop day title – table header already shows the name

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

              // compute width/left based on overlapping layout map
              const mapping = layoutMap[l.id!] || { col: 0, cols: 1 };
              const widthPct = 100 / mapping.cols;
              const leftPct = (mapping.col * 100) / mapping.cols;
              card.style.width = `${widthPct}%`;
              card.style.left = `${leftPct}%`;

              card.style.height = `calc(${duration * 100}% + ${(duration - 1) * 2}px)`;
              card.style.boxSizing = 'border-box';
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
      // create a standard A4 pdf and slice the canvas if it's taller than one page
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // calculate scaled height to fit width
      const ratio = canvas.width / pdfWidth;
      const imgHeight = canvas.height / ratio;

      let position = 0;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

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
            <TimetableBuilder
              courseOfStudy={courseOfStudy}
              semester={semester}
              year={year}
              showSat={showSat}
              setShowSat={setShowSat}
              viewMode={viewMode}
              setViewMode={setViewMode}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Switch id="exportSat" checked={showSat} onCheckedChange={setShowSat} />
              <Label htmlFor="exportSat">Samstag im Export</Label>
            </div>
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