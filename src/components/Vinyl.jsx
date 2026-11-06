const BASE = import.meta.env.BASE_URL

// Polished black record. The grooves + cover label spin; the light
// reflection (sheen) stays put, the way a real record looks on a turntable.
export default function Vinyl({ cover, spinning = false, className = '', style }) {
  return (
    <div className={`vinyl ${className}`} style={style}>
      <div className={`vinyl-disc${spinning ? ' spinning' : ''}`}>
        <img src={`${BASE}vinyl-disc.png`} alt="" draggable="false" />
        <div className="vinyl-label" style={{ backgroundImage: `url(${cover})` }} />
        <div className="vinyl-hole" />
      </div>
      <img className="vinyl-sheen" src={`${BASE}vinyl-sheen.png`} alt="" draggable="false" />
    </div>
  )
}
