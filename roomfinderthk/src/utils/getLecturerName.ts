import { useData } from "@/contexts/DataContext";

export function getLecturerName(userId: string): string {

    const {lecturers} = useData();
    const lecturer = lecturers?.find(l => l.id === userId);
    if (lecturer?.name) {
      return lecturer.name;
    }
    return userId;
  };