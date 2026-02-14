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

/**
 * Custom hook for managing room bookings and student check-ins.
 * Handles creation/deletion of bookings and tracks real-time room occupancy.
 * 
 * @param rooms - Array of rooms to update occupancy counts
 * @param refreshRooms - Function to refresh room data after occupancy changes
 * @returns Object containing bookings, check-ins, and related operations
 */
export function useBookingData(rooms: RoomWithStatus[], refreshRooms: () => void) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [studentCheckins, setStudentCheckins] = useState<CheckIn[]>([]);

  /**
   * Creates a new room booking.
   * Adds booking to database and updates local state.
   * 
   * @param booking - Booking data to add (without ID and createdAt)
   */
  const addBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    try {
      const saved = await addBookingService(booking);
      setBookings(prev => [...prev, saved]);
      toast.success("Raum reserviert");
    } catch { toast.error("Buchung fehlgeschlagen"); }
  };

  /**
   * Deletes an existing room booking.
   * 
   * @param id - ID of the booking to delete
   */
  const removeBooking = async (id: string) => {
    await deleteBookingService(id);
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  /**
   * Records a student check-in to a room.
   * Updates occupancy count and notifies users via toast.
   * 
   * @param checkin - Check-in data (without ID)
   */
  const addStudentCheckin = async (checkin: Omit<CheckIn, 'id'>) => {
    try {
      const newId = await addCheckinService(checkin);
      setStudentCheckins(prev => [...prev, { ...checkin, id: newId }]);
      
      // Update room occupancy count
      const room = rooms.find(r => r.id === checkin.roomId);
      if (room) {
        await updateRoomService(room.id, { checkins: (room.checkins || 0) + 1 });
        refreshRooms();
      }
    } catch { toast.error("Check-in fehlgeschlagen"); }
  };

  /**
   * Records a student check-out from a room.
   * Decrements occupancy count and notifies users via toast.
   * 
   * @param id - ID of the check-in record to remove
   */
  const removeStudentCheckin = async (id: string) => {
    const checkin = studentCheckins.find(c => c.id === id);
    if (!checkin) return;
    await removeCheckinService(id);
    setStudentCheckins(prev => prev.filter(c => c.id !== id));
    
    // Update room occupancy count
    const room = rooms.find(r => r.id === checkin.roomId);
    if (room) {
      await updateRoomService(room.id, { checkins: Math.max(0, (room.checkins || 0) - 1) });
      refreshRooms();
    }
  };

  return { bookings, setBookings, studentCheckins, setStudentCheckins, addBooking, removeBooking, addStudentCheckin, removeStudentCheckin };
}