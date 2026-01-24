import './App.css'
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';

function App() {
  useEffect( () => {

    const testconnection = async () => {
      const { data, error } = await supabase.from('rooms').select('*');
      if (error) {
        console.error("Fehler:", error);
      } else {
        console.log("Daten aus der DB:", data);
      }
    }
    testconnection();
  }, [])

  return (
    <div>
      hallo
    </div>
  );
}

export default App;