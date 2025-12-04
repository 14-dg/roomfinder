//anzeige von Professorenm mit ihren eigenschaften in boxen in Professor.jsx als liste
export default function ProfessorComponent({
  name = 'Dr. Max Mustermann',
  faculty = 'Informatik',
  timeRange = 'Mo–Fr, 10:00–12:00',
}) {
  return (
    <div className="professor-box">
      <h4>{name}</h4>
      <p>Fach: {faculty}</p>
      <p>Zeitraum: {timeRange}</p>
    </div>
  )
}
