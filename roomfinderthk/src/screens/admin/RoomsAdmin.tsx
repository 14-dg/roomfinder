import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import { RoomWithStatus, RoomCategory } from '@/models/RoomWithStatus';

// Admin-Screen zur Verwaltung von Räumen: Hinzufügen, Bearbeiten und Löschen
export default function RoomsAdmin() {
  const { rooms, addRoom, deleteRoom } = useData();

  // Formularstatus für neue Räume
  const [newRoom, setNewRoom] = useState<Partial<RoomWithStatus>>({
    roomName: '',
    roomType: 'seminarraum',
    floor: 1,
    building: 'Main Building',
    campus: 'Deutz',
    capacity: 20,
    checkins: 0,
    hasBeamer: false,
    isLocked: false,
  });

  // Fügt einen neuen Raum hinzu und setzt das Formular zurück
  const handleAddRoom = () => {
    if (!newRoom.roomName || !newRoom.roomType) {
      toast.error("Please provide room name and category");
      return;
    }

    addRoom({
      ...newRoom,
      isAvailable: true,
    } as RoomWithStatus);

    toast.success(`Room "${newRoom.roomName}" added successfully`);

    // Setzt Formular auf Standardwerte zurück
    setNewRoom({
      roomName: '',
      roomType: 'seminarraum',
      floor: 1,
      building: 'Main Building',
      campus: 'Deutz',
      capacity: 20,
      checkins: 0,
      hasBeamer: false,
      isLocked: false,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Add New Room</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Raumnummer/Name */}
          <div>
            <Label htmlFor="roomName">Room Number / Name</Label>
            <Input
              id="roomName"
              placeholder="e.g. ZW5-5"
              value={newRoom.roomName}
              onChange={(e) => setNewRoom({ ...newRoom, roomName: e.target.value })}
              className="mt-2"
            />
          </div>

          {/* Raumtyp (z.B. Seminarraum, Labor, etc.) */}
          <div>
            <Label htmlFor="roomType">Category</Label>
            <Select
              value={newRoom.roomType}
              onValueChange={(value: RoomCategory) =>
                setNewRoom({ ...newRoom, roomType: value })
              }
            >
              <SelectTrigger id="roomType" className="mt-2">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seminarraum">Seminar Room</SelectItem>
                <SelectItem value="labor">Laboratory</SelectItem>
                <SelectItem value="pc-pool">PC Pool</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campus (derzeit nur Deutz verfügbar) */}
          <div>
            <Label htmlFor="campus">Campus</Label>
            <Select
              value={newRoom.campus}
              onValueChange={(value) => setNewRoom({ ...newRoom, campus: value })}
            >
              <SelectTrigger id="campus" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Deutz">Deutz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gebäude (derzeit nur Hauptgebäude) */}
          <div>
            <Label htmlFor="building">Building</Label>
            <Select
              value={newRoom.building}
              onValueChange={(value) => setNewRoom({ ...newRoom, building: value })}
            >
              <SelectTrigger id="building" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Main Building">Main Building</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stockwerk und Raumkapazität */}
          <div>
            <Label htmlFor="floor">Floor</Label>
            <Input
              id="floor"
              type="number"
              value={newRoom.floor}
              onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={newRoom.capacity}
              onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
              className="mt-2"
            />
          </div>

          {/* Ausstattung: Beamer und Sperrungsstatus */}
          <div className="col-span-2 flex items-center gap-10 pt-2">
            <div className="flex items-center gap-2">
              <Switch
                id="hasBeamer"
                checked={newRoom.hasBeamer}
                onCheckedChange={(checked) => setNewRoom({ ...newRoom, hasBeamer: checked })}
              />
              <Label htmlFor="hasBeamer">Projector Available</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isLocked"
                checked={newRoom.isLocked}
                onCheckedChange={(checked) => setNewRoom({ ...newRoom, isLocked: checked })}
              />
              <Label htmlFor="isLocked">Locked</Label>
            </div>
          </div>
        </div>

        <Button onClick={handleAddRoom} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </Card>

      {/* Alle Räume anzeigen */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Manage Rooms ({rooms.length})</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Projector</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room: RoomWithStatus) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.roomName}</TableCell>
                  {/* Raumtyp anzeigen */}
                  <TableCell className="capitalize">
                    {room.roomType === 'seminarraum' ? 'Seminar Room' : 
                     room.roomType === 'labor' ? 'Laboratory' : 'PC Pool'}
                  </TableCell>
                  {/* Standort: Campus, Gebäude und Stockwerk */}
                  <TableCell>{room.campus} - {room.building} (Floor {room.floor})</TableCell>
                  {/* Beamer-Status */}
                  <TableCell>
                    <Badge variant={room.hasBeamer ? "secondary" : "outline"}>
                      {room.hasBeamer ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  {/* Verfügbarkeitsstatus (grün = frei, rot = belegt) */}
                  <TableCell>
                    <Badge className={room.isAvailable ? "bg-green-500 hover:bg-green-500" : "bg-red-500 hover:bg-red-500"}>
                      {room.isAvailable ? "Available" : "Occupied"}
                    </Badge>
                  </TableCell>
                  {/* Löschen-Button */}
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => deleteRoom(room.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}