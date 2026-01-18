import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScreenHeader from "@/components/ScreenHeader";
import { Lecturer } from "@/models"; // Using Lecturer interface
import { Search, User, Clock } from "lucide-react";
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
import { useData } from "@/contexts/DataContext";

// ---------------------------------------------
// Components
// ---------------------------------------------
function ProfessorCard({ professor, onClick }: { professor: Lecturer; onClick: () => void }) {
  return (
    <Card
      className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-slate-200"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-slate-900">{professor.name}</h3>
          {/* Safe access for department */}
          <p className="text-sm text-gray-500 truncate">
            {professor.department || "Faculty Member"}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
            <Clock className="w-3 h-3" />
            <span>{professor.officeHours || "By appointment"}</span>
          </div>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">View Schedule</Badge>
      </div>
    </Card>
  );
}



// ---------------------------------------------
// Main Screen
// ---------------------------------------------
export default function ProfessorScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { lecturers } = useData();
  const { lecturers } = useData();

  const filteredProfessors = useMemo(
    () =>
      lecturers.filter(
        (prof) =>
          prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prof.department.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );
  const filteredProfessors = useMemo(() => {
    // If no data yet, return empty array
    if (!lecturers) return [];

    const query = searchQuery.toLowerCase();

    return lecturers.filter((prof) => {
      // SAFE CHECK: Use optional chaining (?.) and provide fallbacks ("") 
      // before calling toLowerCase() to prevent crashes
      const nameMatch = (prof.name || "").toLowerCase().includes(query);
      const deptMatch = (prof.department || "").toLowerCase().includes(query);
      
      return nameMatch || deptMatch;
    });
  }, [searchQuery, lecturers]); // Added lecturers to dependencies to be safe

  return (
    <>
      <ScreenHeader title="Professors" subtitle="Find and view lecturer schedules" />

      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by name or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 border-slate-200 focus:ring-blue-500"
          />
        </div>

        {/* Professor List */}
        <div className="space-y-3">
          {filteredProfessors.length > 0 ? (
            filteredProfessors.map((professor) => (
              <ProfessorCard
                key={professor.id}
                professor={professor}
                onClick={() => navigate(`/professors/${professor.id}`)}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-gray-500 font-medium">No results found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search for "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}