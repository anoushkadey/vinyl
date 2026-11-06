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

  const seek = (e) => {
    if (audio && dur) audio.currentTime = (+e.target.value / 1000) * dur
  }

  return (
    <section className={`player theme-${song.theme} ${mobile ? 'is-mobile' : 'is-desktop'}`}>
      <div
        key={`poster-${song.id}`}
        className="poster"
        style={{ backgroundImage: `url(${song.poster})`, backgroundPosition: mobile ? 'center' : song.posterPos }}
      />
      <div className="poster-shade" />

      <button className="back-btn" onClick={onBack}>
        ← back to the crate
      </button>

      <Lyrics key={song.id} song={song} active={active} mobile={mobile} />

      <div className="dock" key={`dock-${song.id}`}>
        <div className="sleeve">
          <div className="np-label">
            <span className="np-kicker">now playing</span>
            <span className="np-title">{song.title}</span>
            <span className="np-artist">{song.artist}</span>
          </div>
          <img className="sleeve-art" src={song.cover} alt={`${song.title} cover`} />
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
            <button className="pp" onClick={onToggle} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? Icon.pause : Icon.play}
            </button>
            <button onClick={onNext} aria-label="Next song">{Icon.next}</button>
          </div>
        </div>
        <Vinyl cover={song.cover} spinning={playing} className="dock-vinyl" />
      </div>
    </section>
  )
}
