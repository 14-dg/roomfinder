import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';

// Generiere alle verfügbaren Zeitslots für Office Hours (8:00 - 20:30 in 30er Schritten)
const timeOptions = (() => {
  const options = ["On Request"];
  for (let h = 8; h <= 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      options.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  return options;
})();

// Wochentage für die Office-Hours-Auswahl
const daysOfWeek = [
  { id: 'Mon', label: 'Mon' },
  { id: 'Tue', label: 'Tue' },
  { id: 'Wed', label: 'Wed' },
  { id: 'Thu', label: 'Thu' },
  { id: 'Fri', label: 'Fri' },
  { id: 'Sat', label: 'Sat' },
  { id: 'Sun', label: 'Sun' },
];

// Admin-Screen zur Verwaltung von Professoren: Erstellen von Konten, Office Hours und Löschung
export default function ProfessorsAdmin() {
  const { rooms, lecturers, addProfessor, removeProfessor, updateOfficeHours } = useData();
  
  // Tracks welcher Professor gerade bearbeitet wird
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Formularfeld für neue Professor-Konten
  const [form, setForm] = useState({ email: '', name: '' });
  // Zeitfenster und Raum für Office Hours
  const [hours, setHours] = useState({ start: '', end: '', room: '' });
  // Ausgewählte Wochentage für die Office Hours
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Toggle eines Wochentags in der Office-Hours-Auswahl
  const handleDayChange = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
  };

  // Erstellt einen neuen Professor und sendet Willkommens-Email
  const handleCreate = async () => {
    if (!form.email || !form.name) return toast.error("Please fill in all fields");

    // Validiert dass die Email von der TH Köln ist
    const emailRegex = /^[a-zA-Z0-9._%+-]+@smail\.th-koeln\.de$/;
    if (!emailRegex.test(form.email)) {
      return toast.error("Invalid email format! Must be @smail.th-koeln.de");
    }
    
    try {
      await addProfessor(form.email, form.name);
      toast.success(`Account for ${form.name} created and email sent.`);
      setForm({ email: '', name: '' });
    } catch (e: any) {
      toast.error("Error: " + e.message);
    }
  };

  // Speichert die Office Hours für einen ausgewählten Professor
  const handleSaveHours = async () => {
    if (!selectedId || !hours.start || !hours.end || !hours.room) {
      return toast.error("Please complete all office hour details");
    }

    if (selectedDays.length === 0) {
      return toast.error("Please select at least one day");
    }

    // Formatiert die Uhrzeiten schön (z.B. "14:00 - 16:00 Mon, Wed, Fri")
    const timeDisplay = hours.start === "On Request" && hours.end === "On Request" 
      ? "On Request" 
      : `${hours.start} - ${hours.end}`;
    
    const finalOfficeHours = `${timeDisplay} ${selectedDays.join(', ')}`;

    try {
      await updateOfficeHours(selectedId, finalOfficeHours, hours.room);
      toast.success("Office hours updated in lecturer profile");
      setSelectedId(null);
      setSelectedDays([]);
      setHours({ start: '', end: '', room: '' });
    } catch {
      toast.error("Failed to save changes");
    }
  };

  const currentLec = lecturers.find(l => l.id === selectedId);

  return (
    <div className="p-4 space-y-8">
      {/* ABSCHNITT 1: Neuen Professor registrieren */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Register New Professor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              placeholder="e.g. Prof. Dr. Smith" 
            />
          </div>
          <div className="space-y-2">
            <Label>Email Address (@smail.th-koeln.de)</Label>
            <Input 
              type="email"
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              placeholder="example@smail.th-koeln.de" 
            />
          </div>
        </div>
        <Button onClick={handleCreate} className="w-full">
          <Mail className="w-4 h-4 mr-2" /> Create Account & Send Email
        </Button>
      </Card>

      {/* ABSCHNITT 2: Office Hours eines Professors bearbeiten */}
      <Card className={`p-6 border-2 transition-all ${selectedId ? 'border-blue-500 shadow-lg' : 'opacity-50'}`}>
        <h3 className="text-lg font-bold mb-4">
          Manage Office Hours {currentLec && <span className="text-blue-600 ml-2">for {currentLec.name}</span>}
        </h3>
        
        <div className="space-y-6">
          {/* Startzeit, Endzeit und Raum auswählen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select onValueChange={v => setHours({...hours, start: v})}>
              <SelectTrigger><SelectValue placeholder="Start Time" /></SelectTrigger>
              <SelectContent>
                {timeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={v => setHours({...hours, end: v})}>
              <SelectTrigger><SelectValue placeholder="End Time" /></SelectTrigger>
              <SelectContent>
                {timeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={v => setHours({...hours, room: v})}>
              <SelectTrigger><SelectValue placeholder="Select Room" /></SelectTrigger>
              <SelectContent>
                {rooms.map(r => <SelectItem key={r.id} value={r.roomName}>{r.roomName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Wochentage auswählen */}
          <div className="space-y-3">
            <Label>Select Days</Label>
            <div className="flex flex-wrap gap-4 p-3 bg-slate-50 rounded-lg border">
              {daysOfWeek.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={day.id} 
                    checked={selectedDays.includes(day.id)}
                    onCheckedChange={() => handleDayChange(day.id)}
                  />
                  <label htmlFor={day.id} className="text-sm font-medium leading-none cursor-pointer">
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSaveHours} 
            disabled={!selectedId} 
            className="w-full" 
            variant="secondary"
          >
            Update Office Hours
          </Button>
        </div>
      </Card>

      {/* ABSCHNITT 3: Alle Professoren anzeigen und verwalten */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Lecturer List</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lecturer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Office Hours</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lecturers.map((lec) => (
              <TableRow 
                key={lec.id} 
                onClick={() => setSelectedId(lec.id)}
                className={`cursor-pointer hover:bg-slate-50 ${selectedId === lec.id ? 'bg-blue-50' : ''}`}
              >
                {/* Klick auf eine Reihe wählt den Professor für Office-Hours-Bearbeitung */}
                <TableCell className="font-semibold">{lec.name}</TableCell>
                <TableCell>{lec.email}</TableCell>
                <TableCell>{lec.officeHours || 'Not set'}</TableCell>
                <TableCell>{lec.officeLocation || '—'}</TableCell>
                <TableCell className="text-right">
                  {/* Löscht den Professor nach Bestätigung */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if(confirm("Are you sure you want to delete this professor?")) {
                        removeProfessor(lec.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}