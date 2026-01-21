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

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

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
      <Route path="/admin" element={<AdminScreen />} />
      <Route path="/booking" element={<BookingScreen />} />
      <Route path="/classes" element={<ClassesScreen />} />
    </Routes>
  );
}
