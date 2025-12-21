import { useState, useMemo } from "react";

import { RoomCard } from "@/components/RoomCard";
import { RoomTimetable } from "@/components/RoomTimetable";
import { UserTimetable } from "@/components/UserTimetable";
import { LoginScreen } from "@/components/LoginScreen";
import { RegisterScreen } from "@/components/RegisterScreen";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider, useData } from "./contexts/DataContext";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Search, Home, Heart, User, SlidersHorizontal, BookmarkCheck, UserSearch, ArrowLeft, LogOut, Shield, Calendar, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";

import RoomsScreen from "@/screens/RoomsScreen";
import FavoritesScreen from "@/screens/FavoritesScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import AdminScreen from "@/screens/AdminScreen";
import ProfessorScreen from "@/screens/ProfessorScreen";
import BookingScreen from "./screens/BookingScreen";
import ClassesScreen from "./screens/ClassesScreen";

import { RoomWithStatus } from "@/models";


type Screen = "rooms" | "favorites" | "professor" | "profile" | "admin" | "booking" | "classes";

function MainApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("rooms");
  const [selectedRoomInRooms, setSelectedRoomInRooms] = useState<RoomWithStatus | null>(null);
  const [selectedRoomInFavorites, setSelectedRoomInFavorites] = useState<RoomWithStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [beamerOnly, setBeamerOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(["1", "5", "10"]);

  const { user, logout } = useAuth();
  const { rooms } = useData();

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Search filter
      if (searchQuery && !room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Floor filter
      if (selectedFloor !== "all" && room.floor !== parseInt(selectedFloor)) {
        return false;
      }

      // Size filter
      if (selectedSize !== "all") {
        if (selectedSize === "small" && room.capacity > 20) return false;
        if (selectedSize === "medium" && (room.capacity <= 20 || room.capacity > 40)) return false;
        if (selectedSize === "large" && room.capacity <= 40) return false;
      }

      // Beamer filter
      if (beamerOnly && !room.hasBeamer) {
        return false;
      }

      // Available only filter
      if (availableOnly && !room.isAvailable) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedFloor, selectedSize, beamerOnly, availableOnly]);

  const favoriteRooms = rooms.filter((room) => favorites.includes(room.id));

  const activeFiltersCount = [
    selectedFloor !== "all",
    selectedSize !== "all",
    beamerOnly,
    !availableOnly,
  ].filter(Boolean).length;

  const handleRoomClickInRooms = (room: RoomWithStatus) => {
    setSelectedRoomInRooms(room);
  };

  const handleRoomClickInFavorites = (room: RoomWithStatus) => {
    setSelectedRoomInFavorites(room);
  };

  const handleBackInRooms = () => {
    setSelectedRoomInRooms(null);
  };

  const handleBackInFavorites = () => {
    setSelectedRoomInFavorites(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            {currentScreen === "rooms" && selectedRoomInRooms && (
              <button
                onClick={handleBackInRooms}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {currentScreen === "favorites" && selectedRoomInFavorites && (
              <button
                onClick={handleBackInFavorites}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-2xl mb-1">
                {currentScreen === "rooms" && !selectedRoomInRooms && "Room Finder"}
                {currentScreen === "rooms" && selectedRoomInRooms && `${selectedRoomInRooms.roomNumber} Schedule`}
                {currentScreen === "favorites" && !selectedRoomInFavorites && "My Favorites"}
                {currentScreen === "favorites" && selectedRoomInFavorites && `${selectedRoomInFavorites.roomNumber} Schedule`}
                {currentScreen === "professor" && "Professor Search"}
                {currentScreen === "profile" && "Profile"}
                {currentScreen === "admin" && "Admin Panel"}
                {currentScreen === "booking" && "Book a Room"}
                {currentScreen === "classes" && "Class Search"}
              </h1>
              <p className="text-sm text-gray-600">
                {currentScreen === "rooms" && !selectedRoomInRooms && "Find available study rooms on campus"}
                {currentScreen === "rooms" && selectedRoomInRooms && "Weekly availability"}
                {currentScreen === "favorites" && !selectedRoomInFavorites && "Your saved study rooms"}
                {currentScreen === "favorites" && selectedRoomInFavorites && "Weekly availability"}
                {currentScreen === "professor" && "Find professor schedules and office hours"}
                {currentScreen === "profile" && "Manage your preferences"}
                {currentScreen === "admin" && "Manage university resources"}
                {currentScreen === "booking" && "Reserve rooms for your courses"}
                {currentScreen === "classes" && "Find classes and their schedules"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Screen */}
      {currentScreen === "rooms" && (
        <div className="px-4 py-6">
          <RoomsScreen />
        </div>
      )}

      {/* Favorites Screen */}
      {currentScreen === "favorites" && (
        <div className="px-4 py-6">
          <FavoritesScreen favoriteRooms={favoriteRooms}/>
        </div>
      )}

      {/* Professor Screen */}
      {currentScreen === "professor" && (
        <div className="px-4 py-6">
          <ProfessorScreen />
        </div>
      )}

      {/* Profile Screen */}
      {currentScreen === "profile" && (
        <ProfileScreen user={user} onLogout={logout} />
      )}

      {/* Admin Screen */}
      {currentScreen === "admin" && (
        <div className="px-4 py-6">
          <AdminScreen />
        </div>
      )}

      {/* Booking Screen */}
      {currentScreen === "booking" && (
        <div className="px-4 py-6">
          <BookingScreen />
        </div>
      )}

      {/* Classes Screen */}
      {currentScreen === "classes" && (
        <div className="px-4 py-6">
          <ClassesScreen />
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        favorites={favorites}
        user={user}
        setSelectedRoomInRooms={setSelectedRoomInRooms}
        setSelectedRoomInFavorites={setSelectedRoomInFavorites}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

  if (!isAuthenticated) {
    return (
      <>
        {authScreen === 'login' ? (
          <LoginScreen onSwitchToRegister={() => setAuthScreen('register')} />
        ) : (
          <RegisterScreen onSwitchToLogin={() => setAuthScreen('login')} />
        )}
      </>
    );
  }

  return (
    <>
      <MainApp />
      <Toaster />
    </>
  );
}