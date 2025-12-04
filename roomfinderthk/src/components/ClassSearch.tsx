import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { BookOpen, MapPin, User as UserIcon, Clock, Plus, Check } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

export function ClassSearch() {
  const { classes, rooms, addClassToTimetable, removeClassFromTimetable, userTimetableEntries } = useData();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedProfessor, setSelectedProfessor] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');

  // Get unique values for filters
  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(new Set(classes.map(c => c.subject)));
    return uniqueSubjects.sort();
  }, [classes]);

  const professors = useMemo(() => {
    const uniqueProfessors = Array.from(new Set(classes.map(c => c.professor)));
    return uniqueProfessors.sort();
  }, [classes]);

  // Filter classes
  const filteredClasses = useMemo(() => {
    return classes.filter(cls => {
      // Search filter
      if (searchQuery && !cls.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Subject filter
      if (selectedSubject !== 'all' && cls.subject !== selectedSubject) {
        return false;
      }

      // Professor filter
      if (selectedProfessor !== 'all' && cls.professor !== selectedProfessor) {
        return false;
      }

      // Room filter
      if (selectedRoom !== 'all' && cls.roomId !== selectedRoom) {
        return false;
      }

      return true;
    });
  }, [classes, searchQuery, selectedSubject, selectedProfessor, selectedRoom]);

  // Check if a class is already in user's timetable
  const isClassInTimetable = (classId: string) => {
    if (!user) return false;
    return userTimetableEntries.some(e => e.classId === classId && e.userId === user.id);
  };

  const handleToggleClass = (classId: string) => {
    if (!user) return;

    if (isClassInTimetable(classId)) {
      removeClassFromTimetable(classId, user.id);
      toast.success('Class removed from your timetable');
    } else {
      addClassToTimetable(classId, user.id);
      toast.success('Class added to your timetable');
    }
  };

  const activeFiltersCount = [
    selectedSubject !== 'all',
    selectedProfessor !== 'all',
    selectedRoom !== 'all',
    searchQuery !== '',
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Search */}
          <div>
            <Label htmlFor="classSearch" className="text-sm">Search Classes</Label>
            <Input
              id="classSearch"
              placeholder="Search by class name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label htmlFor="subject" className="text-sm">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="subject" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="professor" className="text-sm">Professor</Label>
              <Select value={selectedProfessor} onValueChange={setSelectedProfessor}>
                <SelectTrigger id="professor" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Professors</SelectItem>
                  {professors.map(prof => (
                    <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="roomFilter" className="text-sm">Room</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger id="roomFilter" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rooms</SelectItem>
                  {rooms.map(room => (
                    <SelectItem key={room.id} value={room.id}>{room.roomNumber}</SelectItem>
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
                  setSelectedSubject('all');
                  setSelectedProfessor('all');
                  setSelectedRoom('all');
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
            {filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'} found
          </p>
        </div>

        {filteredClasses.length > 0 ? (
          filteredClasses.map(cls => {
            const room = rooms.find(r => r.id === cls.roomId);
            const inTimetable = isClassInTimetable(cls.id);
            
            return (
              <Card key={cls.id} className={`p-4 ${inTimetable ? 'border-blue-500 bg-blue-50' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base">{cls.name}</h3>
                      {inTimetable && (
                        <Badge className="bg-blue-600">In Timetable</Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {cls.subject}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UserIcon className="w-4 h-4" />
                    <span>{cls.professor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{room?.roomNumber || 'Unknown'} (Floor {room?.floor})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{cls.day}, {cls.timeSlot}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleToggleClass(cls.id)}
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
            <p className="text-gray-500">No classes found matching your criteria</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
