import { useCallback, useEffect, useRef, useState } from 'react'
import { songs } from './data/songs'
import Crate from './components/Crate'
import Player from './components/Player'

const MOBILE_QUERY = '(max-width: 760px), (max-width: 1024px) and (orientation: portrait)'

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
      if (view !== 'player' || e.target.tagName === 'INPUT') return
      if (e.code === 'Space') {
        e.preventDefault()
        toggle()
      } else if (e.key === 'ArrowRight') load(index + 1)
      else if (e.key === 'ArrowLeft') load(index - 1)
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
