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
  const { removeEventFromUserTimetable, getUserEvents } = useData();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  // Get events added by this user
  const myEvents = getUserEvents(user.id);

  const handleRemoveEvent = async (classId: string) => {
    try {
      await removeEventFromUserTimetable(classId, user.id);
      toast.success('Event removed from your timetable');
    } catch (error) {
      toast.error('Failed to remove event');
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

        {/* Added Events */}
        <div>
          <h3 className="text-lg font-semibold mb-3">My Added Events ({myEvents.length})</h3>
          {myEvents.length > 0 ? (
            <div className="space-y-3">
              {myEvents.map(eventEntry => (
                <Card key={eventEntry.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-base font-medium">{eventEntry.event?.name || 'Event'}</h4>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {eventEntry.event?.typeOf || 'Unknown Type'}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEvent(eventEntry.classId)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span>{eventEntry.event?.lecturer?.name || 'Unknown Lecturer'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{eventEntry.event?.module?.name || 'Unknown Module'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{eventEntry.event?.room?.roomName || 'Unknown Room'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{eventEntry.event?.day}, {eventEntry.event?.startTime} - {eventEntry.event?.endTime}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No events added yet</p>
              <p className="text-sm text-gray-400 mt-1">Browse classes to add events to your timetable</p>
            </div>
          )}
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
