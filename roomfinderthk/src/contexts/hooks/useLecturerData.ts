import { useState, useCallback } from 'react';
import { Lecture } from '@/models';
import * as fb from "@/services/firebase";
import { toast } from 'sonner';

/**
 * Custom hook for managing lecturers/professors in the system.
 * Handles professor registration, office hours updates, and lecturer information.
 * 
 * @param classes - Array of all lectures to filter by lecturer
 * @returns Object containing lecturer data and management operations
 */
export function useLecturerData(classes: Lecture[]) {
  const [lecturers, setLecturers] = useState<any[]>([]);

  /**
   * Refreshes the lecturers list from Firebase.
   */
  const refreshLecturers = useCallback(async () => {
    const data = await fb.getLecturers();
    setLecturers(data);
  }, []);

  /**
   * Registers a new professor and sends a temporary password via email.
   * 
   * @param email - Email address of the new professor
   * @param name - Full name of the professor
   */
  const addProfessor = async (email: string, name: string) => {
    try {
      const tempPassword = "123456";
      const newProf = await fb.registerProfessor(email, tempPassword, name);
      setLecturers(prev => [...prev, newProf]);
      await fb.sendEmailToProfessorForPassword(email, tempPassword);
      toast.success(`${name} als Professor registriert`);
    } catch (error) {
      toast.error("Registrierung fehlgeschlagen");
    }
  };

  /**
   * Updates a professor's office hours and location.
   * 
   * @param id - ID of the professor to update
   * @param time - Office hours in time format (e.g., "14:00-16:00")
   * @param room - Room number or location of the office
   */
  const updateOfficeHours = async (id: string, time: string, room: string) => {
    try {
      const updates = { officeHours: time, officeLocation: room };
      await fb.updateLecturerProfile(id, updates);
      setLecturers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
      toast.success("Sprechzeiten aktualisiert");
    } catch (error) {
      toast.error("Update fehlgeschlagen");
    }
  };

  /**
   * Deletes a professor from the system along with their associated data.
   * 
   * @param id - ID of the professor to remove
   */
  const removeProfessor = async (id: string) => {
    await fb.deleteProfessorAndLecturer(id);
    await refreshLecturers();
  };

  /**
   * Selector: Get all lectures taught by a specific professor.
   * 
   * @param professorId - ID of the professor
   * @returns Array of lectures taught by the professor
   */
  const getProfessorLectures = useCallback((professorId: string): Lecture[] => {
    return classes.filter(l => l.professor === professorId);
  }, [classes]);

  return { 
    lecturers, 
    setLecturers, 
    addProfessor, 
    updateOfficeHours, 
    removeProfessor, 
    refreshLecturers,
    getProfessorLectures 
  };
}