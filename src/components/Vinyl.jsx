const BASE = import.meta.env.BASE_URL

// Grungy record (cut from the reference) with the song's cover as the label.
export default function Vinyl({ cover, spinning = false, className = '', style }) {
  return (
    <div className={`vinyl ${className}`} style={style}>
      <div className={`vinyl-disc${spinning ? ' spinning' : ''}`}>
        <img src={`${BASE}vinyl.png`} alt="" draggable="false" />
        <div className="vinyl-label" style={{ backgroundImage: `url(${cover})` }} />
        <div className="vinyl-hole" />
      </div>
    </div>
  )
}
