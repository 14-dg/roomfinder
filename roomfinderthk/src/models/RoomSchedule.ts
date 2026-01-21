import { DaySchedule } from "./DaySchedule";

export interface RoomSchedule {
  roomId: string;
  schedule: DaySchedule[];
}