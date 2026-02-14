/**
 * CheckIn interface represents a user's room occupancy session.
 * Tracks when a user enters and leaves a room for activity monitoring.
 */
export interface CheckIn {
    /** Unique identifier for this check-in record */
    id: string;
    /** ID of the room being checked into */
    roomId: string;
    /** ID of the user checking in */
    userId: string;
    /** ISO timestamp when the user checked in (e.g., "2024-01-20T13:33:00.000Z") */
    startTime: string;
    /** ISO timestamp when the user checked out */
    endTime: string;
}