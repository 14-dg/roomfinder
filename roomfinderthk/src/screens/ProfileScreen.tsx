import { User, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserTimetable } from "@/components/UserTimetable";
import { Button } from "@/components/ui/button";

interface ProfileScreenProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  onLogout: () => void;
}

export default function ProfileScreen({ user, onLogout }: ProfileScreenProps) {
  return (
    <div className="px-4 py-6 space-y-4">
      {/* User Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>

          <div className="flex-1">
            <h2 className="text-xl">{user?.name}</h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <Badge
              className="mt-2 capitalize"
              variant={user?.role === "admin" ? "default" : "secondary"}
            >
              {user?.role}
            </Badge>
          </div>
        </div>
      </div>

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
          onClick={onLogout}
          className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors text-red-600"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            <div>
              <p className="text-base">Sign Out</p>
              <p className="text-sm text-gray-600 mt-1">Log out of your account</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
