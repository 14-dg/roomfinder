import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  getAuth,
} from "firebase/auth";
import { initializeApp, deleteApp } from "firebase/app";

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
import { app, auth, db, firebaseConfig } from '../firebase-config';
import { initialClasses, initialRooms } from '@/mockData/mockData';

import User from "@/models/User";

// ============================================================================
// AUTHENTICATION SERVICES
// ============================================================================


export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: 'student' | 'professor' | 'admin',
  additionalData: any = {} // Ermöglicht das Mitgeben von Prof-Daten
): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userProfile = {
      email,
      name,
      role,
      favourites: [],
      timetable: [],
      createdAt: serverTimestamp(),
      ...additionalData, // Hier landen department, officeHours, etc.
    };

    await setDoc(doc(db, 'users', uid), userProfile);

    return {
      id: uid,
      ...userProfile,
    } as User;
  } catch (err) {
    console.error("REGISTER FAILED:", err);
    throw err;
  }
}

async function registerUserWithoutLogin(
  email: string,
  password: string,
  name: string,
  role: 'student' | 'professor' | 'admin',
  additionalData: any = {}
): Promise<User> {
  const tempAppName = `temp-app-${Date.now()}`;
  const tempApp = initializeApp(firebaseConfig, tempAppName);
  const tempAuth = getAuth(tempApp);

  try {
    const userCredential = await createUserWithEmailAndPassword(tempAuth, email, password);
    const uid = userCredential.user.uid;

    const userProfile = {
      email,
      name,
      role,
      favourites: [],
      timetable: [],
      createdAt: serverTimestamp(),
      ...additionalData,
    };

    await setDoc(doc(db, 'users', uid), userProfile);

    await deleteApp(tempApp); 

    return { id: uid, ...userProfile } as User;
  } catch (err) {
    await deleteApp(tempApp);
    console.error("REGISTER WITHOUT LOGIN FAILED:", err);
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
  await updateDoc(doc(db, "rooms", roomId), updates);
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

export async function getRoomLectures(roomId: string): Promise<Lecture[]> {
  try {
    const q = query(
      collection(db, 'lectures'),
      where('roomId', '==', roomId) 
    );
    const snapshot = await getDocs(q);
    console.log(`Geladene Vorlesungen für Raum ${roomId}:`, snapshot.docs.length);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as Lecture[];
  } catch (error) {
    console.error("Fehler beim Laden der Raum-Vorlesungen:", error);
    return [];
  }
}

export async function uploadTimetableAsLectures(roomId: string, schedule: DaySchedule[]): Promise<void> {
  try {
    for (const dayData of schedule) {
      for (const slot of dayData.slots) {
        if (slot.subject && slot.subject.trim() !== "") {
          
          const newLecture: Omit<Lecture, 'id'> = {
            name: slot.subject,
            type: 'Vorlesung',       
            professor: 'Nicht zugewiesen', 
            roomId: roomId,          
            day: dayData.day,        
            startTime: slot.start,   
            endTime: slot.end,       
            subject: slot.subject,   
          };

          await addLecture(newLecture);
        }
      }
    }
    console.log(`Stundenplan für Raum ${roomId} erfolgreich hochgeladen.`);
  } catch (error) {
    console.error("Fehler beim Upload:", error);
    throw error;
  }
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
    // const savedLectures = localStorage.getItem('classes');
    // return savedLectures ? JSON.parse(savedLectures) : initialClasses;

    const lecturesCollection = collection(db, 'lectures');
    const snapshot = await getDocs(lecturesCollection);
    const lectures = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Lecture[];

    return lectures;
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
 * Simuliert das Senden einer Email (z.B. via EmailJS oder Cloud Functions)
 */
export async function sendEmailToProfessorForPassword(email: string, password: string) {
  console.log(`Email gesendet an ${email} mit Passwort: ${password}`);
  // Hier würde später dein echter Email-Service-Aufruf stehen
  return new Promise((resolve) => setTimeout(resolve, 800)); 
}
/**
 * Holt alle User, die die Rolle 'professor' haben
 */
export async function getLecturers(): Promise<any[]> {
  const q = query(collection(db, "users"), where("role", "==", "professor"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

/**
 * Registriert einen Professor mit den erweiterten Attributen
 */
export async function registerProfessor(email: string, password: string, name: string) {
  const professorFields = {
    department: '',
    officeHours: '',
    officeLocation: '',
    lectures: []
  };
  
  return await registerUserWithoutLogin(email, password, name, 'professor', professorFields);
}

/**
 * Update für Professor-spezifische Felder
 */
export async function updateLecturerProfile(id: string, updates: any) {
  const userRef = doc(db, 'users', id);
  // Wir nutzen updateDoc, um nur die geänderten Felder zu überschreiben
  await updateDoc(userRef, updates);
}

/**
 * Löscht den User-Account aus Firestore
 */
export async function deleteProfessorAndLecturer(id: string) {
  await deleteDoc(doc(db, 'users', id));
  // Hinweis: Der Auth-Account muss ggf. separat über Admin-Funktionen gelöscht werden
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


// ============================================================================
// FIREBASE HELPER FUNCTIONS TO MANAGE ACCOUNTS AND ENTRIES   
// ============================================================================
/**
 * Holt absolut alle Dokumente aus der Collection 'users'.
 * Hilfreich für Debugging, um die Datenstruktur im Firestore zu prüfen.
 */
export async function getAllUsersRaw(): Promise<any[]> {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const users = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    console.log("DEBUG - Alle User aus Firestore:", users);
    return users;
  } catch (error) {
    console.error("Fehler beim Laden aller User:", error);
    throw error;
  }
}

// ============================================================================
// LECTURES
// ============================================================================

export async function addLecture(lecture: Omit<Lecture, 'id'>) {
  try {

    const newDocRef = doc(collection(db, 'lectures'));
    const newLecture: Lecture = {
      ...lecture,
      id: newDocRef.id
    };
    await setDoc(newDocRef, newLecture);
  }
  catch(error) {
    throw error;
  }
}

export async function removeLecture(id: string) {
  try {
    await deleteDoc(doc(db, 'lectures', id));
  }
  catch(error) {
    throw error;
  }
}