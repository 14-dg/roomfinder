import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Switch from '@mui/material/Switch'
import TimeSlotComponent from './TimeSlotComponent'

export default function RoomDetail() {
  const { roomNumber } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const room = location.state
  const [isCheckedIn, setIsCheckedIn] = useState(false)

  const handleToggle = (event) => {
    setIsCheckedIn(event.target.checked)
  }

  const label = { inputProps: { 'aria-label': 'Check-in switch' } }

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
          
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Check-in:
            </label>
            <Switch 
              {...label}
              checked={isCheckedIn}
              onChange={handleToggle}
            />
            <span>{isCheckedIn ? 'Eingecheckt' : 'Nicht eingecheckt'}</span>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3>Verfügbarkeit nach Wochentag</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
              <TimeSlotComponent day="Montag" />
              <TimeSlotComponent day="Dienstag" />
              <TimeSlotComponent day="Mittwoch" />
              <TimeSlotComponent day="Donnerstag" />
              <TimeSlotComponent day="Freitag" />
              <TimeSlotComponent day="Samstag" />
            </div>
          </div>
        </div>
      ) : (
        <p>Room information not available</p>
      )}
    </div>
  )
}