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

import { useData } from '@/contexts/DataContext';

export default function RoomsAdmin() {
  const { rooms, addRoom, deleteRoom } = useData();

  const [newRoom, setNewRoom] = useState({
    roomName: '',
    floor: 1,
    capacity: 20,
    occupiedSeats: 0,
    hasBeamer: false,
    isLocked: false,
  });

  const handleAddRoom = () => {
    if (!newRoom.roomName) return;

    addRoom({
      id: Date.now().toString(),
      roomName: newRoom.roomName,
      floor: newRoom.floor,
      capacity: newRoom.capacity,
      occupiedSeats: newRoom.occupiedSeats,
      hasBeamer: newRoom.hasBeamer,
      isLocked: newRoom.isLocked,
      isAvailable: true,
    });

    setNewRoom({
      roomName: '',
      floor: 1,
      capacity: 20,
      occupiedSeats: 0,
      hasBeamer: false,
      isLocked: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Room */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Add New Room</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Room Number */}
          <div>
            <Label htmlFor="roomName">Room Number</Label>
            <Input
              id="roomName"
              placeholder="ZW5-5"
              value={newRoom.roomName}
              onChange={(e) =>
                setNewRoom({ ...newRoom, roomName: e.target.value })
              }
              className="mt-2"
            />
          </div>

          {/* Floor */}
          <div>
            <Label htmlFor="floor">Floor</Label>
            <Select
              value={newRoom.floor.toString()}
              onValueChange={(value) =>
                setNewRoom({ ...newRoom, floor: parseInt(value) })
              }
            >
              <SelectTrigger id="floor" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9,10,11,12,13].map((floor) => (
                  <SelectItem key={floor} value={floor.toString()}>
                    Floor {floor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Capacity */}
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              min={1}
              value={newRoom.capacity}
              onChange={(e) =>
                setNewRoom({
                  ...newRoom,
                  capacity: Number(e.target.value),
                })
              }
              className="mt-2"
            />
          </div>

          {/* Occupied Seats */}
          <div>
            <Label htmlFor="occupiedSeats">Occupied Seats</Label>
            <Input
              id="occupiedSeats"
              type="number"
              min={0}
              value={newRoom.occupiedSeats}
              onChange={(e) =>
                setNewRoom({
                  ...newRoom,
                  occupiedSeats: Number(e.target.value),
                })
              }
              className="mt-2"
            />
          </div>

          {/* Switches */}
          <div className="col-span-2 flex items-center gap-10 pt-2">
            <div className="flex items-center gap-2">
              <Switch
                id="hasBeamer"
                checked={newRoom.hasBeamer}
                onCheckedChange={(checked) =>
                  setNewRoom({ ...newRoom, hasBeamer: checked })
                }
              />
              <Label htmlFor="hasBeamer">Has Beamer</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isLocked"
                checked={newRoom.isLocked}
                onCheckedChange={(checked) =>
                  setNewRoom({ ...newRoom, isLocked: checked })
                }
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

      {/* Rooms Table */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Manage Rooms ({rooms.length})
        </h3>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Beamer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.roomName}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>
                    <Badge variant={room.hasBeamer ? 'secondary' : 'outline'}>
                      {room.hasBeamer ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        room.isAvailable ? 'bg-green-500' : 'bg-red-500'
                      }
                    >
                      {room.isAvailable ? 'Available' : 'Occupied'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        confirm('Delete this room?') &&
                        deleteRoom(room.id)
                      }
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {rooms.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 py-8"
                  >
                    No rooms available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
