/**
 * Booking interface represents a room reservation.
 * Can be a temporary booking or a recurring scheduled booking.
 */
export interface Booking {
  /** Unique identifier for the booking */
  id: string;
  /** ID of the room being booked */
  roomId: string;
  /** Start date of the booking in ISO format (e.g., "2024-01-15") */
  startDate: string;
  /** End date of the booking in ISO format */
  endDate: string;
  /** Day of the week (e.g., "Monday", "Tuesday") */
  day: string;
  /** User ID of the person who made the booking */
  bookedBy: string;
  /** Description or title of the booking (e.g., "Team Meeting", "Exam Preparation") */
  description: string;
}