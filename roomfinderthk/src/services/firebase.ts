import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { RoomWithStatus, Booking, Lecture, CheckIn, UserTimetableEntry, DaySchedule, Timetable, Module } from '@/models';
import { app, auth, db } from '../firebase-config';
import { initialClasses, initialRooms } from '@/mockData/mockData';

import User from "@/models/User";

// ============================================================================
// AUTHENTICATION SERVICES
// ============================================================================


export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: 'student' | 'professor' | 'admin'
): Promise<User> {
  try {
    const userCredential =
      await createUserWithEmailAndPassword(auth, email, password);

    const uid = userCredential.user.uid;

    await setDoc(doc(db, 'users', uid), {
      email,
      name,
      role,
      favourites: [],
      timetable: [],
      createdAt: serverTimestamp(),
    });

    return {
      id: uid,
      email,
      name,
      role,
      favourites: [],
      timetable: [],
    };
  } catch (err) {
    console.error("REGISTER FAILED:", err);
    throw err;
  }
}


export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  // 1. Firebase Authentication
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const uid = userCredential.user.uid;

  // 2. User-Profil aus Firestore laden
  const userSnap = await getDoc(doc(db, 'users', uid));

  if (!userSnap.exists()) {
    throw new Error('User profile not found in Firestore');
  }

  const data = userSnap.data();

  return {
    id: uid,
    email: userCredential.user.email ?? email,
    name: data.name,
    role: data.role,
    favourites: data.favourites ?? [],
    timetable: data.timetable ?? [],
  };
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// ============================================================================
// ROOM SERVICES
// ============================================================================

export async function getRooms(): Promise<RoomWithStatus[]> {
  const snapshot = await getDocs(collection(db, "rooms"));
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<RoomWithStatus, "id">),
  }));
}

export async function getRoom(roomId: string): Promise<RoomWithStatus | null> {
  const docSnap = await getDoc(doc(db, "rooms", roomId));
  return docSnap.exists() ? { id: docSnap.id, ...(docSnap.data() as Omit<RoomWithStatus, "id">) } : null;
}

export async function addRoom(room: Omit<RoomWithStatus, "id">): Promise<RoomWithStatus> {
  const docRef = await addDoc(collection(db, "rooms"), room);
  return { id: docRef.id, ...room };
}

export async function updateRoom(roomId: string, updates: Partial<RoomWithStatus>): Promise<void> {
// <<<<<<< HEAD
  await updateDoc(doc(db, "rooms", roomId), updates);
// =======
//   // Placeholder: Using localStorage
//   // Firebase implementation would use:
//   // await updateDoc(doc(db, 'rooms', roomId), updates);
  
//   const rooms = await getAllRooms();
//   const index = rooms.findIndex(r => r.id === roomId);
//   if (index !== -1) {
//     rooms[index] = { ...rooms[index], ...updates };
//     localStorage.setItem('rooms', JSON.stringify(rooms));
//   }
// >>>>>>> master
}

export async function deleteRoom(roomId: string): Promise<void> {
  await deleteDoc(doc(db, "rooms", roomId));
}

// ============================================================================
// BOOKING SERVICES
// ============================================================================

export async function getBookings(): Promise<Booking[]> {
  const snapshot = await getDocs(collection(db, "bookings"));
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Booking, "id">),
  }));
}

export async function getRoomBookings(roomId: string): Promise<Booking[]> {
  const q = query(
    collection(db, "bookings"),
    where("roomId", "==", roomId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Booking, "id">),
  }));
}

export async function addBooking(
  booking: Omit<Booking, "id" | "createdAt">
): Promise<Booking> {
  const docRef = await addDoc(collection(db, "bookings"), {
    ...booking,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...booking,
    createdAt: new Date(),
  };
}

export async function deleteBooking(bookingId: string): Promise<void> {
  await deleteDoc(doc(db, "bookings", bookingId));
}

export async function clearAllBookings(): Promise<void> {
  const snapshot = await getDocs(collection(db, "bookings"));
  await Promise.all(
    snapshot.docs.map(d => deleteDoc(d.ref))
  );
}

// ============================================================================
// CHECKIN SERVICES
// ============================================================================

export async function addStudentCheckin(checkin: Omit<CheckIn, 'id'>): Promise<string> {
  // Wir speichern den Check-in in einer eigenen Collection
  const docRef = await addDoc(collection(db, "checkins"), {
    ...checkin,
    createdAt: serverTimestamp(),
  });
  return docRef.id; // Gibt die von Firestore generierte ID zurück
}

export async function removeStudentCheckin(id: string): Promise<void> {
  await deleteDoc(doc(db, "checkins", id));
}


// ============================================================================
// FAVORITES SERVICES
// ============================================================================

export async function getFavoritesFromFirestore(userId: string): Promise<string[]> {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return [];
  return snap.data().favourites ?? [];
}

export async function addFavoriteToFirestore(
  userId: string,
  roomId: string
): Promise<void> {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    favourites: arrayUnion(roomId),
  });
}

export async function removeFavoriteFromFirestore(
  userId: string,
  roomId: string
): Promise<void> {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    favourites: arrayRemove(roomId),
  });
}


// ============================================================================
// TIMETABLE SERVICES
// ============================================================================

interface RoomSchedule {
  roomId: string;
  schedule: DaySchedule[];
}

/**
 * Get custom timetable for a room
 * TODO: Replace with Firestore query
 * - Use getDoc(doc(db, 'timetables', roomId))
 */
export async function getRoomDetailScreen(roomId: string): Promise<DaySchedule[] | null> { 
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // const docSnap = await getDoc(doc(db, 'timetables', roomId));
  // return docSnap.exists() ? docSnap.data().schedule : null;
  
  const schedules = localStorage.getItem('customSchedules');
  if (!schedules) return null;
  
  const parsed: RoomSchedule[] = JSON.parse(schedules);
  const roomSchedule = parsed.find(s => s.roomId === roomId);
  return roomSchedule ? roomSchedule.schedule : null;
}

/**
 * Upload/Update timetable for a room
 * TODO: Replace with Firestore write
 * - Use setDoc(doc(db, 'timetables', roomId), { schedule })
 */
export async function uploadTimetable(roomId: string, schedule: DaySchedule[]): Promise<void> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // await setDoc(doc(db, 'timetables', roomId), { schedule, updatedAt: serverTimestamp() });
  
  const schedules = localStorage.getItem('customSchedules');
  const parsed: RoomSchedule[] = schedules ? JSON.parse(schedules) : [];
  
  const index = parsed.findIndex(s => s.roomId === roomId);
  if (index !== -1) {
    parsed[index] = { roomId, schedule };
  } else {
    parsed.push({ roomId, schedule });
  }
  
  localStorage.setItem('customSchedules', JSON.stringify(parsed));
}

/**
 * Delete timetable for a room
 * TODO: Replace with Firestore delete
 * - Use deleteDoc(doc(db, 'timetables', roomId))
 */
export async function deleteTimetable(roomId: string): Promise<void> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // await deleteDoc(doc(db, 'timetables', roomId));
  
  const schedules = localStorage.getItem('customSchedules');
  if (!schedules) return;
  
  const parsed: RoomSchedule[] = JSON.parse(schedules);
  const filtered = parsed.filter(s => s.roomId !== roomId);
  localStorage.setItem('customSchedules', JSON.stringify(filtered));
}

// ============================================================================
// REAL-TIME LISTENERS (for future Firebase implementation)
// ============================================================================

/**
 * Subscribe to room updates
 * TODO: Implement with Firestore real-time listener
 * - Use onSnapshot(collection(db, 'rooms'), callback)
 */
export function subscribeToRooms(callback: (rooms: RoomWithStatus[]) => void): () => void {
  // Placeholder: No real-time updates with localStorage
  // Firebase implementation would use:
  // return onSnapshot(collection(db, 'rooms'), (snapshot) => {
  //   const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //   callback(rooms);
  // });
  
  // Return unsubscribe function
  return () => {};
}

/**
 * Subscribe to booking updates
 * TODO: Implement with Firestore real-time listener
 * - Use onSnapshot(collection(db, 'bookings'), callback)
 */
export function subscribeToBookings(callback: (bookings: Booking[]) => void): () => void {
  // Placeholder: No real-time updates with localStorage
  // Firebase implementation would use:
  // return onSnapshot(collection(db, 'bookings'), (snapshot) => {
  //   const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //   callback(bookings);
  // });
  
  // Return unsubscribe function
  return () => {};
}

// ============================================================================
// Startup Functions
// ============================================================================
// DataContext ruft diese Funktionen auf, um alle Daten zu bekommen

export async function getAllRooms(): Promise<RoomWithStatus[]> {
  return await getRooms();
}

export async function getAllBookings(): Promise<Booking[]> {
  return await getBookings();
}

export async function getAllStudentCheckins(): Promise<CheckIn[]> {
  const snapshot = await getDocs(collection(db, "checkins"));
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<CheckIn, "id">),
  }));
}

export async function getAllCustomSchedules(): Promise<RoomSchedule[]> {
    const savedSchedules = localStorage.getItem('customSchedules');
    return savedSchedules ? JSON.parse(savedSchedules) : [];
}

export async function getAllLectures(): Promise<Lecture[]> {
    const savedLectures = localStorage.getItem('classes');
    return savedLectures ? JSON.parse(savedLectures) : initialClasses;
  }
  
  export async function getAllUserTimetableEntries(): Promise<UserTimetableEntry[]> {
    const savedEntries = localStorage.getItem('userTimetableEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  }

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a time slot is available
 */
export async function isTimeSlotAvailable(
  roomId: string,
  day: string,
  timeSlot: string
): Promise<boolean> {
  const bookings = await getRoomBookings(roomId);
  return !bookings.some(b => b.day === day && b.timeSlot === timeSlot);
}

/**
 * Get user's bookings
 */
export async function getUserBookings(userId: string): Promise<Booking[]> {
  const bookings = await getBookings();
  return bookings.filter(b => b.bookedBy === userId);
}



// ============================================================================
// PROFESSOR SERVICES
// ============================================================================
/**
 * Holt alle Nutzer mit der Rolle 'professor'
 * TODO: Firebase Query: query(collection(db, 'users'), where('role', '==', 'professor'))
 */
// --- In firebase.ts HINZUFÜGEN oder ERSETZEN ---

/**
 * Simuliert das Senden einer Email (z.B. via EmailJS oder Cloud Functions)
 */
export async function sendEmailToProfessorForPassword(email: string, password: string) {
  console.log(`Email gesendet an ${email} mit Passwort: ${password}`);
  // Hier würde später dein echter Email-Service-Aufruf stehen
  return new Promise((resolve) => setTimeout(resolve, 800)); 
}

/**
 * Erstellt User-Account UND Lecturer-Profil
 */
export async function registerProfessor(email: string, password: string, name: string) {
  // 1. Technischer User (für Login)
  const newUser = await registerUser(email, password, name, 'professor');
  
  // 2. Öffentliches Profil (für Timetable/Sprechzeiten)
  const lecturers = JSON.parse(localStorage.getItem('lecturers') || '[]');
  const newLecturer = {
    id: newUser.id, // Verknüpfung über gleiche ID
    name,
    email,
    officeHours: '',
    officeLocation: '',
  };
  lecturers.push(newLecturer);
  localStorage.setItem('lecturers', JSON.stringify(lecturers));
  
  return { newUser, newLecturer };
}

// Holen aller Lecturer
export async function getLecturers(): Promise<any[]> {
  const data = localStorage.getItem('lecturers');
  return data ? JSON.parse(data) : [];
}

// Update Profil (Sprechzeiten)
export async function updateLecturerProfile(id: string, updates: any) {
  const lecturers = await getLecturers();
  const index = lecturers.findIndex(l => l.id === id);
  if (index !== -1) {
    lecturers[index] = { ...lecturers[index], ...updates };
    localStorage.setItem('lecturers', JSON.stringify(lecturers));
  }
}

// Löschen beider Einträge
export async function deleteProfessorAndLecturer(id: string) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  localStorage.setItem('users', JSON.stringify(users.filter((u: any) => u.id !== id)));
  
  const lecturers = await getLecturers();
  localStorage.setItem('lecturers', JSON.stringify(lecturers.filter(l => l.id !== id)));
}


// ============================================================================
//                            TIMETABLEBUILDER
// ============================================================================


export function saveTimetableFire(timetable: Timetable) {
  const updatedTimetables = loadTimetables();
  const existingIndex = updatedTimetables.findIndex(t => t.id === timetable.id);

  if(existingIndex >= 0) {
    updatedTimetables[existingIndex] = timetable;
  } else {
    updatedTimetables.push(timetable);
  }

  localStorage.setItem('timetables', JSON.stringify(updatedTimetables));
};

export const loadTimetables = (): Timetable[] => {
  const data = localStorage.getItem('timetables');
  return data ? JSON.parse(data) : [];
}

export const saveModulesFire = (modules: Module[]): void => {
  localStorage.setItem('modules', JSON.stringify(modules));
};

export const loadModules = (): Module[] => {
  const data = localStorage.getItem('modules');
  return data ? JSON.parse(data) : [];
};

// ============================================================================
// USER EVENT TIMETABLE SERVICES
// ============================================================================

/**
 * Add an event to user's timetable
 * TODO: Replace with Firestore write
 * - Use addDoc(collection(db, 'userEvents'), eventData)
 */
export async function addUserEvent(entry: UserTimetableEntry): Promise<UserTimetableEntry> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // const docRef = await addDoc(collection(db, 'userEvents'), entry);
  // return { id: docRef.id, ...entry };
  
  const entries = await getAllUserTimetableEntries();
  const newEntry: UserTimetableEntry = {
    ...entry,
    id: entry.id || Date.now().toString(),
  };
  entries.push(newEntry);
  localStorage.setItem('userTimetableEntries', JSON.stringify(entries));
  return newEntry;
}

/**
 * Remove an event from user's timetable
 * TODO: Replace with Firestore delete
 * - Use deleteDoc(doc(db, 'userEvents', entryId))
 */
export async function removeUserEvent(userId: string, classId: string): Promise<void> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // await deleteDoc(doc(db, 'userEvents', entryId));
  
  const entries = await getAllUserTimetableEntries();
  const filtered = entries.filter(e => !(e.userId === userId && e.classId === classId));
  localStorage.setItem('userTimetableEntries', JSON.stringify(filtered));
}

/**
 * Get all events for a user
 * TODO: Replace with Firestore query
 * - Use query(collection(db, 'userEvents'), where('userId', '==', userId))
 */
export async function getUserEventsByUserId(userId: string): Promise<UserTimetableEntry[]> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // const q = query(collection(db, 'userEvents'), where('userId', '==', userId));
  // const querySnapshot = await getDocs(q);
  // return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  const entries = await getAllUserTimetableEntries();
  return entries.filter(e => e.userId === userId);
}


export async function addLecture(lecture: Lecture) {
  
}

export async function removeLecture(id: string) {

}