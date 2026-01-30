import { useState, useCallback } from 'react';
import { Lecture } from '@/models';
import * as fb from "@/services/firebase";
import { toast } from 'sonner';

export function useLecturerData(classes: Lecture[]) {
  const [lecturers, setLecturers] = useState<any[]>([]);

  const refreshLecturers = useCallback(async () => {
    const data = await fb.getLecturers();
    setLecturers(data);
  }, []);

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

  const removeProfessor = async (id: string) => {
    await fb.deleteProfessorAndLecturer(id);
    await refreshLecturers();
  };

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