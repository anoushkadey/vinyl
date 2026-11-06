import { useEffect, useMemo, useRef, useState } from 'react'
import Vinyl from './Vinyl'
import FlowBackground from './FlowBackground'
import { RansomWord } from './cutouts'
import { rng } from '../lib/rng'

/*
  A wooden crate with the records standing in it, fanned a little so each
  one shows. Nothing moves until you point at a record: hovering lifts it
  part-way out; choosing it slides it all the way out, carries it to the
  middle of the screen and sets it spinning, then the song opens.
*/
const FAN = [-18, -9, 0, 9, 18] // degrees, back-left to back-right

export default function Crate({ songs, onPick, mobile, nowPlaying, onResume }) {
  const [hover, setHover] = useState(-1)
  const [pulling, setPulling] = useState(null) // { i, x, y, size, rot }
  const pullRef = useRef(null)
  const recRefs = useRef([])
  const onPickRef = useRef(onPick)
  onPickRef.current = onPick

  // the pull-out: lift out of the box, glide to centre, spin, then open
  useEffect(() => {
    if (!pulling || !pullRef.current) return
    const el = pullRef.current
    const { x, y, size, rot } = pulling
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const lift = size * 0.75
    const scale = Math.min(window.innerWidth, window.innerHeight) * 0.62 / size
    const anim = el.animate(
      [
        { transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(1)`, offset: 0 },
        { transform: `translate(${x}px, ${y - lift}px) rotate(0deg) scale(1.02)`, offset: 0.38, easing: 'cubic-bezier(.3,.7,.2,1)' },
        { transform: `translate(${cx - size / 2}px, ${cy - size / 2}px) rotate(0deg) scale(${scale})`, offset: 0.82 },
        { transform: `translate(${cx - size / 2}px, ${cy - size / 2}px) rotate(0deg) scale(${scale})`, offset: 1 },
      ],
      { duration: 1550, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' },
    )
    const t = setTimeout(() => el.classList.add('spin-up'), 620)
    anim.onfinish = () => onPickRef.current(pulling.i)
    return () => {
      clearTimeout(t)
      anim.cancel()
    }
  }, [pulling])

  const choose = (i) => {
    if (pulling) return
    const el = recRefs.current[i]
    const r = el.getBoundingClientRect()
    const size = el.offsetWidth
    setPulling({ i, size, rot: FAN[i], x: r.left + r.width / 2 - size / 2, y: r.top + r.height / 2 - size / 2 })
  }

  const shown = pulling ? songs[pulling.i] : hover >= 0 ? songs[hover] : null
  const titleSeed = useMemo(() => rng('crate-title'), [])
  const title = useMemo(
    () => (
      <>
        <RansomWord text="pick a" seed={titleSeed} h={1.15} /> <RansomWord text="record" seed={titleSeed} h={1.15} />
      </>
    ),
    [titleSeed],
  )

  return (
    <section className={`crate ${mobile ? 'is-mobile' : 'is-desktop'}${pulling ? ' is-pulling' : ''}`}>
      <FlowBackground src={`${import.meta.env.BASE_URL}crate-bg.jpg`} strength={0.01} speed={0.22} />
      <div className="crate-vignette" />

      <header className="crate-head">
        <p className="crate-kicker">side a · spin something</p>
        <h1 className="crate-title">{title}</h1>
        <p className="crate-hint">{mobile ? 'tap a record to take it out' : 'point at a record · click to take it out'}</p>
      </header>

      <div className="box-wrap">
        <div className="box-back" />
        <div className="box-records" onMouseLeave={() => setHover(-1)}>
          {songs.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => (recRefs.current[i] = el)}
              className={`box-rec${hover === i ? ' up' : ''}${pulling?.i === i ? ' gone' : ''}`}
              style={{ '--rot': `${FAN[i]}deg`, '--x': `${(i - 2) * 19}%`, zIndex: hover === i ? 20 : i + 1 }}
              onMouseEnter={() => !pulling && setHover(i)}
              onFocus={() => !pulling && setHover(i)}
              onBlur={() => setHover(-1)}
              onClick={() => choose(i)}
              aria-label={`Play ${s.title} by ${s.artist}`}
            >
              <Vinyl cover={s.cover} />
            </button>
          ))}
        </div>
        <div className="box-front">
          <span className="box-stencil">side a · records</span>
        </div>
      </div>

      <aside className={`crate-info${shown ? ' on' : ''}`}>
        {shown ? (
          <div key={shown.id} className="info-card">
            <span className="info-no">No. {String(songs.indexOf(shown) + 1).padStart(2, '0')}</span>
            <h2 className="info-title">{shown.title}</h2>
            <p className="info-artist">{shown.artist}</p>
          </div>
        ) : (
          <p className="info-empty">{mobile ? '' : 'point at a record'}</p>
        )}
      </aside>

      {pulling && (
        <div className="pull-layer">
          <div ref={pullRef} className="pull-rec" style={{ width: pulling.size, height: pulling.size }}>
            <Vinyl cover={songs[pulling.i].cover} spinning />
          </div>
        </div>
      )}

      {nowPlaying && !pulling && (
        <button className="now-pill" onClick={onResume}>
          <span className="eq" aria-hidden="true"><i /><i /><i /></span>
          now playing · {nowPlaying.title}
        </button>
      )}
    </section>
  )
}
