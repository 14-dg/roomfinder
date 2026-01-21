import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ScreenHeader from '@/components/ScreenHeader';
import { BookOpen, MapPin, User as UserIcon, Clock, Plus, Check } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Event } from '@/models';

export default function ClassesScreen() {
  const { timetables, lecturers, rooms, addEventToUserTimetable, removeEventFromUserTimetable, userTimetableEntries, timetables: allTimetables } = useData();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLecturer, setSelectedLecturer] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  // Extract all events from timetables with unique key
  const allEvents = useMemo(() => {
    return timetables.flatMap((timetable, timetableIdx) => 
      timetable.events.map((event, eventIdx) => ({
        ...event,
        uniqueKey: `${timetableIdx}-${eventIdx}-${event.id}`,
        timetableName: `${timetable.courseOfStudy}, ${timetable.semester}`
      }))
    );
  }, [timetables]);

  // Check if an event is already in user's timetable - directly from userTimetableEntries
  const isEventInTimetable = (eventId: number | string) => {
    if (!user) return false;
    return userTimetableEntries.some(e => e.userId === user.id && (e.classId === eventId.toString() || e.classId === eventId));
  };

  // Get unique lecturers for filters
  const lecturerOptions = useMemo(() => {
    const uniqueLecturers = Array.from(new Set(
      allEvents
        .filter(e => e.lecturer && e.lecturer.name)
        .map(e => e.lecturer.name)
    ));
    return uniqueLecturers.sort();
  }, [allEvents]);

  // Get unique modules for filters
  const modules = useMemo(() => {
    const uniqueModules = Array.from(new Set(
      allEvents
        .filter(e => e.module && e.module.name)
        .map(e => e.module.name)
    ));
    return uniqueModules.sort();
  }, [allEvents]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      // Search filter
      if (searchQuery && !event.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Lecturer filter
      if (selectedLecturer !== 'all' && event.lecturer?.name !== selectedLecturer) {
        return false;
      }

      // Module filter
      if (selectedModule !== 'all' && event.module?.name !== selectedModule) {
        return false;
      }

      return true;
    });
  }, [allEvents, searchQuery, selectedLecturer, selectedModule]);

  const handleToggleEvent = async (event: Event & { uniqueKey?: string }) => {
    if (!user) return;

    try {
      if (isEventInTimetable(event.id)) {
        await removeEventFromUserTimetable(event.uniqueKey || event.id.toString(), user.id);
        toast.success('Event removed from your timetable');
      } else {
        await addEventToUserTimetable(event.uniqueKey || event.id.toString(), user.id, event);
        toast.success('Event added to your timetable');
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
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            </p>
          </div>

          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => {
              const inTimetable = isEventInTimetable(event.id);
              
              return (
                <Card key={event.uniqueKey} className={`p-4 ${inTimetable ? 'border-blue-500 bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base">{event.name}</h3>
                        {inTimetable && (
                          <Badge className="bg-blue-600">In Timetable</Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {event.typeOf}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <UserIcon className="w-4 h-4" />
                      <span>{event.lecturer?.name || 'Unknown Lecturer'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>{event.module?.name || 'Unknown Module'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{event.room?.roomName || 'Unknown Room'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{event.day}, {event.startTime} - {event.endTime}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleToggleEvent(event)}
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
              <p className="text-gray-500">No events found matching your criteria</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
