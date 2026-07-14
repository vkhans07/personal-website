import Pegs from './Pegs'

interface Props {
  lightsUp: boolean
  onToggle: () => void
  onScatter: () => void
}

export default function LightPanel({ lightsUp, onToggle, onScatter }: Props) {
  const actions = [
    { label: 'Scatter the paint', hint: 'burst', onClick: onScatter },
  ]

  return (
    <div className="wall-panel wall-panel--light">
      <Pegs />
      <div className="light-head">
        <span className="light-title">The Light</span>
        <button className="light-toggle" onClick={onToggle}>
          <span
            className="light-dot"
            style={{ background: lightsUp ? '#fff2cf' : '#e6c477' }}
          />
          {lightsUp ? 'house lights' : 'spotlight'}
        </button>
      </div>
      <div className="light-actions">
        {actions.map((a) => (
          <button key={a.label} className="light-action" onClick={a.onClick}>
            {a.label}
            <span className="light-action-hint">{a.hint}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
