//anzeige von räumen mit ihren eigenschaften in boxen in Rooms.jsx als liste
export default function RoomComponent({
  roomNumber = '101',
  floor = '1',
  availability = 'Available',
  seats = '25',
  equipment = 'Projector, Whiteboard',
}) {
  return (
    <div className="room-box">
      <h4>Room {roomNumber}</h4>
      <p>Floor: {floor}</p>
      <p>Availability: {availability}</p>
      <p>Seats: {seats}</p>
      <p>Equipment: {equipment}</p>
    </div>
  )
}
