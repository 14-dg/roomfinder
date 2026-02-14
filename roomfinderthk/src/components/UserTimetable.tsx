import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, Clock, MapPin, User as UserIcon, Trash2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

/**
 * UserTimetable component displays the current user's enrolled courses/classes.
 * Shows classes organized by day with times, locations, and instructors.
 * Allows users to remove classes from their timetable.
 */
export function UserTimetable() {
  const { rooms, lecturers, getUserClasses, removeEventFromUserTimetable } = useData();
  const { user } = useAuth();

  if (!user) return null;

  const userClasses = getUserClasses(user.id);

  /**
   * Removes a class from the user's timetable after confirmation.
   * @param classId - ID of the class to remove
   */
  const handleRemoveClass = async (classId: string) => {
    if (confirm('Remove this class from your timetable?')) {
      await removeEventFromUserTimetable(classId, user.id);
      toast.success('Class removed from your timetable');
    }
  };

  // Group classes by day of the week
  const classesByDay = DAYS.map(day => ({
    day,
    classes: userClasses.filter(cls => cls.day === day),
  }));

  /**
   * Gets the display name of a lecturer by their ID.
   * @param userId - ID of the lecturer
   * @returns Lecturer name or user ID if not found
   */
  const getLecturerName = (userId: string): string => {
    const lecturer = lecturers?.find(l => l.id === userId);
    if (lecturer?.name) {
      return lecturer.name;
    }
    return userId;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3>My Timetable</h3>
          <p className="text-sm text-gray-600 mt-1">
            {userClasses.length} {userClasses.length === 1 ? 'class' : 'classes'} enrolled
          </p>
        </div>
      </div>

      {userClasses.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No classes in your timetable yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Browse classes and add them to your schedule
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {classesByDay.map(({ day, classes }) => (
            classes.length > 0 && (
              <Card key={day} className="p-4">
                <h4 className="mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {day}
                  <Badge variant="secondary" className="ml-auto">
                    {classes.length} {classes.length === 1 ? 'class' : 'classes'}
                  </Badge>
                </h4>
                <div className="space-y-2">
                  {classes
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map(cls => {
                      const room = rooms.find(r => r.id === cls.roomId);
                      return (
                        <div
                          key={cls.id}
                          className="flex items-start justify-between p-3 rounded-lg border bg-blue-50 border-blue-200"
                        >
                          <div className="flex-1">
                            <div className="font-medium mb-2">{cls.name}</div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{cls.startTime}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{room?.roomName || 'Unknown'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <UserIcon className="w-3.5 h-3.5" />
                                <span>{getLecturerName(cls.professor)}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs mt-2">
                              {cls.subject}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveClass(cls.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      );
                    })}
                </div>
              </Card>
            )
          ))}
        </div>
      )}
    </div>
  );
}
