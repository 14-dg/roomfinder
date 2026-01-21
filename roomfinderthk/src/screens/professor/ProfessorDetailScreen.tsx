import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import ScreenHeader from "@/components/ScreenHeader";
import { Mail, Clock, User, MapPin, ArrowLeft } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { RoomWeeklySchedule } from "../rooms/RoomWeeklySchedule";



export default function ProfessorDetailScreen() {
  const { professorId } = useParams<{ professorId: string }>();
  const navigate = useNavigate();
  const { lecturers, getProfessorLectures } = useData();

  // Find the professor profile data
  const professor = useMemo(
    () => lecturers.find((p) => p.id === professorId),
    [lecturers, professorId]
  );

  // Get lectures for this professor
  const professorLectures = useMemo(() => {
    if (!professor) return [];
    return getProfessorLectures(professor.id);
  }, [professor, getProfessorLectures]);


  if (!professor) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500">Professor not found</p>
        <button 
          onClick={() => navigate("/professors")} 
          className="text-blue-600 underline mt-2"
        >
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
              <h2 className="text-2xl font-bold text-slate-900">{professor.name}</h2>
              <p className="text-slate-600 font-medium">{professor.department}</p>
              <div className="flex items-center gap-1.5 text-sm text-blue-700 mt-2 bg-blue-50 w-fit px-3 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5" />
                <span>Office: {professor.officeLocation || "TBD"}</span>
              </div>
            </div>
          </div>
          
          {/* Contact Details */}
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 text-sm">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <a href={`mailto:${professor.email}`} className="hover:text-blue-600 underline-offset-4 hover:underline">
                {professor.email}
              </a>
            </div>

            <div className="flex items-center gap-3 text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Office Hours: {professor.officeHours || "Not scheduled"}</span>
            </div>
          </div>
        </Card>

        {/* Teaching Schedule Section */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Teaching Schedule</h3>
          <RoomWeeklySchedule lectures={professorLectures} />
        </div>
      </div>
    </>
  );
}