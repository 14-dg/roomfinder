import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useData } from '@/contexts/DataContext';

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

export default function BookingsAdmin() {
  const { bookings, rooms, clearAllBookings, removeBooking } = useData();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between mb-4">
          <div>
            <h3>All Bookings ({bookings.length})</h3>
            <p className="text-sm text-gray-500">
              Professor bookings have priority
            </p>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm('Clear all bookings?')) {
                clearAllBookings();
                toast.success('All bookings cleared');
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Booked By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No bookings
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((b) => {
                const room = rooms.find((r) => r.id === b.roomId);
                const startTime = formatTimeFromISO(b.startDate);
                const endTime = formatTimeFromISO(b.endDate);
                const bookingDate = formatDateFromISO(b.startDate);

                return (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{room?.roomName}</TableCell>
                    <TableCell>{bookingDate}</TableCell>
                    <TableCell>{startTime} - {endTime}</TableCell>
                    <TableCell>{b.description}</TableCell>
                    <TableCell>{b.bookedBy}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('Delete booking?')) {
                            removeBooking(b.id);
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
      </Card>
    </div>
  );
}
