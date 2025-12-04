import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Rooms from './pages/Rooms'
import RoomDetail from './components/RoomDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Rooms />} />
        <Route path="/room/:roomNumber" element={<RoomDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
