import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { useData } from '../contexts/DataContext';
import { Upload, Trash2, Edit, Plus, Save, X, FileUp, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { getRoom } from '../services/firebase';

export function AdminPanel() {
  const { rooms, bookings, addRoom, updateRoom, deleteRoom, uploadTimetable, clearAllBookings, removeBooking } = useData();
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    floor: 1,
    capacity: 20,
    occupiedSeats: 0,
    hasBeamer: false,
    isLocked: false,
  });
  const [timetableUpload, setTimetableUpload] = useState({
    roomId: '',
    jsonData: '',
  });
  const [newProfessor, setNewProfessor] = useState({
  email: '',
  name: '',
  password: '',
});

  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleAddRoom = () => {
    if (!newRoom.roomNumber) {
      return;
    }
    
    const room = {
      id: Date.now().toString(),
      roomNumber: newRoom.roomNumber,
      floor: newRoom.floor,
      capacity: newRoom.capacity,
      occupiedSeats: newRoom.occupiedSeats,
      hasBeamer: newRoom.hasBeamer,
      isLocked: newRoom.isLocked,
      isAvailable: true,
      
    };
    
    addRoom(room);
    setNewRoom({
      roomNumber: '',
      floor: 1,
      capacity: 20,
      occupiedSeats: 0,
      hasBeamer: false,
      isLocked: false,
    });
  };

  const handleDeleteRoom = (id: string) => {
    if (confirm('Are you sure you want to delete this room? All bookings will also be removed.')) {
      deleteRoom(id);
    }
  };


  /*const handleAddProfessor = () => {
    
    if (!newProfessor.professorName) {
      return;
    }
    
    const professor = {
      email: newProfessor.email,
      name: newProfessor.professorName,
      

    };
    
    addProfessor(professor);
    setNewProfessor({
      roomNumber: '',
      floor: 1,
      capacity: 20,
      occupiedSeats: 0,
      hasBeamer: false,
      isLocked: false,
    });
  };

  const handleDeleteProfessor = (id: string) => {
    if (confirm('Are you sure you want to delete this Professor? All bookings will also be removed.')) {
      deleteProfessor(id);
    }
  };
  */


  const handleUploadTimetable = () => {
    try {
      const schedule = JSON.parse(timetableUpload.jsonData);
      
      // Validate the structure
      if (!Array.isArray(schedule) || schedule.length === 0) {
        throw new Error('Invalid schedule format. Must be an array of day schedules.');
      }
      
      uploadTimetable(timetableUpload.roomId, schedule);
      setUploadMessage({ type: 'success', text: 'Timetable uploaded successfully!' });
      setTimetableUpload({ roomId: '', jsonData: '' });
      
      setTimeout(() => setUploadMessage(null), 3000);
    } catch (error) {
      setUploadMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Invalid JSON format' 
      });
    }
  };

  const handleClearAllBookings = () => {
    if (confirm('Are you sure you want to clear ALL bookings? This cannot be undone.')) {
      clearAllBookings();
      setUploadMessage({ type: 'success', text: 'All bookings cleared successfully!' });
      setTimeout(() => setUploadMessage(null), 3000);
    }
  };

  const exampleTimetableFormat = `[
  {
    "day": "Monday",
    "slots": [
      {
        "start": "08:00",
        "end": "10:00",
        "isBooked": true,
        "subject": "Math 101"
      },
      {
        "start": "10:00",
        "end": "12:00",
        "isBooked": false
      }
    ]
  }
]`;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="rooms" className="w-full">
          <TabsList className="w-full flex flex-wrap gap-2 items-center">
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="timetables">Timetables</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="professors">Professors</TabsTrigger>
          </TabsList>

        {/* Rooms Tab */}
        <TabsContent value="rooms" className="space-y-4 mt-6">
          <Card className="p-6">
            <h3 className="mb-4">Add New Room</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  placeholder="ZW5-5"
                  value={newRoom.roomNumber}
                  onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="floor">Floor</Label>
                <Select
                  value={newRoom.floor.toString()}
                  onValueChange={(v) => setNewRoom({ ...newRoom, floor: parseInt(v) })}
                >
                  <SelectTrigger id="floor" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(f => (
                      <SelectItem key={f} value={f.toString()}>Floor {f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                  className="mt-2"
                />
              </div>
              <div className="col-span-2 flex items-end" style={{ gap: '40px' }}>
                <div className="flex items-center gap-2 pb-2">
                  <Switch
                    id="hasBeamer"
                    checked={newRoom.hasBeamer}
                    onCheckedChange={(checked) => setNewRoom({ ...newRoom, hasBeamer: checked })}
                  />
                  <Label htmlFor="hasBeamer">Has Beamer</Label>
                </div>
                <div className="flex items-center gap-2 pb-2">
                  <Switch
                    id="isLocked"
                    checked={newRoom.isLocked}
                    onCheckedChange={(checked) => setNewRoom({ ...newRoom, isLocked: checked })}
                  />
                  <Label htmlFor="isLocked">Locked</Label>
                </div>
              </div>
            </div>
            <Button onClick={handleAddRoom} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Manage Rooms ({rooms.length})</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Beamer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>{room.roomNumber}</TableCell>
                      <TableCell>{room.floor}</TableCell>
                      <TableCell>{room.capacity}</TableCell>
                      <TableCell>
                        {room.hasBeamer ? (
                          <Badge variant="secondary">Yes</Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {room.isAvailable ? (
                          <Badge className="bg-green-500">Available</Badge>
                        ) : (
                          <Badge variant="destructive">Occupied</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Timetables Tab */}
        <TabsContent value="timetables" className="space-y-4 mt-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileUp className="w-5 h-5" />
              <h3>Upload Timetable</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="timetableRoom">Select Room</Label>
                <Select
                  value={timetableUpload.roomId}
                  onValueChange={(v) => setTimetableUpload({ ...timetableUpload, roomId: v })}
                >
                  <SelectTrigger id="timetableRoom" className="mt-2">
                    <SelectValue placeholder="Choose a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map(room => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.roomNumber} - Floor {room.floor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="jsonData">Timetable JSON</Label>
                <Textarea
                  id="jsonData"
                  placeholder="Paste timetable JSON here..."
                  value={timetableUpload.jsonData}
                  onChange={(e) => setTimetableUpload({ ...timetableUpload, jsonData: e.target.value })}
                  className="mt-2 font-mono text-sm h-48"
                />
              </div>
      {uploadMessage && (
        <Alert variant={uploadMessage.type === 'error' ? 'destructive' : 'default'}>
        <AlertDescription>{uploadMessage.text}</AlertDescription>
        </Alert>
        )}

        


              <Button 
                onClick={handleUploadTimetable}
                disabled={!timetableUpload.roomId || !timetableUpload.jsonData}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Timetable
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-gray-50">
            <h4 className="mb-2">Example Timetable Format:</h4>
            <pre className="bg-white p-4 rounded border text-xs overflow-x-auto">
              {exampleTimetableFormat}
            </pre>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4 mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3>All Bookings ({bookings.length})</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Professor bookings have priority and block rooms completely
                </p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleClearAllBookings}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Booked By</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                        No bookings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings
                      .sort((a, b) => {
                        // Sort by role (professor first)
                        if (a.bookedByRole === 'professor' && b.bookedByRole !== 'professor') return -1;
                        if (a.bookedByRole !== 'professor' && b.bookedByRole === 'professor') return 1;
                        return 0;
                      })
                      .map((booking) => {
                        const room = rooms.find(r => r.id === booking.roomId);
                        const isProfessorBooking = booking.bookedByRole === 'professor';
                        
                        return (
                          <TableRow key={booking.id} className={isProfessorBooking ? 'bg-blue-50' : ''}>
                            <TableCell>
                              {isProfessorBooking ? (
                                <Badge className="bg-blue-600">High</Badge>
                              ) : (
                                <Badge variant="outline">Normal</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{room?.roomNumber || 'Unknown'}</div>
                                <div className="text-xs text-gray-500">Floor {room?.floor}</div>
                              </div>
                            </TableCell>
                            <TableCell>{booking.day}</TableCell>
                            <TableCell>{booking.timeSlot}</TableCell>
                            <TableCell>
                              <div className="max-w-[200px] truncate">{booking.subject}</div>
                            </TableCell>
                            <TableCell>{booking.bookedByName}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className={`capitalize ${isProfessorBooking ? 'bg-blue-100 text-blue-700' : ''}`}
                              >
                                {booking.bookedByRole}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Delete this booking?')) {
                                    removeBooking(booking.id);
                                    toast.success('Booking deleted');
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>


          

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
              <div className="text-2xl font-semibold">{bookings.length}</div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-sm text-gray-600 mb-1">Professor Bookings</div>
              <div className="text-2xl font-semibold text-blue-700">
                {bookings.filter(b => b.bookedByRole === 'professor').length}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-gray-600 mb-1">Student Check-ins</div>
              <div className="text-2xl font-semibold">
                {bookings.filter(b => b.bookedByRole === 'student').length}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Professors Tab */}
        <TabsContent value="professors" className="space-y-4 mt-6">
          <Card className="p-6 bg-gray-50">
            <h4 className="mb-2">Example Professors bliblablup:</h4>
          </Card>
        </TabsContent>
        
      </Tabs>
    </div>
  );
}