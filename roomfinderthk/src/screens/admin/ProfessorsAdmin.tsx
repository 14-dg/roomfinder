import { useState, useEffect } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Import der Service-Funktionen
// Hinweis: Wir nutzen getProfessors für die Liste und setUserProfessorsOfficeHoursAndRoom zum Speichern
import { registerUser, getProfessors, deleteProfessor, setUserProfessorsOfficeHoursAndRoom } from '@/services/firebase';
import { useData } from '@/contexts/DataContext';

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 8; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(time);
    }
  }
  return options;
};

function PasswordGenerator() {
  return "12345";
}

const timeOptions = generateTimeOptions();

export default function ProfessorsAdmin() {
  const { rooms } = useData();
  const [professors, setProfessors] = useState<any[]>([]);
  const [selectedProfessorId, setSelectedProfessorId] = useState<string | null>(null);

  const loadProfessors = async () => {
    try {
      const data = await getProfessors();
      setProfessors(data);
    } catch (error) {
      console.error("Fehler beim Laden:", error);
    }
  };

  useEffect(() => {
    loadProfessors();
  }, []);

  const [newProfessor, setNewProfessor] = useState({ email: '', name: '' });

  const [officeHours, setOfficeHours] = useState({
    selectedProfessor: null as any,
    startTime: '',
    endTime: '',
    selectedOffice: '',
  });

  const handleAddProfessor = async () => {
    const { email, name } = newProfessor;
    if (!email || !name) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      const password = PasswordGenerator();
      await registerUser(email, password, name, 'professor');
      toast.success(`Professor ${name} added`);
      setNewProfessor({ email: '', name: '' });
      await loadProfessors();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error');
    }
  };

  const handleDeleteProfessor = async (id: string) => {
    try {
      await deleteProfessor(id);
      await loadProfessors();
      toast.success('Professor deleted');
    } catch (error) {
      toast.error('Error deleting professor');
    }
  };

  // --- AKTUALISIERTE FUNKTION ---
  const handleSetOfficeHours = async () => {
    const { selectedProfessor, startTime, endTime, selectedOffice } = officeHours;

    // Prüfung ob ein Professor ausgewählt wurde (entweder über die Liste oder das State)
    if (!selectedProfessor || !selectedProfessor.id) {
      toast.error('Please select a professor from the table first');
      return;
    }

    if (!startTime || !endTime || !selectedOffice) {
      toast.error('Please fill all time and room fields');
      return;
    }

    try {
      // Speichern über den Firebase Service
      await setUserProfessorsOfficeHoursAndRoom(
        selectedProfessor.id,
        `${startTime} - ${endTime}`,
        selectedOffice
      );

      toast.success(`Office hours updated for ${selectedProfessor.name}`);

      // UI aktualisieren
      await loadProfessors();
      
      // Formular zurücksetzen
      setSelectedProfessorId(null);
      setOfficeHours({
        selectedProfessor: null,
        startTime: '',
        endTime: '',
        selectedOffice: '',
      });
    } catch (error) {
      toast.error('Failed to update office hours');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Professor Card */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Add Professor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Email</Label>
            <Input
              value={newProfessor.email}
              onChange={(e) => setNewProfessor({ ...newProfessor, email: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Name</Label>
            <Input
              value={newProfessor.name}
              onChange={(e) => setNewProfessor({ ...newProfessor, name: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>
        <Button onClick={handleAddProfessor} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Professor
        </Button>
      </Card>

      {/* Set Office Hours Card */}
      <Card className={`p-6 space-y-4 border-2 ${!selectedProfessorId ? 'opacity-60' : 'border-blue-500'}`}>
        <h3 className="text-lg font-semibold">
          Set Office Hours {officeHours.selectedProfessor ? `for ${officeHours.selectedProfessor.name}` : '(Select a professor below)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Start Time</Label>
            <Select
              value={officeHours.startTime}
              onValueChange={(value) => setOfficeHours({ ...officeHours, startTime: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Start" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => <SelectItem key={time} value={time}>{time}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>End Time</Label>
            <Select
              value={officeHours.endTime}
              onValueChange={(value) => setOfficeHours({ ...officeHours, endTime: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="End" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => <SelectItem key={time} value={time}>{time}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Office</Label>
            <Select
              value={officeHours.selectedOffice}
              onValueChange={(value) => setOfficeHours({ ...officeHours, selectedOffice: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.roomNumber}>
                    {room.roomNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleSetOfficeHours} 
          className="w-full"
          variant={selectedProfessorId ? "default" : "secondary"}
        >
          <Plus className="w-4 h-4 mr-2" /> Set Office Hours
        </Button>
      </Card>

      {/* List Card */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Manage Professors ({professors.length})</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Office Hours</TableHead>
                <TableHead>Office</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professors.map((professor) => (
                <TableRow
                  key={professor.id}
                  className={`cursor-pointer hover:bg-gray-50 ${selectedProfessorId === professor.id ? 'bg-blue-50' : ''}`}
                  onClick={() => {
                    setSelectedProfessorId(professor.id);
                    setOfficeHours({ ...officeHours, selectedProfessor: professor });
                  }}
                >
                  <TableCell className="font-medium">{professor.name}</TableCell>
                  <TableCell>{professor.email}</TableCell>
                  <TableCell>{professor.officeHours || '—'}</TableCell>
                  <TableCell>{professor.officeRoom || '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this professor?')) handleDeleteProfessor(professor.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
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