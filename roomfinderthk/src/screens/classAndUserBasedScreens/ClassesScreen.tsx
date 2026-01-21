import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ScreenHeader from '@/components/ScreenHeader';
import { BookOpen, MapPin, User as UserIcon, Clock, Plus, Check } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

import { Lecture } from '@/models';

export default function ClassesScreen() {
  const { classes, lecturers, rooms, addEventToUserTimetable, removeEventFromUserTimetable, userTimetableEntries } = useData();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLecturer, setSelectedLecturer] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  // Helper to get lecturer name by id
  const getLecturerName = (userId: string): string => {
    const lecturer = lecturers?.find(l => l.id === userId);
    if (lecturer?.name) {
      return lecturer.name;
    }
    return userId;
  };

  const getRoomName = (id: string): string => {
    const room = rooms?.find(r => r.id === id);
    if (room?.roomName) {
      return room?.roomName;
    }
    return id;
  };

  // Use lectures as the data source
  const allLectures = useMemo(() => {
    return classes.map((lecture, idx) => ({
      ...lecture,
      uniqueKey: `${idx}-${lecture.id}`
    }));
  }, [classes]);

  // Check if an event is already in user's timetable - directly from userTimetableEntries
  const isEventInTimetable = (eventId: number | string) => {
    if (!user) return false;
    return userTimetableEntries.some(e => e.userId === user.id && (e.classId === eventId.toString() || e.classId === eventId));
  };

  // Get unique lecturers for filters
  const lecturerOptions = useMemo(() => {
    const uniqueLecturers = Array.from(new Set(
      allLectures
        .filter(l => l.professor)
        .map(l => getLecturerName(l.professor))
    ));
    return uniqueLecturers.sort();
  }, [allLectures, lecturers]);

  // Get unique modules for filters
  const modules = useMemo(() => {
    const uniqueModules = Array.from(new Set(
      allLectures
        .filter(l => l.subject)
        .map(l => l.subject)
    ));
    return uniqueModules.sort();
  }, [allLectures]);

  // Filter lectures
  const filteredLectures = useMemo(() => {
    return allLectures.filter(lecture => {
      // Search filter
      if (searchQuery && !lecture.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Lecturer filter
      if (selectedLecturer !== 'all' && getLecturerName(lecture.professor) !== selectedLecturer) {
        return false;
      }

      // Module filter
      if (selectedModule !== 'all' && lecture.subject !== selectedModule) {
        return false;
      }

      return true;
    });
  }, [allLectures, searchQuery, selectedLecturer, selectedModule, lecturers]);

  const handleToggleLecture = async (lecture: Lecture & { uniqueKey?: string }) => {
    if (!user) return;

    try {
      if (isEventInTimetable(lecture.id)) {
        await removeEventFromUserTimetable(lecture.id.toString(), user.id);
        toast.success('Lecture removed from your timetable');
      } else {
        // Pass only the lecture id and minimal info, so DataContext can match it in ProfileScreen
        await addEventToUserTimetable(lecture.id.toString(), user.id, {
          id: lecture.id,
          name: lecture.name,
          type: lecture.type,
          professor: lecture.professor,
          roomId: lecture.roomId,
          day: lecture.day,
          startTime: lecture.startTime,
          endTime: lecture.endTime,
          subject: lecture.subject
        });
        toast.success('Lecture added to your timetable');
      }
    } catch (error) {
      toast.error('Failed to update timetable');
    }
  };

  const activeFiltersCount = [
    selectedLecturer !== 'all',
    selectedModule !== 'all',
    searchQuery !== '',
  ].filter(Boolean).length;

  return (
    <>
      <ScreenHeader title="Classes" subtitle="Browse and manage events from timetables" />
      <div className="space-y-4">
        {/* Search and Filters */}
        <Card className="p-4">
          <div className="space-y-4">
            {/* Search */}
            <div>
              <Label htmlFor="classSearch" className="text-sm">Search Events</Label>
              <Input
                id="classSearch"
                placeholder="Search by event name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="lecturer" className="text-sm">Lecturer</Label>
                <Select value={selectedLecturer} onValueChange={setSelectedLecturer}>
                  <SelectTrigger id="lecturer" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Lecturers</SelectItem>
                    {lecturerOptions.map(lecturer => (
                      <SelectItem key={lecturer} value={lecturer}>{lecturer}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="module" className="text-sm">Module</Label>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger id="module" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    {modules.map(module => (
                      <SelectItem key={module} value={module}>{module}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <div className="flex items-center justify-between pt-2">
                <Badge variant="secondary">{activeFiltersCount} filter(s) active</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLecturer('all');
                    setSelectedModule('all');
                  }}
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredLectures.length} {filteredLectures.length === 1 ? 'lecture' : 'lectures'} found
            </p>
          </div>

          {filteredLectures.length > 0 ? (
            filteredLectures.map(lecture => {
              const inTimetable = isEventInTimetable(lecture.id);
              return (
                <Card key={lecture.uniqueKey} className={`p-4 ${inTimetable ? 'border-blue-500 bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base">{lecture.name}</h3>
                        {inTimetable && (
                          <Badge className="bg-blue-600">In Timetable</Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {lecture.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <UserIcon className="w-4 h-4" />
                      <span>{getLecturerName(lecture.professor) || 'Unknown Lecturer'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>{lecture.subject || 'Unknown Module'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{getRoomName(lecture.roomId || 'Unknown Room')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{lecture.day}, {lecture.startTime} - {lecture.endTime}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleToggleLecture(lecture)}
                    variant={inTimetable ? 'outline' : 'default'}
                    className="w-full"
                    size="sm"
                  >
                    {inTimetable ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Remove from Timetable
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Timetable
                      </>
                    )}
                  </Button>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No lectures found matching your criteria</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
