//anzeige von räumen mit ihren eigenschaften in boxen in Rooms.jsx als liste
import { useNavigate } from 'react-router-dom'

export default function RoomComponent({
  roomNumber = '101',
  floor = '1',
  availability = 'Available',
  seats = '25',
  equipment = 'Projector, Whiteboard',
}) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/room/${roomNumber}`, {
      state: { roomNumber, floor, availability, seats, equipment }
    })
  }

  return (
    <div className="room-box" onClick={handleClick} style={{ cursor: 'pointer', backgroundColor: 'white', color: 'black' }}>
      <h4>Room {roomNumber}</h4>
      <p>Floor: {floor}</p>
      <p>Availability: {availability}</p>
      <p>Seats: {seats}</p>
      <p>Equipment: {equipment}</p>
    </div>
  )
}
