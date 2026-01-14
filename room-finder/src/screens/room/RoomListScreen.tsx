// src/pages/RoomListScreen.tsx
import { useData } from '@/contexts/DataContext';

export function RoomListScreen() {
  // Zugriff auf den Service Layer
  const { rooms, isLoading, refreshStatus } = useData();

  if (isLoading) {
    return <div className="text-center p-10">Lade Raumdaten...</div>;
  }

  return (
    <div>
      {/* Optional: Ein Button zum manuellen Neuladen (hilft beim Testen) */}
      <button 
        onClick={refreshStatus}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
      >
        Status aktualisieren
      </button>

      {/* Grid Layout für die Karten */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {rooms.map((room) => (
          <div 
            key={room.id} 
            className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-200 overflow-hidden"
            // Dynamischer Rand je nach Status (Rot/Grün)
            style={{ borderLeftColor: room.isOccupiedByLecture ? '#ef4444' : '#22c55e' }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{room.label}</h3>
                <p className="text-sm text-gray-500">{room.roomType}</p>
              </div>
              
              {/* Die Ampel */}
              <span className={`px-2 py-1 text-xs font-bold rounded text-white ${
                room.isOccupiedByLecture ? 'bg-red-500' : 'bg-green-500'
              }`}>
                {room.isOccupiedByLecture ? 'BELEGT' : 'FREI'}
              </span>
            </div>

            {/* Zusatzinfo: Was läuft da gerade? */}
            {room.isOccupiedByLecture && (
              <div className="mt-3 bg-red-50 p-2 rounded text-sm text-red-800">
                <strong>Aktuell:</strong> {room.currentLectureName || "Unbekannte Vorlesung"}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-600 flex justify-between">
               <span>Gebäude: {room.building}</span>
               <span>Etage: {room.floor}</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}