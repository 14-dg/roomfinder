import { useData } from "@/contexts/DataContext";

/**
 * Retrieves the display name of a lecturer given their user ID.
 * Falls back to displaying the user ID if lecturer is not found.
 * 
 * @param userId - The unique identifier of the lecturer/user
 * @returns The lecturer's name if found, otherwise returns the userId
 */
export function getLecturerName(userId: string): string {

    const {lecturers} = useData();
    const lecturer = lecturers?.find(l => l.id === userId);
    if (lecturer?.name) {
      return lecturer.name;
    }
    return userId;
  };