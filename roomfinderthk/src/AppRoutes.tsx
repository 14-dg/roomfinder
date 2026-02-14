import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import RoomsScreen from "@/screens/rooms/RoomsScreen";
import FavoritesScreen from "@/screens/classAndUserBasedScreens/FavoritesScreen";
import ProfessorScreen from "@/screens/professor/ProfessorScreen";
import ProfileScreen from "@/screens/classAndUserBasedScreens/ProfileScreen";
import AdminScreen from "@/screens/admin/AdminScreen";
import BookingScreen from "@/screens/professor/BookingScreen";
import ClassesScreen from "@/screens/classAndUserBasedScreens/ClassesScreen";
import LoginScreen from "@/screens/loginAndRegister/LoginScreen";
import RegisterScreen from "@/screens/loginAndRegister/RegisterScreen";
import RoomDetailScreen from "@/screens/rooms/RoomDetailScreen";
import ProfessorDetailScreen from "@/screens/professor/ProfessorDetailScreen";

/**
 * Higher-order component that protects routes based on user role.
 * Redirects to rooms page if user lacks required roles.
 * 
 * @param element - React component to render if access is granted
 * @param allowedRoles - Array of user roles that can access this route
 * @returns Protected element or redirect to rooms page
 */
const ProtectedRoute = ({ element, allowedRoles }: { element: React.ReactNode; allowedRoles: string[] }) => {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/rooms" replace />;
  }
  
  return element;
};

/**
 * Defines all routes in the application with role-based access control.
 * Shows login/register routes for unauthenticated users.
 * Shows protected routes for authenticated users based on their role.
 */
export default function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  // Unauthenticated routes
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Authenticated routes
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/rooms" replace />} />
      <Route path="/rooms" element={<RoomsScreen />} />
      <Route path="/rooms/:roomId" element={<RoomDetailScreen />} />
      <Route path="/favorites" element={<FavoritesScreen />} />
      <Route path="/favorites/rooms/:roomId" element={<RoomDetailScreen />} />
      <Route path="/professors" element={<ProfessorScreen />} />
      <Route path="/professors/:professorId" element={<ProfessorDetailScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      {/* Admin Panel - Only accessible to admin users */}
      <Route path="/admin" element={<ProtectedRoute element={<AdminScreen />} allowedRoles={['admin']} />} />
      {/* Booking System - Only accessible to professor users */}
      <Route path="/booking" element={<ProtectedRoute element={<BookingScreen />} allowedRoles={['professor']} />} />
      <Route path="/classes" element={<ClassesScreen />} />
    </Routes>
  );
}
