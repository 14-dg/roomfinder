export interface Booking {
  id: string;
  roomId: string;
  day: string;
  timeSlot: string;
  subject: string;
  bookedByName: string;
  bookedByRole: string;
  createdAt: Date;
}