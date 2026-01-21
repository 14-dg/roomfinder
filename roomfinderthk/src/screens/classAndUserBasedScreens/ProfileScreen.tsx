import { User, LogOut, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserTimetable } from "@/components/UserTimetable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ScreenHeader from "@/components/ScreenHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Clock, MapPin, User as UserIcon, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { removeEventFromUserTimetable, userTimetableEntries, classes, lecturers } = useData();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  // Helper to get lecturer name by id
  const getLecturerName = (userId: string): string => {
    const lecturer = lecturers?.find(l => l.id === userId);
    if (lecturer?.name) {
      return lecturer.name;
    }
    return userId;
  };

  // Get lectures added by this user (from userTimetableEntries)
  const myLectures = userTimetableEntries
    .map(entry => {
      const lecture = classes.find(l => l.id === entry.classId);
      return lecture ? { ...lecture, entryId: entry.id } : null;
    })
    .filter(Boolean);

  const handleRemoveLecture = async (classId: string) => {
    try {
      await removeEventFromUserTimetable(classId, user.id);
      toast.success('Lecture removed from your timetable');
    } catch (error) {
      toast.error('Failed to remove lecture');
    }
  };

  return (
    <>
      <ScreenHeader title="Profile" />
      <div className="px-4 py-6 space-y-4">
        {/* User Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <Badge
                className="mt-2 capitalize"
                variant={user.role === "admin" ? "default" : "secondary"}
              >
                {user.role}
              </Badge>
            </div>
          </div>
        </div>

        {/* Removed My Added Lectures section. Only UserTimetable is shown. */}

        {/* Timetable */}
        <UserTimetable />

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm divide-y">
          <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
            <p className="text-base">Notification Settings</p>
            <p className="text-sm text-gray-600 mt-1">Manage your alerts</p>
          </button>
          <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
            <p className="text-base">Default Filters</p>
            <p className="text-sm text-gray-600 mt-1">Set your preferred filters</p>
          </button>
          <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
            <p className="text-base">About</p>
            <p className="text-sm text-gray-600 mt-1">Version 1.0.0</p>
          </button>
          <button
            onClick={logout}
            className="w-full px-6 py-4 text-left text-red-600"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Sign Out
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
