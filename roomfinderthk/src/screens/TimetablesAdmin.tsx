import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileUp } from 'lucide-react';

import { useData } from '@/contexts/DataContext';

export default function TimetablesAdmin() {
  const { rooms, uploadTimetable } = useData();

  const [timetableUpload, setTimetableUpload] = useState({
    roomId: '',
    jsonData: '',
  });

  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleUpload = () => {
    try {
      const schedule = JSON.parse(timetableUpload.jsonData);

      if (!Array.isArray(schedule)) {
        throw new Error('Timetable must be an array');
      }

      uploadTimetable(timetableUpload.roomId, schedule);

      setMessage({
        type: 'success',
        text: 'Timetable uploaded successfully!',
      });

      setTimetableUpload({ roomId: '', jsonData: '' });

      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      setMessage({
        type: 'error',
        text: e instanceof Error ? e.message : 'Invalid JSON',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileUp className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Upload Timetable</h3>
        </div>

        <div className="space-y-4">
          {/* Room Select */}
          <div>
            <Label>Select Room</Label>
            <Select
              value={timetableUpload.roomId}
              onValueChange={(value) =>
                setTimetableUpload({ ...timetableUpload, roomId: value })
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.roomNumber} – Floor {room.floor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* JSON Input */}
          <div>
            <Label>Timetable JSON</Label>
            <Textarea
              className="mt-2 h-48 font-mono text-sm"
              placeholder="Paste timetable JSON here..."
              value={timetableUpload.jsonData}
              onChange={(e) =>
                setTimetableUpload({
                  ...timetableUpload,
                  jsonData: e.target.value,
                })
              }
            />
          </div>

          {/* Message */}
          {message && (
            <Alert
              variant={message.type === 'error' ? 'destructive' : 'default'}
            >
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={
              !timetableUpload.roomId || !timetableUpload.jsonData
            }
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Timetable
          </Button>
        </div>
      </Card>
    </div>
  );
}
