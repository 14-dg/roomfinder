import './App.css'
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { RoomListScreen } from '@/screens/room/RoomListScreen'; // Die erstellen wir gleich!

function App() {
  return (
    // 1. Schicht: Auth (Wer bin ich?)
    <AuthProvider>
      {/* 2. Schicht: Daten (Was sehe ich?) */}
      <DataProvider>
        
        {/* 3. Schicht: Layout / GUI */}
        <div className="min-h-screen bg-gray-100 p-4">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">TH Köln RoomFinder</h1>
          </header>
          
          <main>
            {/* Hier laden wir deine View */}
            <RoomListScreen />
          </main>
        
        </div>

      </DataProvider>
    </AuthProvider>
  );
}

export default App;