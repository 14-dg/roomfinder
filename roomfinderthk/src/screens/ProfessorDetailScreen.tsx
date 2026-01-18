import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import ScreenHeader from "@/components/ScreenHeader";
import { DaySchedule, TimeSlot, Professor } from "@/models";
import { Mail, Clock, User } from "lucide-react";
import { useData } from "@/contexts/DataContext";

// ---------------------------------------------
// Mock Data
// ---------------------------------------------
/*const mockProfessors: Professor[] = [
  { id: "1", name: "Dr. Sarah Johnson", department: "Computer Science", email: "s.johnson@uni.edu", officeHours: "Mon-Wed 14:00-16:00" },
  { id: "2", name: "Prof. Michael Chen", department: "Mathematics", email: "m.chen@uni.edu", officeHours: "Tue-Thu 10:00-12:00" },
  { id: "3", name: "Dr. Emily Brown", department: "Physics", email: "e.brown@uni.edu", officeHours: "Mon-Fri 13:00-14:00" },
  { id: "4", name: "Prof. David Wilson", department: "Chemistry", email: "d.wilson@uni.edu", officeHours: "Wed-Fri 15:00-17:00" },
  { id: "5", name: "Dr. Lisa Martinez", department: "Biology", email: "l.martinez@uni.edu", officeHours: "Mon-Thu 11:00-12:00" },
];*/

// ---------------------------------------------
// Schedule Generator
// ---------------------------------------------
function generateProfessorSchedule(professorId: string): DaySchedule[] {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  const schedules: { [key: string]: TimeSlot[][] } = {
    "1": [
      [{ start: "09:00", end: "11:00", subject: "Algorithms", room: "B201" }, { start: "14:00", end: "16:00", subject: "Data Structures", room: "A101" }],
      [{ start: "10:00", end: "12:00", subject: "Computer Networks", room: "C302" }],
      [{ start: "09:00", end: "11:00", subject: "Algorithms", room: "B201" }, { start: "15:00", end: "17:00", subject: "Lab Session", room: "D401" }],
      [{ start: "10:00", end: "12:00", subject: "Computer Networks", room: "C302" }],
      [{ start: "11:00", end: "13:00", subject: "Seminar", room: "E501" }],
    ],
    "2": [
      [{ start: "08:00", end: "10:00", subject: "Calculus I", room: "A102" }, { start: "13:00", end: "15:00", subject: "Linear Algebra", room: "B204" }],
      [{ start: "09:00", end: "11:00", subject: "Calculus II", room: "A104" }, { start: "14:00", end: "16:00", subject: "Tutorial", room: "B203" }],
      [{ start: "08:00", end: "10:00", subject: "Calculus I", room: "A102" }],
      [{ start: "09:00", end: "11:00", subject: "Calculus II", room: "A104" }, { start: "15:00", end: "17:00", subject: "Linear Algebra", room: "B204" }],
      [{ start: "10:00", end: "12:00", subject: "Office Hours", room: "C304" }],
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

// ---------------------------------------------
// ScheduleCard Component
// ---------------------------------------------
function ScheduleCard({ daySchedule }: { daySchedule: DaySchedule }) {
  return (
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
                  <span>{slot.start} - {slot.end}</span>
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
  );
}

// ---------------------------------------------
// Main Detail Screen
// ---------------------------------------------
export default function ProfessorDetailScreen() {
  const { professorId } = useParams<{ professorId: string }>();
  const navigate = useNavigate();
  const { lecturers } = useData();

  const professor = useMemo(
    () => lecturers.find((p) => p.id === professorId),
    [professorId]
  );

  const schedule = useMemo(
    () => (professor ? generateProfessorSchedule(professor.id) : []),
    [professor]
  );

  if (!professor) {
    return <p className="text-center text-gray-500 mt-10">Professor not found</p>;
  }

  return (
    <>
      <ScreenHeader title="Professor Details" subtitle={`Details for Professor ${professor.name}`}/>
      <div className="space-y-4">
        <button
          onClick={() => navigate("/professors")}
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
              <h2 className="text-xl">{professor.name}</h2>
              <p className="text-sm text-gray-600">{professor.department || "Faculty Member"}</p>
              <p className="text-xs text-blue-600 font-medium">Room: {professor.officeLocation || "Not assigned"}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{professor.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Office Hours: {professor.officeHours}</span>
            </div>
          </div>
        </Card>

        <h3 className="text-lg">Teaching Schedule</h3>
        <div className="space-y-3">
          {schedule.map((daySchedule) => (
            <ScheduleCard key={daySchedule.day} daySchedule={daySchedule} />
          ))}
        </div>
      </div>
    </>
  );
}
