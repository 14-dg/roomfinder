export interface Booking {
  id: string;
  roomId: string;
  day: string;
  timeSlot: string;
  subject: string;
  bookedBy: string;
  bookedByName: string;
  createdAt: Date;
}