// Time slot component displaying a specific day with time slots (6:30 - 20:00, every 30 min)
// Status colors: 'available' (grün), 'occupied' (rot)

const generateTimeSlots = () => {
  const slots = []
  const startHour = 6
  const startMin = 30
  const endHour = 20
  const stepMin = 30

  let hour = startHour
  let min = startMin

  while (hour < endHour || (hour === endHour && min === 0)) {
    const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
    slots.push(timeStr)

    min += stepMin
    if (min >= 60) {
      min = 0
      hour += 1
    }
  }

  return slots
}

// Mock status data - later from database
const getMockStatus = (time) => {
  // Example: mark some times as occupied, others as available
  const occupiedTimes = ['09:00', '09:30', '14:00', '14:30', '15:00']
  return occupiedTimes.includes(time) ? 'occupied' : 'available'
}

export default function TimeSlotComponent({ day = 'Monday', statusData = {} }) {
  const timeSlots = generateTimeSlots()

  // If statusData is provided, use it; otherwise use mock status
  const getStatus = (time) => statusData[time] || getMockStatus(time)

  return (
    <div className="time-slot-container">
      <h3 className="time-slot-day">{day}</h3>
      <div className="time-slot-scroll">
        <div className="time-slot-list">
          {timeSlots.map((time) => (
            <div key={time} className={`time-slot-item ${getStatus(time)}`}>
              <span className="time-slot-time">{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
