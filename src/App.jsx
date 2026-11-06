import { useCallback, useEffect, useRef, useState } from 'react'
import { songs } from './data/songs'
import Crate from './components/Crate'
import Player from './components/Player'

// phone layout only on a tall, portrait screen; any landscape window (a laptop,
// or a laptop's narrow side panel) keeps the laptop layout
const MOBILE_QUERY = '(max-aspect-ratio: 4/5)'

function useMobile() {
  const [m, setM] = useState(() => window.matchMedia(MOBILE_QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return m
}

export default function App() {
  const mobile = useMobile()
  const audioRef = useRef(null)
  const [audio, setAudio] = useState(null)
  const [index, setIndex] = useState(-1)
  const [view, setView] = useState('crate')
  const [playing, setPlaying] = useState(false)

  useEffect(() => setAudio(audioRef.current), [])

  const load = useCallback((i) => {
    const a = audioRef.current
    const n = (i + songs.length) % songs.length
    setIndex(n)
    a.src = songs[n].audio
    a.currentTime = 0
    a.play().catch(() => setPlaying(false))
  }, [])

  const pick = (i) => {
    if (i === index) {
      audioRef.current.play().catch(() => {})
    } else load(i)
    setView('player')
  }

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (a.paused) a.play().catch(() => {})
    else a.pause()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      // ignore keys aimed at a focused button/slider so space doesn't toggle twice
      if (view !== 'player' || e.target.tagName === 'INPUT') return
      const a = audioRef.current
      if (e.code === 'Space') {
        if (e.target.tagName === 'BUTTON') return
        e.preventDefault()
        toggle()
      } else if (e.key === 'ArrowRight') a.currentTime = Math.min(a.duration || 0, a.currentTime + 10)
      else if (e.key === 'ArrowLeft') a.currentTime = Math.max(0, a.currentTime - 10)
      else if (e.key === 'Escape') setView('crate')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, index, load, toggle])

  const song = index >= 0 ? songs[index] : null

  return (
    <main className={`app view-${view}`}>
      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => load(index + 1)}
      />
      {view === 'crate' && (
        <Crate
          songs={songs}
          mobile={mobile}
          onPick={pick}
          nowPlaying={playing ? song : null}
          onResume={() => setView('player')}
        />
      )}
      {view === 'player' && song && (
        <Player
          song={song}
          audio={audio}
          playing={playing}
          mobile={mobile}
          onToggle={toggle}
          onPrev={() => load(index - 1)}
          onNext={() => load(index + 1)}
          onBack={() => setView('crate')}
        />
      )}
      <div className="grain" aria-hidden="true" />
    </main>
  )
}
