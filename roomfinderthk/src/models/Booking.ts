export interface Booking {
  id: string;
  roomId: string;
  startDate: string;  //ISO Date
  endDate: string;    //ISO Date
  day: string;
  bookedBy: string;
  description: string;
}