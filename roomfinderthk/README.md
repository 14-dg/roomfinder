# RoomFinderTHK - Room Finder Application

A modern web application for finding and booking university rooms at Technische Hochschule Köln (TH Köln). This application helps students and faculty locate available rooms, check room details, and manage bookings efficiently.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Firebase Setup](#firebase-setup)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)

## Features

- 🔍 **Room Discovery** - Search and browse available rooms across campus
- 📅 **Timetable Integration** - View room schedules and availability
- 📋 **Room Booking** - Reserve rooms for lectures, exams, or study sessions
- 👤 **User Authentication** - Secure login and registration system
- ⭐ **Favorites** - Save your frequently used rooms
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Built with React and Tailwind CSS
- 📊 **Admin Dashboard** - Manage rooms, users, and bookings
- 🔐 **Role-based Access** - Different interfaces for students, professors, and admins

## Tech Stack

- **Frontend Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Radix UI Components
- **Routing**: React Router v7
- **Backend**: Firebase (Authentication & Firestore)
- **State Management**: React Context API
- **Charts**: Recharts
- **PDF Export**: jsPDF & html2canvas
- **PWA Support**: vite-plugin-pwa

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher) or **yarn**
- **Git**
- A Firebase account (for backend integration)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd team11/roomfinderthk
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3. Verify Installation

```bash
npm list
```

Check that all dependencies are installed correctly.

## Configuration

### Environment Setup

The application uses Firebase for authentication and data storage. Currently, it operates with localStorage as a fallback during development.

1. **Firebase Configuration** (Optional for development):
   - If you want to connect to Firebase, follow the [Firebase Setup Guide](./src/FIREBASE_SETUP.md)
   - Update `src/firebase-config.ts` with your Firebase credentials
   - The application will automatically use localStorage if Firebase is not configured

2. **Application Configuration**:
   - Review `tsconfig.json` for TypeScript settings
   - Check `vite.config.ts` for Vite configuration
   - Adjust `tailwind.config.js` for styling preferences (if present)

## Running the Application

### Development Server

Start the development server with hot module reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
roomfinderthk/
├── src/
│   ├── components/        # Reusable React components
│   │   ├── ui/           # Radix UI component library
│   │   └── figma/        # Figma-based components
│   ├── screens/          # Page/Screen components
│   │   ├── admin/        # Admin dashboard
│   │   ├── rooms/        # Room browsing
│   │   └── loginAndRegister/  # Auth screens
│   ├── contexts/         # React Context providers
│   │   ├── AuthContext   # Authentication state
│   │   ├── DataContext   # Application data
│   │   └── FavoritesContext  # User favorites
│   ├── models/           # TypeScript interfaces/types
│   ├── services/         # Firebase and API services
│   ├── utils/            # Utility functions
│   ├── styles/           # Global CSS
│   ├── App.tsx           # Main App component
│   ├── AppRoutes.tsx     # Route definitions
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Firebase Setup

For production use with real backend support, follow the Firebase setup guide in [FIREBASE_SETUP.md](./src/FIREBASE_SETUP.md).

**Quick Firebase Integration Steps:**

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication (Email/Password provider)
3. Create a Firestore Database
4. Update credentials in `src/firebase-config.ts`
5. Uncomment Firebase initialization in `src/services/firebase.ts`
6. Replace localStorage implementations with Firebase calls

## Available Scripts

### `npm run dev`
Starts the development server with hot module reloading at `http://localhost:5173`

### `npm run build`
Creates an optimized production build in the `dist/` directory

### `npm run preview`
Serves the production build locally for testing

## Key Features in Detail

### Authentication
- User registration with email/password
- Secure login system
- Role-based access control (Student, Professor, Admin)
- Session management

### Room Management
- Browse all available rooms
- View detailed room information (capacity, equipment, schedules)
- Check real-time availability
- View occupancy status

### Booking System
- Reserve rooms for specific time slots
- Check booking history
- Cancel bookings
- View room timetables

### User Dashboard
- Personal timetable view
- Favorite rooms list
- Booking history
- Profile management

### Admin Features
- Manage rooms (add, edit, delete)
- View all bookings
- User management
- System administration

## Component Libraries

The project uses **Radix UI** for accessible, unstyled components combined with **Tailwind CSS** for styling. Custom components are located in `src/components/ui/`.

## Data Models

Core data models are defined in `src/models/`:

- **User** - Application user with role and preferences
- **Room** - Campus room with capacity and amenities
- **Booking** - Room reservation
- **Lecture** - University lecture/class
- **Timetable** - Schedule information
- **Lecturer** - Professor/instructor details
- **Professor** - Faculty member information

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port.

### Build Errors
Clear the `node_modules` directory and reinstall:
```bash
rm -rf node_modules
npm install
npm run build
```

### Firebase Connection Issues
Ensure your Firebase credentials are correctly configured in `src/firebase-config.ts` and your Firestore rules allow access.

### Styling Issues
Clear Tailwind CSS cache:
```bash
rm -rf .next
npm run dev
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

This project is part of the System and Project Management course (SYP) at Technische Hochschule Köln.

## Support

For issues, questions, or suggestions, please contact the development team or refer to the [Guidelines](./src/guidelines/Guidelines.md).

## Additional Documentation

- [Firebase Setup Guide](./src/FIREBASE_SETUP.md) - Firebase integration instructions
- [Attributions](./src/Attributions.md) - Third-party libraries and credits
- [Guidelines](./src/guidelines/Guidelines.md) - Development guidelines
- [Database Guide](../../Database.md) - Database schema and design

---

**Version**: 0.1.0  
**Last Updated**: February 2026

