import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RoomFilterComponent() {
  const navigate = useNavigate()
  const [floor, setFloor] = useState('')
  const [availability, setAvailability] = useState('')
  const [beamer, setBeamer] = useState(false)

  const clearFilters = () => {
    setFloor('')
    setAvailability('')
    setBeamer(false)
  }

  return (
    <div className="page">
      <div className="filter-top">
        <h2>Room Filters</h2>
        <button type="button" onClick={() => navigate(-1)} className="back-button">
          Back
        </button>
      </div>

      <div className="filter-body">
        <label>
          Floor:
          <select value={floor} onChange={(e) => setFloor(e.target.value)}>
            <option value="">Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>


          </select>
        </label>

        <br />

        <label>
          Availability:
          <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <option value="">Any</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
          </select>
        </label>

        <br />

        <label>
          <input
            type="checkbox"
            checked={beamer}
            onChange={(e) => setBeamer(e.target.checked)}
          />
          {' '}Beamer (Projector)
        </label>

        <div style={{ marginTop: '12px' }}>
          <button type="button" className="clear-filters-button" onClick={clearFilters}>
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  )
}
