import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import ScreenHeader from "@/components/ScreenHeader";
<<<<<<< HEAD
import { Event } from "@/models"; 
import { Mail, Clock, User, MapPin, ArrowLeft } from "lucide-react";
import { useData } from "@/contexts/DataContext";

// Helper to group events and filter out empty days
function groupEventsByDay(events: Event[]) {
  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
=======
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
>>>>>>> cd43a76 (Datacontext geändert sodass die passwort logik in firebase ist und nichtmehr im frontend ist professor detailscreen geändert sodass es nicht mehr mockdata in der datei nutzt sonder datacontext das selbe in professor screen in firebase änderung bei passwort logik)
  
  const grouped = events.reduce((acc, event) => {
    const day = event.day;
    if (!acc[day]) acc[day] = [];
    acc[day].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Only return days that actually have events
  return daysOrder
    .filter(day => grouped[day] && grouped[day].length > 0)
    .map(day => ({
      day,
      slots: grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime))
    }));
}

export default function ProfessorDetailScreen() {
  const { professorId } = useParams<{ professorId: string }>();
  const navigate = useNavigate();
  const { lecturers } = useData();

  const professor = useMemo(
    () => lecturers.find((p) => p.id === professorId),
<<<<<<< HEAD
    [lecturers, professorId]
=======
    [professorId]
>>>>>>> cd43a76 (Datacontext geändert sodass die passwort logik in firebase ist und nichtmehr im frontend ist professor detailscreen geändert sodass es nicht mehr mockdata in der datei nutzt sonder datacontext das selbe in professor screen in firebase änderung bei passwort logik)
  );

  const scheduleByDay = useMemo(
    () => (professor?.events ? groupEventsByDay(professor.events) : []),
    [professor]
  );

  if (!professor) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500">Professor not found</p>
        <button onClick={() => navigate("/professors")} className="text-blue-600 underline mt-2">
          Back to list
        </button>
      </div>
    );
  }

  return (
    <>
      <ScreenHeader 
        title="Professor Details" 
        subtitle={`Information regarding ${professor.name}`} 
      />
      
      <div className="space-y-6">
        <button
          onClick={() => navigate("/professors")}
          className="text-blue-600 flex items-center gap-2 hover:underline transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to professors
        </button>

        {/* Profile Card */}
        <Card className="p-5 shadow-sm border-slate-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
<<<<<<< HEAD
              <h2 className="text-2xl font-bold text-slate-900">{professor.name}</h2>
              <p className="text-slate-600 font-medium">{professor.department}</p>
              <div className="flex items-center gap-1.5 text-sm text-blue-700 mt-2 bg-blue-50 w-fit px-3 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5" />
                <span>Office: {professor.officeLocation || "TBD"}</span>
              </div>
=======
              <h2 className="text-xl">{professor.name}</h2>
              <p className="text-sm text-gray-600">{professor.department || "Faculty Member"}</p>
              <p className="text-xs text-blue-600 font-medium">Room: {professor.officeLocation || "Not assigned"}</p>
>>>>>>> cd43a76 (Datacontext geändert sodass die passwort logik in firebase ist und nichtmehr im frontend ist professor detailscreen geändert sodass es nicht mehr mockdata in der datei nutzt sonder datacontext das selbe in professor screen in firebase änderung bei passwort logik)
            </div>
          </div>
          
          {/* Email, Office Hours und Office Location */}
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 text-sm">
            {/* Email */}
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <a href={`mailto:${professor.email}`} className="hover:text-blue-600 underline-offset-4 hover:underline">
                {professor.email}
              </a>
            </div>

            
            <div className="flex items-center gap-3 text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Office Hours: {professor.officeHours || "Not set"}</span>
            </div>

            
            <div className="flex items-center gap-3 text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Office: {professor.officeLocation || "No room assigned"}</span>
            </div>
          </div>
        </Card>

        {/* Teaching Schedule Section */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Teaching Schedule</h3>
          
          {scheduleByDay.length > 0 ? (
            <div className="space-y-6">
              {scheduleByDay.map((dayGroup) => (
                <div key={dayGroup.day} className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b pb-1">
                    {dayGroup.day}
                  </h4>
                  <div className="grid gap-3">
                    {dayGroup.slots.map((event) => (
                      <div
                        key={event.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-white border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
                      >
                        <div className="mb-2 sm:mb-0">
                          <p className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                            {event.name}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {event.startTime} - {event.endTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              Room {event.room}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-10 text-center border-dashed border-slate-300 bg-slate-50/50">
              <p className="text-sm text-slate-500 italic">No scheduled events found for this lecturer.</p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}