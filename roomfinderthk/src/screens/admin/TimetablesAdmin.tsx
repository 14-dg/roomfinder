import { useEffect, useState } from 'react';
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
import { scheduler } from 'timers/promises';

const schedule = {
  days: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'],
  times: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  events: [
    { id: 1, name: 'Mathe', startTime: '08:00', endTime: '10:00', day: 'Montag' },
    { id: 2, name: 'Englisch', startTime: '10:00', endTime: '12:00', day: 'Montag' },
    { id: 3, name: 'Biologie', startTime: '13:00', endTime: '15:00', day: 'Dienstag' },
    { id: 4, name: 'Chemie', startTime: '15:00', endTime: '17:00', day: 'Dienstag' },
    { id: 5, name: 'Sport', startTime: '09:00', endTime: '11:00', day: 'Mittwoch' },
    { id: 6, name: 'Kunst', startTime: '11:00', endTime: '13:00', day: 'Mittwoch' },
    { id: 7, name: 'Geschichte', startTime: '08:00', endTime: '10:00', day: 'Donnerstag' },
    { id: 8, name: 'Physik', startTime: '10:00', endTime: '12:00', day: 'Donnerstag' },
    { id: 9, name : 'test', startTime: '08:00', endTime: '12:00', day: 'Montag' },
  ],
};

export default function TimetablesAdmin() {
  const [courseOfStudy, setCourseOfStudy] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());

  const coursesOfStudy = ['Technische Informatik', 'Elektrotechnik', 'Medientechnologie'];

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

      {isFormComplete &&
        <Card className="p-6">
          <TimetableBuilder courseOfStudy={courseOfStudy} semester={semester} year={year} />
        </Card>
      }

      <Card className="p-6">
        {/* PDF-Export Button */}
          <Button
            className="w-full"
          >
            PDF-Export
          </Button>
      </Card>

    </div>
  );
};
