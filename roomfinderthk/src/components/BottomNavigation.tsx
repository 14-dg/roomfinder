// components/BottomNavigation.tsx
import { FC } from "react";
import { Home, Heart, UserSearch, BookOpen, Calendar, User, Shield } from "lucide-react";
import { Badge } from "./ui/badge";

type Screen = "rooms" | "favorites" | "professor" | "profile" | "admin" | "booking" | "classes";

interface BottomNavigationProps {
  currentScreen: string;
  setCurrentScreen: (screen: Screen) => void;
  favorites: string[];
  user: {
    role: string;
  } | null;
  setSelectedRoomInRooms?: (room: any) => void;
  setSelectedRoomInFavorites?: (room: any) => void;
}

const BottomNavigation: FC<BottomNavigationProps> = ({
  currentScreen,
  setCurrentScreen,
  favorites,
  user,
  setSelectedRoomInRooms,
  setSelectedRoomInFavorites,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
      <div className="flex items-center justify-around h-16">
        <button
          onClick={() => {
            setCurrentScreen("rooms");
            setSelectedRoomInRooms?.(null);
          }}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            currentScreen === "rooms" ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs">Rooms</span>
        </button>

        <button
          onClick={() => {
            setCurrentScreen("favorites");
            setSelectedRoomInFavorites?.(null);
          }}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors relative ${
            currentScreen === "favorites" ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <Heart className="w-6 h-6 mb-1" />
          <span className="text-xs">Favorites</span>
          {favorites.length > 0 && (
            <Badge className="absolute top-1 right-1/4 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {favorites.length}
            </Badge>
          )}
        </button>

        <button
          onClick={() => setCurrentScreen("professor")}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            currentScreen === "professor" ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <UserSearch className="w-6 h-6 mb-1" />
          <span className="text-xs">Professor</span>
        </button>

        <button
          onClick={() => setCurrentScreen("classes")}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            currentScreen === "classes" ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <BookOpen className="w-6 h-6 mb-1" />
          <span className="text-xs">Classes</span>
        </button>

        {user?.role === "professor" && (
          <button
            onClick={() => setCurrentScreen("booking")}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              currentScreen === "booking" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <Calendar className="w-6 h-6 mb-1" />
            <span className="text-xs">Book</span>
          </button>
        )}

        <button
          onClick={() => setCurrentScreen("profile")}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            currentScreen === "profile" ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs">Profile</span>
        </button>

        {user?.role === "admin" && (
          <button
            onClick={() => setCurrentScreen("admin")}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              currentScreen === "admin" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <Shield className="w-6 h-6 mb-1" />
            <span className="text-xs">Admin</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;
