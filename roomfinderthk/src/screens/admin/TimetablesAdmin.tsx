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

export default function TimetablesAdmin() {
  const [courseOfStudy, setCourseOfStudy] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [isExporting, setIsExporting] = useState(false); // Neuer Lade-State

  const coursesOfStudy = ['Technische Informatik', 'Elektrotechnik', 'Medientechnologie'];


  const handleExportPDF = async () => {
    const element = document.getElementById('timetable-to-export');
    if (!element) return;

    setIsExporting(true);
    try {
      // Screenshot vom Element erstellen
      const canvas = await html2canvas(element, {
        scale: 2, // Höhere Qualität
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc' // Gleicher Hintergrund wie im CSS
      });

      const imgData = canvas.toDataURL('image/png');
      
      // PDF im Querformat (Landscape) erstellen
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

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