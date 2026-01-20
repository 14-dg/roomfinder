export interface CheckIn {
    id: string;
    roomId: string;
    userId: string;
    startTime: string; // ISO String: "2024-01-20T13:33:00.000Z"
    endTime: string;
}