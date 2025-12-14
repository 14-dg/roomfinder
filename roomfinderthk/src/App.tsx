import { useState, useMemo } from "react";
import { RoomCard } from "./components/RoomCard";
import { RoomTimetable } from "./components/RoomTimetable";
import { ProfessorSearch } from "./components/ProfessorSearch";
import { ProfessorBooking } from "./components/ProfessorBooking";
import { ClassSearch } from "./components/ClassSearch";
import { UserTimetable } from "./components/UserTimetable";
import { LoginScreen } from "./components/LoginScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { AdminPanel } from "./components/AdminPanel";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider, useData } from "./contexts/DataContext";
import { Toaster } from "./components/ui/sonner";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./components/ui/sheet";
import { Button } from "./components/ui/button";
import { Search, Home, Heart, User, SlidersHorizontal, BookmarkCheck, UserSearch, ArrowLeft, LogOut, Shield, Calendar, BookOpen } from "lucide-react";
import { Separator } from "./components/ui/separator";
import { Badge } from "./components/ui/badge";
import { RoomWithStatus } from "@/models";


interface TimeSlot {
  start: string;
  end: string;
  isBooked: boolean;
  subject?: string;
}

interface DaySchedule {
  day: string;
  slots: TimeSlot[];
}

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
          {!selectedRoomInRooms ? (
            <>
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by room number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              {/* Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full h-12 mb-4 relative">
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 h-5 px-2">{activeFiltersCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh]">
                  <SheetHeader>
                    <SheetTitle>Filter Rooms</SheetTitle>
                  </SheetHeader>
                  
                  <div className="py-6 space-y-6">
                    {/* Floor Filter */}
                    <div>
                      <Label htmlFor="floor" className="mb-3 block text-base">Floor</Label>
                      <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                        <SelectTrigger id="floor" className="h-12">
                          <SelectValue placeholder="All floors" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All floors</SelectItem>
                          <SelectItem value="1">Floor 1</SelectItem>
                          <SelectItem value="2">Floor 2</SelectItem>
                          <SelectItem value="3">Floor 3</SelectItem>
                          <SelectItem value="4">Floor 4</SelectItem>
                          <SelectItem value="5">Floor 5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Size Filter */}
                    <div>
                      <Label htmlFor="size" className="mb-3 block text-base">Room Size</Label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger id="size" className="h-12">
                          <SelectValue placeholder="All sizes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All sizes</SelectItem>
                          <SelectItem value="small">Small (≤20)</SelectItem>
                          <SelectItem value="medium">Medium (21-40)</SelectItem>
                          <SelectItem value="large">Large (40+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Toggle Filters */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <Label htmlFor="beamer" className="text-base">Has Beamer</Label>
                        <Switch
                          id="beamer"
                          checked={beamerOnly}
                          onCheckedChange={setBeamerOnly}
                        />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <Label htmlFor="available" className="text-base">Available Only</Label>
                        <Switch
                          id="available"
                          checked={availableOnly}
                          onCheckedChange={setAvailableOnly}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Clear Filters Button */}
                    <Button
                      variant="outline"
                      className="w-full h-12"
                      onClick={() => {
                        setSelectedFloor("all");
                        setSelectedSize("all");
                        setBeamerOnly(false);
                        setAvailableOnly(true);
                        setSearchQuery("");
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Results Count */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {filteredRooms.length} {filteredRooms.length === 1 ? "room" : "rooms"} found
                </p>
              </div>

              {/* Room List */}
              <div className="space-y-3">
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onClick={() => handleRoomClickInRooms(room)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No rooms found matching your criteria</p>
                    <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <RoomTimetable
              roomId={selectedRoomInRooms.id}
              roomNumber={selectedRoomInRooms.roomNumber}
              floor={selectedRoomInRooms.floor}
              capacity={selectedRoomInRooms.capacity}
              hasBeamer={selectedRoomInRooms.hasBeamer}
              isAvailable={selectedRoomInRooms.isAvailable}
            />
          )}
        </div>
      )}

      {/* Favorites Screen */}
      {currentScreen === "favorites" && (
        <div className="px-4 py-6">
          {!selectedRoomInFavorites ? (
            <>
              {favoriteRooms.length > 0 ? (
                <div className="space-y-3">
                  {favoriteRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onClick={() => handleRoomClickInFavorites(room)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookmarkCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No favorite rooms yet</p>
                  <p className="text-sm text-gray-400 mt-2">Start adding rooms to your favorites</p>
                </div>
              )}
            </>
          ) : (
            <RoomTimetable
              roomId={selectedRoomInFavorites.id}
              roomNumber={selectedRoomInFavorites.roomNumber}
              floor={selectedRoomInFavorites.floor}
              capacity={selectedRoomInFavorites.capacity}
              hasBeamer={selectedRoomInFavorites.hasBeamer}
              isAvailable={selectedRoomInFavorites.isAvailable}
            />
          )}
        </div>
      )}

      {/* Professor Screen */}
      {currentScreen === "professor" && (
        <div className="px-4 py-6">
          <ProfessorSearch />
        </div>
      )}

      {/* Profile Screen */}
      {currentScreen === "profile" && (
        <div className="px-4 py-6 space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl">{user?.name}</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <Badge className="mt-2 capitalize" variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                  {user?.role}
                </Badge>
              </div>
            </div>
          </div>

          <UserTimetable />

          <div className="bg-white rounded-lg shadow-sm divide-y">
            <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
              <p className="text-base">Notification Settings</p>
              <p className="text-sm text-gray-600 mt-1">Manage your alerts</p>
            </button>
            <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
              <p className="text-base">Default Filters</p>
              <p className="text-sm text-gray-600 mt-1">Set your preferred filters</p>
            </button>
            <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
              <p className="text-base">About</p>
              <p className="text-sm text-gray-600 mt-1">Version 1.0.0</p>
            </button>
            <button 
              onClick={logout}
              className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors text-red-600"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                <div>
                  <p className="text-base">Sign Out</p>
                  <p className="text-sm text-gray-600 mt-1">Log out of your account</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Admin Screen */}
      {currentScreen === "admin" && (
        <div className="px-4 py-6">
          <AdminPanel />
        </div>
      )}

      {/* Booking Screen */}
      {currentScreen === "booking" && (
        <div className="px-4 py-6">
          <ProfessorBooking />
        </div>
      )}

      {/* Classes Screen */}
      {currentScreen === "classes" && (
        <div className="px-4 py-6">
          <ClassSearch />
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        <div className="flex items-center justify-around h-16">
          <button
            onClick={() => {
              setCurrentScreen("rooms");
              setSelectedRoomInRooms(null);
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
              setSelectedRoomInFavorites(null);
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
          
          {user?.role === 'professor' && (
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

          {user?.role === 'admin' && (
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