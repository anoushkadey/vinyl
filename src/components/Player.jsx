import { useEffect, useState } from 'react'
import Vinyl from './Vinyl'
import Lyrics from './Lyrics'

const fmt = (s) => {
  if (!isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

const Icon = {
  prev: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2.4v14H6zM20 5v14L9.5 12z" /></svg>
  ),
  next: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.6 5H18v14h-2.4zM4 5l10.5 7L4 19z" /></svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l12 7-12 7z" /></svg>
  ),
  back10: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z" />
      <text x="12" y="16.2" textAnchor="middle" fontSize="6.4" fontWeight="700" fontFamily="Arial, sans-serif">10</text>
    </svg>
  ),
  fwd10: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5V2l5 4-5 4V7a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8z" />
      <text x="12" y="16.2" textAnchor="middle" fontSize="6.4" fontWeight="700" fontFamily="Arial, sans-serif">10</text>
    </svg>
  ),
  pause: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z" /></svg>
  ),
}

export default function Player({ song, audio, playing, onToggle, onPrev, onNext, onBack, mobile }) {
  const [time, setTime] = useState(0)
  const [dur, setDur] = useState(0)

  // poll currentTime every frame so lyric cues land exactly on time
  useEffect(() => {
    let raf
    const tick = () => {
      if (audio) {
        setTime(audio.currentTime)
        setDur(audio.duration || 0)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [audio])

  let active = -1
  for (let i = song.lyrics.length - 1; i >= 0; i--) {
    const l = song.lyrics[i]
    if (time >= l.t) {
      if (time < l.end) active = i
      break
    }
  }

  const skip = (d) => {
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min((audio.duration || 0) - 0.1, audio.currentTime + d))
    setTime(audio.currentTime)
  }

  const seek = (e) => {
    if (audio && dur) audio.currentTime = (+e.target.value / 1000) * dur
  }

  return (
    <section className={`player theme-${song.theme} ${mobile ? 'is-mobile' : 'is-desktop'}${playing ? '' : ' is-paused'}`}>
      <div
        key={`poster-${song.id}`}
        className="poster"
        style={
          !mobile && song.posterWide
            ? { backgroundImage: `url(${song.posterWide})`, backgroundSize: '100% 100%' }
            : { backgroundImage: `url(${song.poster})`, backgroundPosition: mobile ? 'center' : song.posterPos }
        }
      />
      <div className="poster-shade" />
      {song.theme === 'fade' && (
        <div className="bg-spirals" aria-hidden="true">
          {[
            { l: '-6%', t: '-14%', s: '44vh', d: '0s' },
            { l: '72%', t: '54%', s: '52vh', d: '-9s' },
            { l: '44%', t: '-20%', s: '30vh', d: '-4s' },
          ].map((p, i) => (
            <img key={i} src={`${import.meta.env.BASE_URL}spiral-black.png`} alt="" style={{ left: p.l, top: p.t, width: p.s, animationDelay: p.d }} />
          ))}
        </div>
      )}

      <button className="back-btn" onClick={onBack}>
        ← back to the crate
      </button>

      <Lyrics key={song.id} song={song} active={active} mobile={mobile} />

      <div className="dock" key={`dock-${song.id}`}>
        <div className="np-label">
          <span className="np-tape" aria-hidden="true" />
          <span className="np-title">{song.title.toLowerCase()}</span>
          <span className="np-artist">{song.artist.toLowerCase()}</span>
        </div>
        <Vinyl cover={song.cover} spinning={playing} className="dock-vinyl" />
        <div className="progress">
          <input
            type="range"
            min="0"
            max="1000"
            value={dur ? Math.round((time / dur) * 1000) : 0}
            onChange={seek}
            aria-label="Seek"
            style={{ '--p': `${dur ? (time / dur) * 100 : 0}%` }}
          />
          <div className="times">
            <span>{fmt(time)}</span>
            <span>{fmt(dur)}</span>
          </div>
        </div>
        <div className="controls">
          <button onClick={onPrev} aria-label="Previous song">{Icon.prev}</button>
          <button onClick={() => skip(-10)} aria-label="Back 10 seconds">{Icon.back10}</button>
          <button className="pp" onClick={onToggle} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? Icon.pause : Icon.play}
          </button>
          <button onClick={() => skip(10)} aria-label="Forward 10 seconds">{Icon.fwd10}</button>
          <button onClick={onNext} aria-label="Next song">{Icon.next}</button>
        </div>
      </div>
    </section>
  )
}
