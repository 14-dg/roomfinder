import { useData } from "@/contexts/DataContext";

  // Suche Lecturer-Namen basierend auf User ID
export function getLecturerName(userId: string): string {

    const { lecturers } = useData();

    const lecturer = lecturers?.find(l => l.id === userId);
    if (lecturer?.name) {
      return lecturer.name;
    }
    return userId;
}