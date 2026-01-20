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

// import TimetableBuilder from './timetablebuilder/TimetableBuilder';
import TimetableBuilder from './timetablebuilder/TimetableBuilderNew';

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

      {/* PDF-Export Button */}
      {/* <Card className="p-6">
          <Button
            className="w-full"
          >
            PDF-Export
          </Button>
      </Card> */}

    </div>
  );
};
