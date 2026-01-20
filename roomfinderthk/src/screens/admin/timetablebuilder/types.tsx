import { Lecturer, RoomWithStatus, Module, Event } from "@/models";

export interface TimetableBuilderProps {
  courseOfStudy: string;
  semester: string;
  year: number;
}

export interface EventFormProps {
  formData: Partial<Event>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Event>>>;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  isEditing: boolean;
  includeSaturday: boolean;
  lecturers: Lecturer[];
  rooms: RoomWithStatus[];
  modules: Module[];
  addModule: (newModule: Module) => void;
}
