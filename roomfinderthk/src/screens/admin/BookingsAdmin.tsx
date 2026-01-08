import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useData } from '@/contexts/DataContext';

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
              <TableHead>Priority</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                  No bookings
                </TableCell>
              </TableRow>
            ) : (
              bookings
                .sort((a, b) =>
                  a.bookedByRole === 'professor' ? -1 : 1
                )
                .map((b) => {
                  const room = rooms.find((r) => r.id === b.roomId);
                  const isProfessor = b.bookedByRole === 'professor';

                  return (
                    <TableRow key={b.id} className={isProfessor ? 'bg-blue-50' : ''}>
                      <TableCell>
                        <Badge className={isProfessor ? 'bg-blue-600' : ''}>
                          {isProfessor ? 'High' : 'Normal'}
                        </Badge>
                      </TableCell>
                      <TableCell>{room?.roomNumber}</TableCell>
                      <TableCell>{b.day}</TableCell>
                      <TableCell>{b.timeSlot}</TableCell>
                      <TableCell>{b.subject}</TableCell>
                      <TableCell>{b.bookedByName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{b.bookedByRole}</Badge>
                      </TableCell>
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
