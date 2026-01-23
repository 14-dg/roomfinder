import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RoomCard } from "@/screens/rooms/RoomCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ScreenHeader from "@/components/ScreenHeader";
import { Search } from "lucide-react";
import { useData } from "@/contexts/DataContext";

export default function RoomsScreen() {
  const { rooms } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [beamerOnly, setBeamerOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  // --------------------------------------------------
  // Filters
  // --------------------------------------------------
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (searchQuery && !room.roomName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      if (selectedFloor !== "all" && room.floor !== Number(selectedFloor)) {
        return false;
      }

      if (selectedSize !== "all") {
        if (selectedSize === "small" && room.capacity > 20) return false;
        if (selectedSize === "medium" && (room.capacity <= 20 || room.capacity > 40)) return false;
        if (selectedSize === "large" && room.capacity <= 40) return false;
      }

      if (beamerOnly && !room.hasBeamer) return false;
      if (availableOnly && !room.isAvailable) return false;

      return true;
    });
  }, [rooms, searchQuery, selectedFloor, selectedSize, beamerOnly, availableOnly]);


  // --------------------------------------------------
  // Room list
  // --------------------------------------------------
  return (
    <>
      <ScreenHeader title="Rooms" subtitle="Find and filter through all rooms"/>
      
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search by room number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Filters - Inline */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-2 block text-sm">Floor</Label>
            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All floors</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(f => (
                  <SelectItem key={f} value={String(f)}>
                    Floor {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-sm">Room Size</Label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sizes</SelectItem>
                <SelectItem value="small">Small (≤20)</SelectItem>
                <SelectItem value="medium">Medium (21–40)</SelectItem>
                <SelectItem value="large">Large (40+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Has Beamer</Label>
            <Switch checked={beamerOnly} onCheckedChange={setBeamerOnly} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Available Only</Label>
            <Switch checked={availableOnly} onCheckedChange={setAvailableOnly} />
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-9 text-sm"
          onClick={() => {
            setSearchQuery("");
            setSelectedFloor("all");
            setSelectedSize("all");
            setBeamerOnly(false);
            setAvailableOnly(false);
          }}
        >
          Clear All Filters
        </Button>
      </div>

      {/* Results */}
      <p className="text-sm text-gray-600 mb-4">
        {filteredRooms.length} room{filteredRooms.length !== 1 && "s"} found
      </p>

      <div className="space-y-3">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={() => navigate(`/rooms/${room.id}`)} // Routing zur Detail-Seite
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">No rooms found</div>
        )}
      </div>
    </>
  );
}
