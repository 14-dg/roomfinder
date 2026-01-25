import type { Database } from "@/types/supabasetypes";

/**
 * In dieser Datei werden die automatisch generierten Typen des Datenbankschemas 
 */

type PublicTable = Database['public']['Tables'];

/**
 * @readonly
 */
type Row<T extends keyof PublicTable> = PublicTable[T]["Row"];

/**
 * 
 */
type Insert<T extends keyof PublicTable> = PublicTable[T]["Insert"];

/**
 * 
 */
type Update<T extends keyof PublicTable> = PublicTable[T]["Update"];

//Campuses

export type Campus = Row<"campuses">;
export type NewCampus = Insert<"campuses">;
export type UpdateCampus = Update<"campuses">;

//Buildings

export type Building = Row<"buildings">;
export type NewBuilding = Insert<"buildings">;
export type UpdateBuilding = Update<"buildings">;

//RoomTypes

export type RoomType = Row<"room_types">;
export type NewRoomType = Insert<"room_types">;
export type UpdateRoomType = Update<"room_types">;

//Rooms

export type Room = Row<"rooms">;
export type NewRoom = Insert<"rooms">;
export type UpdateRoom = Update<"rooms">;

/**
 * Stellt einen Raum mit all seinen Attributen dar und beinhaltet auch die Objekte die durch building_id und room_type_id referenziert werden.
 */
export type RoomWithDetails = Room & {
    room_type: RoomType | null;
    building: Building | null & {
        campus: Campus | null;
    };
}

//Equipment

export type Equipment = Row<"equipment">;
export type NewEquipment = Insert<"equipment">;
export type UpdateEquipment = Update<"equipment">;

//RoomEquipment

export type RoomEquipment = Row<"room_equipment">;
export type NewRoomEquipment = Insert<"room_equipment">;
export type UpdateRoomEquipment = Update<"room_equipment">;

//Lecturers

export type Lecturer = Row<"lecturers">;
export type NewLecturer = Insert<"lecturers">;
export type UpdateLecturer = Update<"lecturers">;

//Bookings

export type Booking = Row<"bookings">;
export type NewBooking = Insert<"bookings">;
export type UpdateBooking = Update<"bookings">;

//LectureTimeslots

export type LectureTimeslot = Row<"lecture_timeslots">;
export type NewLectureTimeslot = Insert<"lecture_timeslots">;
export type UpdateLectureTimeslot = Update<"lecture_timeslots">;

//Lectures

export type Lecture = Row<"lectures">;
export type NewLecture = Insert<"lectures">;
export type UpdateLecture = Update<"lectures">;