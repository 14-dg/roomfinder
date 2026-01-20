import { DaySchedule } from "./DaySchedule";

export default interface RoomSchedule {
  roomId: string;
  schedule: DaySchedule[];
}