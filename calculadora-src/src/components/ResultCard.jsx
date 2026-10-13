function ResultCard({ icon, title, value, unit, className = '' }) {
  return (
    <div className={`result-card ${className} fade-in`}>
      <span className="result-icon">{icon}</span>
      <div className="result-title">{title}</div>
      <div className="result-value">{value}</div>
      <div className="result-unit">{unit}</div>
    </div>
  )
}

export default ResultCard
