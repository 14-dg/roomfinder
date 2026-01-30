import { useState, useCallback } from 'react';
import { Booking, CheckIn, RoomWithStatus } from '@/models';
import { 
  addBooking as addBookingService, 
  deleteBooking as deleteBookingService, 
  addStudentCheckin as addCheckinService, 
  removeStudentCheckin as removeCheckinService,
  updateRoom as updateRoomService 
} from "@/services/firebase";
import { toast } from 'sonner';

export function useBookingData(rooms: RoomWithStatus[], refreshRooms: () => void) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [studentCheckins, setStudentCheckins] = useState<CheckIn[]>([]);

  const addBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    try {
      const saved = await addBookingService(booking);
      setBookings(prev => [...prev, saved]);
      toast.success("Raum reserviert");
    } catch { toast.error("Buchung fehlgeschlagen"); }
  };

  const removeBooking = async (id: string) => {
    await deleteBookingService(id);
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const addStudentCheckin = async (checkin: Omit<CheckIn, 'id'>) => {
    try {
      const newId = await addCheckinService(checkin);
      setStudentCheckins(prev => [...prev, { ...checkin, id: newId }]);
      
      const room = rooms.find(r => r.id === checkin.roomId);
      if (room) {
        await updateRoomService(room.id, { checkins: (room.checkins || 0) + 1 });
        refreshRooms();
      }
    } catch { toast.error("Check-in fehlgeschlagen"); }
  };

  const removeStudentCheckin = async (id: string) => {
    const checkin = studentCheckins.find(c => c.id === id);
    if (!checkin) return;
    await removeCheckinService(id);
    setStudentCheckins(prev => prev.filter(c => c.id !== id));
    
    const room = rooms.find(r => r.id === checkin.roomId);
    if (room) {
      await updateRoomService(room.id, { checkins: Math.max(0, (room.checkins || 0) - 1) });
      refreshRooms();
    }
  };

  return { bookings, setBookings, studentCheckins, setStudentCheckins, addBooking, removeBooking, addStudentCheckin, removeStudentCheckin };
}