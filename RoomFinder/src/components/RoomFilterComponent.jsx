import { useNavigate } from 'react-router-dom'

export default function RoomFilterComponent() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <div className="filter-top">
        <h2>Room Filters</h2>
        <button type="button" onClick={() => navigate(-1)} className="back-button">
          Back
        </button>
      </div>

      <div className="filter-body">
        <p>Here you can add filter controls (floor, availability, seats, equipment).</p>
        {/* Example placeholder controls */}
        <label>
          Floor:
          <select>
            <option value="">Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </label>
        <br />
        <label>
          Availability:
          <select>
            <option value="">Any</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
          </select>
        </label>
      </div>
    </div>
  )
}
