import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DaySchedule, TimeSlot, Professor } from "@/models";
import { Search, User, Mail, Clock } from "lucide-react";


const mockProfessors: Professor[] = [
  { id: "1", name: "Dr. Sarah Johnson", department: "Computer Science", email: "s.johnson@uni.edu", officeHours: "Mon-Wed 14:00-16:00" },
  { id: "2", name: "Prof. Michael Chen", department: "Mathematics", email: "m.chen@uni.edu", officeHours: "Tue-Thu 10:00-12:00" },
  { id: "3", name: "Dr. Emily Brown", department: "Physics", email: "e.brown@uni.edu", officeHours: "Mon-Fri 13:00-14:00" },
  { id: "4", name: "Prof. David Wilson", department: "Chemistry", email: "d.wilson@uni.edu", officeHours: "Wed-Fri 15:00-17:00" },
  { id: "5", name: "Dr. Lisa Martinez", department: "Biology", email: "l.martinez@uni.edu", officeHours: "Mon-Thu 11:00-12:00" },
];

function generateProfessorSchedule(professorId: string): DaySchedule[] {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  const schedules: { [key: string]: TimeSlot[][] } = {
    "1": [
      [
        { start: "09:00", end: "11:00", subject: "Algorithms", room: "B201" },
        { start: "14:00", end: "16:00", subject: "Data Structures", room: "A101" },
      ],
      [
        { start: "10:00", end: "12:00", subject: "Computer Networks", room: "C302" },
      ],
      [
        { start: "09:00", end: "11:00", subject: "Algorithms", room: "B201" },
        { start: "15:00", end: "17:00", subject: "Lab Session", room: "D401" },
      ],
      [
        { start: "10:00", end: "12:00", subject: "Computer Networks", room: "C302" },
      ],
      [
        { start: "11:00", end: "13:00", subject: "Seminar", room: "E501" },
      ],
    ],
    "2": [
      [
        { start: "08:00", end: "10:00", subject: "Calculus I", room: "A102" },
        { start: "13:00", end: "15:00", subject: "Linear Algebra", room: "B204" },
      ],
      [
        { start: "09:00", end: "11:00", subject: "Calculus II", room: "A104" },
        { start: "14:00", end: "16:00", subject: "Tutorial", room: "B203" },
      ],
      [
        { start: "08:00", end: "10:00", subject: "Calculus I", room: "A102" },
      ],
      [
        { start: "09:00", end: "11:00", subject: "Calculus II", room: "A104" },
        { start: "15:00", end: "17:00", subject: "Linear Algebra", room: "B204" },
      ],
      [
        { start: "10:00", end: "12:00", subject: "Office Hours", room: "C304" },
      ],
    ],
  };

  const defaultSchedule = days.map(() => [
    { start: "10:00", end: "12:00", subject: "Lecture", room: "A101" },
    { start: "14:00", end: "16:00", subject: "Tutorial", room: "B201" },
  ]);

  const professorSchedule = schedules[professorId] || defaultSchedule;

  return days.map((day, index) => ({
    day,
    slots: professorSchedule[index] || [],
  }));
}

export default function ProfessorScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);

  const filteredProfessors = mockProfessors.filter(
    (prof) =>
      prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedProfessor) {
    const schedule = generateProfessorSchedule(selectedProfessor.id);

    return (
      <div className="space-y-4">
        {/* Back Button and Professor Info */}
        <button
          onClick={() => setSelectedProfessor(null)}
          className="text-blue-600 flex items-center gap-2 mb-2"
        >
          ← Back to professors
        </button>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl">{selectedProfessor.name}</h2>
              <p className="text-sm text-gray-600">{selectedProfessor.department}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{selectedProfessor.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Office Hours: {selectedProfessor.officeHours}</span>
            </div>
          </div>
        </Card>

        {/* Weekly Schedule */}
        <h3 className="text-lg">Teaching Schedule</h3>
        <div className="space-y-3">
          {schedule.map((daySchedule) => (
            <Card key={daySchedule.day} className="p-4">
              <h4 className="mb-3">{daySchedule.day}</h4>
              {daySchedule.slots.length > 0 ? (
                <div className="space-y-2">
                  {daySchedule.slots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border bg-blue-50 border-blue-200"
                    >
                      <div>
                        <p className="text-sm mb-1">{slot.subject}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>
                            {slot.start} - {slot.end}
                          </span>
                          <span className="ml-2">• Room {slot.room}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No classes scheduled</p>
              )}
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search by name or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Professor List */}
      <div className="space-y-3">
        {filteredProfessors.length > 0 ? (
          filteredProfessors.map((professor) => (
            <Card
              key={professor.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedProfessor(professor)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg">{professor.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{professor.department}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{professor.officeHours}</span>
                  </div>
                </div>
                <Badge variant="outline">View Schedule</Badge>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No professors found</p>
            <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
