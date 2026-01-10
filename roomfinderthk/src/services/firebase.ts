/**
 * Firebase Service
 * 
 * This file contains all Firebase integration access points.
 * Currently uses localStorage for data persistence, but is structured
 * to easily integrate with Firebase when ready.
 * 
 * To implement Firebase:
 * 1. Install firebase: npm install firebase
 * 2. Initialize Firebase app with your config
 * 3. Replace localStorage implementations with Firebase SDK calls
 * 4. Update function signatures as needed for Firebase types
 */

import { RoomWithStatus, Booking, Lecture, CheckIn, UserTimetableEntry } from '@/models';
import { app, auth, db } from '../firebase-config';

// Initialize Firebase (placeholder)
// TODO: Uncomment when implementing Firebase
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// ============================================================================
// AUTHENTICATION SERVICES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'professor' | 'admin';
}

/**
 * Register a new user
 * TODO: Replace with Firebase Authentication
 * - Use createUserWithEmailAndPassword from firebase/auth
 * - Store user profile in Firestore
 */
export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: 'student' | 'professor' | 'admin'
): Promise<User> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // await setDoc(doc(db, 'users', userCredential.user.uid), { name, role });
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    role,
  };
  users.push({ ...newUser, password });
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
}

/**
 * Sign in with email and password
 * TODO: Replace with Firebase Authentication
 * - Use signInWithEmailAndPassword from firebase/auth
 * - Fetch user profile from Firestore
 */
export async function loginUser(email: string, password: string): Promise<User> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // const userCredential = await signInWithEmailAndPassword(auth, email, password);
  // const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

/**
 * Sign out current user
 * TODO: Replace with Firebase Authentication
 * - Use signOut from firebase/auth
 */
export async function logoutUser(): Promise<void> {
  // Placeholder: No action needed for localStorage
  // Firebase implementation would use:
  // await signOut(auth);
  
  return Promise.resolve();
}

/**
 * Get current user session
 * TODO: Replace with Firebase Authentication
 * - Use onAuthStateChanged from firebase/auth
 */
export function getCurrentUser(): User | null {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // auth.currentUser and fetch from Firestore
  
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? JSON.parse(currentUser) : null;
}

// ============================================================================
// ROOM SERVICES
// ============================================================================

/**
 * Get all rooms
 * TODO: Replace with Firestore query
 * - Use getDocs(collection(db, 'rooms'))
 */
export async function getRooms(): Promise<Room[]> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // const snapshot = await getDocs(collection(db, 'rooms'));
  // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  const rooms = localStorage.getItem('rooms');
  return rooms ? JSON.parse(rooms) : [];
}

/**
 * Get a single room by ID
 * TODO: Replace with Firestore query
 * - Use getDoc(doc(db, 'rooms', roomId))
 */
export async function getRoom(roomId: string): Promise<Room | null> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // const docSnap = await getDoc(doc(db, 'rooms', roomId));
  // return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  
  const rooms = await getRooms();
  return rooms.find(r => r.id === roomId) || null;
}

/**
 * Add a new room
 * TODO: Replace with Firestore write
 * - Use addDoc(collection(db, 'rooms'), roomData)
 */
export async function addRoom(room: Omit<Room, 'id'>): Promise<Room> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // const docRef = await addDoc(collection(db, 'rooms'), room);
  // return { id: docRef.id, ...room };
  
  const rooms = await getRooms();
  const newRoom: Room = {
    ...room,
    id: Date.now().toString(),
  };
  rooms.push(newRoom);
  localStorage.setItem('rooms', JSON.stringify(rooms));
  return newRoom;
}

/**
 * Update a room
 * TODO: Replace with Firestore update
 * - Use updateDoc(doc(db, 'rooms', roomId), updates)
 */
export async function updateRoom(roomId: string, updates: Partial<Room>): Promise<void> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // await updateDoc(doc(db, 'rooms', roomId), updates);
  
  const rooms = await getRooms();
  const index = rooms.findIndex(r => r.id === roomId);
  if (index !== -1) {
    rooms[index] = { ...rooms[index], ...updates };
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }
}

/**
 * Delete a room
 * TODO: Replace with Firestore delete
 * - Use deleteDoc(doc(db, 'rooms', roomId))
 */
export async function deleteRoom(roomId: string): Promise<void> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // await deleteDoc(doc(db, 'rooms', roomId));
  
  const rooms = await getRooms();
  const filteredRooms = rooms.filter(r => r.id !== roomId);
  localStorage.setItem('rooms', JSON.stringify(filteredRooms));
}

// ============================================================================
// BOOKING SERVICES
// ============================================================================

/**
 * Get all bookings
 * TODO: Replace with Firestore query
 * - Use getDocs(collection(db, 'bookings'))
 */
export async function getBookings(): Promise<Booking[]> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // const snapshot = await getDocs(collection(db, 'bookings'));
  // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  const bookings = localStorage.getItem('bookings');
  return bookings ? JSON.parse(bookings) : [];
}

/**
 * Get bookings for a specific room
 * TODO: Replace with Firestore query
 * - Use query(collection(db, 'bookings'), where('roomId', '==', roomId))
 */
export async function getRoomBookings(roomId: string): Promise<Booking[]> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // const q = query(collection(db, 'bookings'), where('roomId', '==', roomId));
  // const snapshot = await getDocs(q);
  // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  const bookings = await getBookings();
  return bookings.filter(b => b.roomId === roomId);
}

/**
 * Add a new booking
 * TODO: Replace with Firestore write
 * - Use addDoc(collection(db, 'bookings'), bookingData)
 */
export async function addBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // const docRef = await addDoc(collection(db, 'bookings'), { ...booking, createdAt: serverTimestamp() });
  // return { id: docRef.id, ...booking, createdAt: new Date() };
  
  const bookings = await getBookings();
  const newBooking: Booking = {
    ...booking,
    id: Date.now().toString(),
    createdAt: new Date(),
  };
  bookings.push(newBooking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
  return newBooking;
}

/**
 * Delete a booking
 * TODO: Replace with Firestore delete
 * - Use deleteDoc(doc(db, 'bookings', bookingId))
 */
export async function deleteBooking(bookingId: string): Promise<void> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // await deleteDoc(doc(db, 'bookings', bookingId));
  
  const bookings = await getBookings();
  const filteredBookings = bookings.filter(b => b.id !== bookingId);
  localStorage.setItem('bookings', JSON.stringify(filteredBookings));
}

/**
 * Delete all bookings (Admin only)
 * TODO: Replace with Firestore batch delete
 * - Use batch writes to delete all booking documents
 */
export async function clearAllBookings(): Promise<void> {
  // Placeholder: Using localStorage
  // Firebase implementation would use:
  // const batch = writeBatch(db);
  // const snapshot = await getDocs(collection(db, 'bookings'));
  // snapshot.docs.forEach(doc => batch.delete(doc.ref));
  // await batch.commit();
  
  localStorage.setItem('bookings', JSON.stringify([]));
}

// ============================================================================
// FAVORITES SERVICES
// ============================================================================

/**
 * Get favorites for a user
 * 
 * TODO: Replace with Firestore query
 * - Use getDoc(doc(db, 'favorites', userId))
 */
export async function getFavoritesFromFirestore(userId: string): Promise<string[]> {
  // const docSnap = await getDoc(doc(db, 'favorites', userId));
  // return docSnap.exists() ? docSnap.data().roomIds : [];

  // -----------------------------
  // Placeholder: localStorage
  // -----------------------------
  const raw = localStorage.getItem(`favorites_${userId}`);
  return raw ? JSON.parse(raw) : [];
}

/**
 * Save favorites for a user
 * 
 * TODO: Replace with Firestore write
 * - Use setDoc(doc(db, 'favorites', userId), { roomIds })
 */
export async function saveFavoritesToFirestore(
  userId: string,
  roomIds: string[]
): Promise<void> {
  // await setDoc(doc(db, 'favorites', userId), {
  //   roomIds,
  //   updatedAt: serverTimestamp(),
  // });

  localStorage.setItem(`favorites_${userId}`, JSON.stringify(roomIds));
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
export function subscribeToRooms(callback: (rooms: Room[]) => void): () => void {
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

//get alle professoren für admin proffessors
export async function getProfessors()  {
  
  
}
// get die office hours und raum der  professoren diese sollen auch bei favoriten gespeichert werden weil es dazu passt dafür müssen neue Attribute in der favoriten tabelle angelegt werden
export async function getFavoritesProfessorsOfficeHoursAndRoom(){

}
