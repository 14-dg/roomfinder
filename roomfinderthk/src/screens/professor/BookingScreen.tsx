import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ScreenHeader from '@/components/ScreenHeader';
import { Calendar, Clock, MapPin, Users, Projector, CheckCircle, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Hilfsfunction: Extrahiere Zeit aus ISO-String
const formatTimeFromISO = (isoString: string): string => {
  if (!isoString) return '00:00';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

// Hilfsfunction: Extrahiere Datum aus ISO-String
const formatDateFromISO = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toISOString().split('T')[0];
};

export default function BookingScreen() {
  const { rooms, bookings, addBooking, removeBooking } = useData();
  const { user } = useAuth();

  const [selectedRoom, setSelectedRoom] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('08:50');
  const [description, setDescription] = useState('');
  const [filterFloor, setFilterFloor] = useState<string>('all');
  const [filterBeamer, setFilterBeamer] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);

  // Get professor's bookings
  const myBookings = bookings.filter(b => b.bookedBy === user?.id);

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    if (filterFloor !== 'all' && room.floor !== parseInt(filterFloor)) return false;
    if (filterBeamer && !room.hasBeamer) return false;
    return true;
  });

  // Validiere dass End-Zeit nach Start-Zeit liegt
  const isValidTimeRange = () => {
    if (!startTime || !endTime) return false;
    return startTime < endTime;
  };

  const handleBookRoom = () => {
    if (!selectedRoom || !bookingDate || !startTime || !endTime || !description || !user) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!isValidTimeRange()) {
      toast.error('End time must be after start time');
      return;
    }

    const room = rooms.find(r => r.id === selectedRoom);
    if (!room) return;

    // ISO-Format: YYYY-MM-DDTHH:MM:SS
    const startDateISO = `${bookingDate}T${startTime}:00`;
    const endDateISO = `${bookingDate}T${endTime}:00`;

    // Bestimme den Wochentag aus dem Datum
    const dateObj = new Date(bookingDate + 'T12:00:00');
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[dateObj.getDay()];

    addBooking({
      id: Date.now().toString(),
      roomId: selectedRoom,
      startDate: startDateISO,
      endDate: endDateISO,
      day: dayName,
      bookedBy: user.id,
      description: description,
    });

    toast.success(`Room ${room.roomName} booked successfully!`);
    
    // Reset form
    setSelectedRoom('');
    setBookingDate('');
    setStartTime('08:00');
    setEndTime('08:50');
    setDescription('');
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      removeBooking(bookingId);
      toast.success('Booking cancelled successfully');
    }
  };

  const selectedRoomData = rooms.find(r => r.id === selectedRoom);

  return (
    <>
      <ScreenHeader title="Room Booking" subtitle="Reserve rooms for your courses" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2>Room Booking</h2>
            <p className="text-sm text-gray-600 mt-1">Reserve rooms for your courses</p>
          </div>
          <Button
            variant={showMyBookings ? 'default' : 'outline'}
            onClick={() => setShowMyBookings(!showMyBookings)}
          >
            My Bookings ({myBookings.length})
          </Button>
        </div>

        {showMyBookings ? (
          /* My Bookings View */
          <Card className="p-6">
            <h3 className="mb-4">My Room Bookings</h3>
            {myBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>You haven't booked any rooms yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room</TableHead>
                      <TableHead>Day</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myBookings.map((booking) => {
                      const room = rooms.find(r => r.id === booking.roomId);
                      const startTime = formatTimeFromISO(booking.startDate);
                      const endTime = formatTimeFromISO(booking.endDate);
                      const bookingDate = formatDateFromISO(booking.startDate);
                      return (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{room?.roomName}</div>
                              <div className="text-xs text-gray-500">Floor {room?.floor}</div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.day}</TableCell>
                          <TableCell>{bookingDate}</TableCell>
                          <TableCell>{startTime} - {endTime}</TableCell>
                          <TableCell>{booking.description}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        ) : (
          /* Booking Form */
          <>
            {/* Filters */}
            <Card className="p-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="filterFloor" className="text-sm">Filter by Floor</Label>
                  <Select value={filterFloor} onValueChange={setFilterFloor}>
                    <SelectTrigger id="filterFloor" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Floors</SelectItem>
                      <SelectItem value="1">Floor 1</SelectItem>
                      <SelectItem value="2">Floor 2</SelectItem>
                      <SelectItem value="3">Floor 3</SelectItem>
                      <SelectItem value="4">Floor 4</SelectItem>
                      <SelectItem value="5">Floor 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pb-2">
                  <input
                    type="checkbox"
                    id="filterBeamer"
                    checked={filterBeamer}
                    onChange={(e) => setFilterBeamer(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="filterBeamer" className="text-sm cursor-pointer">
                    Beamer required
                  </Label>
                </div>
              </div>
            </Card>

            {/* Booking Form */}
            <Card className="p-6">
              <h3 className="mb-4">Book a Room</h3>
              
              <div className="grid gap-6">
                {/* Step 1: Select Room */}
                <div>
                  <Label htmlFor="room" className="text-base mb-2 block">1. Select Room</Label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger id="room">
                      <SelectValue placeholder="Choose a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredRooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{room.roomName}</span>
                            <span className="text-xs text-gray-500">
                              Floor {room.floor} • {room.capacity} seats
                              {room.hasBeamer && ' • Beamer'}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedRoomData && (
                    <Card className="mt-3 p-3 bg-blue-50 border-blue-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium mb-2">{selectedRoomData.roomName}</div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>Floor {selectedRoomData.floor}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{selectedRoomData.capacity} seats</span>
                            </div>
                            {selectedRoomData.hasBeamer && (
                              <div className="flex items-center gap-1">
                                <Projector className="w-4 h-4" />
                                <span>Beamer</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge variant={selectedRoomData.isAvailable ? 'default' : 'secondary'}>
                          {selectedRoomData.isAvailable ? 'Available' : 'Occupied'}
                        </Badge>
                      </div>
                    </Card>
                  )}
                </div>

                {/* Step 2: Select Date */}
                <div>
                  <Label htmlFor="date" className="text-base mb-2 block">2. Select Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    disabled={!selectedRoom}
                    className="w-full"
                  />
                </div>

                {/* Step 3: Select Start Time */}
                <div>
                  <Label htmlFor="startTime" className="text-base mb-2 block">3. Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={!bookingDate}
                    className="w-full"
                  />
                </div>

                {/* Step 4: Select End Time */}
                <div>
                  <Label htmlFor="endTime" className="text-base mb-2 block">4. End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={!bookingDate}
                    min={startTime}
                    className="w-full"
                  />
                  {!isValidTimeRange() && endTime && (
                    <p className="text-sm text-red-500 mt-1">End time must be after start time</p>
                  )}
                </div>

                {/* Step 5: Enter Description */}
                <div>
                  <Label htmlFor="description" className="text-base mb-2 block">5. Course/Subject Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Computer Science 101"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!bookingDate || !startTime || !endTime}
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleBookRoom}
                  disabled={!selectedRoom || !bookingDate || !startTime || !endTime || !description || !isValidTimeRange()}
                  className="w-full h-12"
                  size="lg"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirm Booking
                </Button>
              </div>
            </Card>

            {/* Info Card */}
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex gap-3">
                <div className="text-yellow-600">ℹ️</div>
                <div className="text-sm">
                  <p className="font-medium mb-1">Professor Booking Priority</p>
                  <p className="text-gray-600">
                    Your bookings will block the room for the entire time slot. Students will not be able to check in during your reserved time.
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
