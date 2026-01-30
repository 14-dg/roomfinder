import { useState, useCallback } from 'react';
import { RoomWithStatus, Lecture, Booking } from '@/models';
import { getAllRooms, addRoom as addRoomService, updateRoom as updateRoomService, deleteRoom as deleteRoomService } from "@/services/firebase";
import { checkRoomAvailability } from '@/utils/availability';

export function useRoomData(classes: Lecture[], bookings: Booking[]) {
  const [rooms, setRooms] = useState<RoomWithStatus[]>([]);

  const refreshRooms = useCallback(async () => {
    const updatedRooms = await getAllRooms();
    setRooms(updatedRooms);
  }, []);

  const addRoom = async (room: RoomWithStatus) => {
    const { id, ...roomData } = room;
    await addRoomService(roomData);
    await refreshRooms();
  };

  const updateRoom = async (id: string, updates: Partial<RoomWithStatus>) => {
    await updateRoomService(id, updates);
    await refreshRooms();
  };

  const deleteRoom = async (id: string) => {
    await deleteRoomService(id);
    await refreshRooms();
  };

  const roomsWithDerivedStatus = rooms.map(room => ({
    ...room,
    isAvailable: checkRoomAvailability(room.id, classes, bookings)
  }));

  return { rooms: roomsWithDerivedStatus, setRooms, addRoom, updateRoom, deleteRoom, refreshRooms };
}