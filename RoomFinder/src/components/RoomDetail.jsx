import { useParams, useLocation, useNavigate } from 'react-router-dom'

export default function RoomDetail() {
  const { roomNumber } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const room = location.state

  return (
    <div className="page">
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        ← Zurück
      </button>
      {room ? (
        <div className="room-detail">
          <h2>Room {room.roomNumber}</h2>
          <p><strong>Floor:</strong> {room.floor}</p>
          <p><strong>Availability:</strong> {room.availability}</p>
          <p><strong>Seats:</strong> {room.seats}</p>
          <p><strong>Equipment:</strong> {room.equipment}</p>
        </div>
      ) : (
        <p>Room information not available</p>
      )}
    </div>
  )
}