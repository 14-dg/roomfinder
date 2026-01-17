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
import { registerUser, getProfessors, deleteProfessor } from '@/services/firebase';
import { useData } from '@/contexts/DataContext';

// ---------------------------------------------
// Time Options
// ---------------------------------------------
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
//muss geändert werden auf richtiges passwort plus schicken einer email an den professor!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function PasswordGenerator() {
  return "12345";
}

const timeOptions = generateTimeOptions();

export default function ProfessorsAdmin() {
  const { rooms } = useData();
  const [professors, setProfessors] = useState<any[]>([]);
  const [selectedProfessorId, setSelectedProfessorId] = useState<string | null>(null);

  // Zentrale Funktion zum Laden/Aktualisieren der Liste
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

  const [newProfessor, setNewProfessor] = useState({
    email: '',
    name: '',
  });

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
      await loadProfessors(); // Liste aktualisieren
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error');
    }
  };

  const handleDeleteProfessor = async (id: string) => {
    try {
      await deleteProfessor(id); // Nutzt die Funktion aus deinem Service
      await loadProfessors();    // Liste aktualisieren
      toast.success('Professor deleted');
    } catch (error) {
      toast.error('Error deleting professor');
    }
  };

  const handleSetOfficeHours = () => {
    const { selectedProfessor, startTime, endTime, selectedOffice } = officeHours;

    if (!selectedProfessor || !startTime || !endTime || !selectedOffice) {
      toast.error('Please select a professor and fill all fields');
      return;
    }

    toast.success(`Office hours set for ${selectedProfessor.name}: ${startTime} - ${endTime} in ${selectedOffice}`);

    setSelectedProfessorId(null);
    setOfficeHours({
      selectedProfessor: null,
      startTime: '',
      endTime: '',
      selectedOffice: '',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Add Professor</h3>

        <div>
          <Label>Email</Label>
          <Input
            value={newProfessor.email}
            onChange={(e) =>
              setNewProfessor({ ...newProfessor, email: e.target.value })
            }
            className="mt-2"
          />
        </div>

        <div>
          <Label>Name</Label>
          <Input
            value={newProfessor.name}
            onChange={(e) =>
              setNewProfessor({ ...newProfessor, name: e.target.value })
            }
            className="mt-2"
          />
        </div>

        <Button onClick={handleAddProfessor} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Professor
        </Button>
      </Card>

      {/* Office Hours */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Set Office Hours</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Start Time</Label>
            <Select
              value={officeHours.startTime}
              onValueChange={(value) => setOfficeHours({ ...officeHours, startTime: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
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
                <SelectValue placeholder="Select end time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
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
                <SelectValue placeholder="Select office" />
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

        <Button onClick={handleSetOfficeHours} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Set Office Hours
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Manage Professors ({professors.length})
        </h3>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Office Hours</TableHead>
                <TableHead>Office</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {professors.map((professor) => (
                <TableRow
                  key={professor.id}
                  className={`cursor-pointer hover:bg-gray-50 ${selectedProfessorId === professor.id ? 'bg-blue-100' : ''}`}
                  onClick={() => {
                    setSelectedProfessorId(professor.id);
                    setOfficeHours({ ...officeHours, selectedProfessor: professor });
                  }}
                >
                  <TableCell>{professor.name}</TableCell>
                  <TableCell>{professor.email}</TableCell>
                  <TableCell>{professor.role}</TableCell>
                  <TableCell>{professor.officeHours || 'Not set'}</TableCell>
                  <TableCell>{professor.officeRoom || 'Not set'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOfficeHours({ ...officeHours, selectedProfessor: professor });
                        }}
                      >
                        Set Hours
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this professor?')) {
                            handleDeleteProfessor(professor.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {professors.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 py-8"
                  >
                    No professors available
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