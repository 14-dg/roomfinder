// src/screens/admin/ProfessorsAdmin.tsx
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { registerUser } from '@/services/firebase';

export default function ProfessorsAdmin() {
  const [newProfessor, setNewProfessor] = useState({
    email: '',
    name: '',
    
  });

  const handleAddProfessor = async () => {
    const { email, name } = newProfessor;

    if (!email || !name) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await registerUser(email,  name, 'professor');
      toast.success(`Professor ${name} added`);

      setNewProfessor({ email: '', name: '', });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error');
    }
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

      <Card className="p-6">
        <h3 className="mb-4">Professors List</h3>
        <p className="text-gray-500 text-sm text-center py-8">
          No professors loaded yet
        </p>
      </Card>
    </div>
  );
}
