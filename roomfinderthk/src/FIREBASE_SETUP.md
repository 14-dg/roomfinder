# Firebase Integration Guide

This document explains how to integrate Firebase with the University Room Finder app when you're ready to move from localStorage to a real backend.

## Current State

The application currently uses **localStorage** for all data persistence. All Firebase access points are set up in `/services/firebase.ts` but are implemented with localStorage as placeholders.

## Firebase Services Available

The following Firebase integration points are ready to be implemented:

### Authentication Services
- `registerUser()` - User registration
- `loginUser()` - User login with email/password
- `logoutUser()` - Sign out current user
- `getCurrentUser()` - Get current session

### Room Services
- `getRooms()` - Fetch all rooms
- `getRoom(roomId)` - Get single room
- `addRoom(room)` - Create new room
- `updateRoom(roomId, updates)` - Update room details
- `deleteRoom(roomId)` - Delete a room

### Booking Services
- `getBookings()` - Fetch all bookings
- `getRoomBookings(roomId)` - Get bookings for specific room
- `addBooking(booking)` - Create new booking
- `deleteBooking(bookingId)` - Cancel booking
- `clearAllBookings()` - Admin function to clear all bookings

### Timetable Services
- `getRoomDetailScreen(roomId)` - Get custom schedule for room
- `uploadTimetable(roomId, schedule)` - Upload/update timetable
- `deleteTimetable(roomId)` - Remove custom timetable

### Real-time Services (Ready for implementation)
- `subscribeToRooms(callback)` - Listen for room changes
- `subscribeToBookings(callback)` - Listen for booking changes

## How to Implement Firebase

### Step 1: Install Firebase

```bash
npm install firebase
```

### Step 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password provider)
4. Create a Firestore Database
5. Get your Firebase configuration

### Step 3: Update Firebase Config

In `/services/firebase.ts`, replace the placeholder config with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 4: Uncomment Firebase Initialization

Uncomment these lines in `/services/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Step 5: Replace Function Implementations

Each function in `/services/firebase.ts` has a TODO comment explaining the Firebase implementation. Replace the localStorage code with the Firebase code shown in the comments.

Example for `registerUser`:

```typescript
// Before (localStorage)
const users = JSON.parse(localStorage.getItem('users') || '[]');
const newUser: User = { id: Date.now().toString(), email, name, role };
users.push({ ...newUser, password });
localStorage.setItem('users', JSON.stringify(users));
return newUser;

// After (Firebase)
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const userCredential = await createUserWithEmailAndPassword(auth, email, password);
await setDoc(doc(db, 'users', userCredential.user.uid), { 
  name, 
  role,
  email 
});
return {
  id: userCredential.user.uid,
  email,
  name,
  role
};
```

### Step 6: Set Up Firestore Security Rules

In your Firebase Console, set up security rules for Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Rooms collection
    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && (
        resource.data.bookedBy == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // Timetables collection
    match /timetables/{roomId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Step 7: Update Context to Use Firebase Service

Update `/contexts/DataContext.tsx` and `/contexts/AuthContext.tsx` to import and use the Firebase functions instead of directly using localStorage.

## Firestore Data Structure

### Collections

#### `users`
```javascript
{
  [userId]: {
    name: string,
    email: string,
    role: 'student' | 'professor' | 'admin'
  }
}
```

#### `rooms`
```javascript
{
  [roomId]: {
    roomNumber: string,
    floor: number,
    capacity: number,
    occupiedSeats: number,
    hasBeamer: boolean,
    isAvailable: boolean,
    availableUntil?: string
  }
}
```

#### `bookings`
```javascript
{
  [bookingId]: {
    roomId: string,
    day: string,
    timeSlot: string,
    subject: string,
    bookedBy: string,
    bookedByName: string,
    bookedByRole: 'student' | 'professor' | 'admin',
    createdAt: timestamp
  }
}
```

#### `timetables`
```javascript
{
  [roomId]: {
    schedule: [
      {
        day: string,
        slots: [
          {
            start: string,
            end: string,
            isBooked: boolean,
            subject?: string
          }
        ]
      }
    ],
    updatedAt: timestamp
  }
}
```

## Benefits of Firebase Implementation

1. **Real-time Updates** - Multiple users see changes instantly
2. **Cloud Sync** - Data accessible from any device
3. **Authentication** - Secure user management with Firebase Auth
4. **Scalability** - Handles growing user base automatically
5. **Security** - Role-based access control with Firestore rules
6. **Offline Support** - Firebase SDK includes offline persistence
7. **No Server Maintenance** - Serverless architecture

## Testing

Before deploying with Firebase:
1. Test with Firebase Emulator Suite locally
2. Verify security rules work as expected
3. Test all user roles (student, professor, admin)
4. Ensure data migration from localStorage if needed

## Notes

- The current localStorage implementation allows you to develop and test without Firebase
- All function signatures are designed to match what Firebase will return
- The transition to Firebase requires no changes to React components
- Consider implementing Firebase Cloud Functions for complex operations like scheduled cleanup
