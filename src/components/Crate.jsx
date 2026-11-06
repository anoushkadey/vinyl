import { useEffect, useMemo, useRef, useState } from 'react'
import Vinyl from './Vinyl'
import FlowBackground from './FlowBackground'
import { RansomWord } from './cutouts'
import { rng } from '../lib/rng'

/*
  Endless 3D record crate.
  Laptop: a column of records flowing top -> bottom, tilted around X.
  Phone:  a row flowing left -> right, tilted around Y (like the reference).
  The 5 songs repeat forever so the crate always looks full.
*/
export default function Crate({ songs, onPick, mobile, nowPlaying, onResume }) {
  const wrapRef = useRef(null)
  const itemRefs = useRef([])
  const [hover, setHover] = useState(-1) // slot index
  const hoverRef = useRef(-1)
  const pickingRef = useRef(-1)
  const [dims, setDims] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = wrapRef.current
    const ro = new ResizeObserver(([e]) => setDims({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const along = mobile ? dims.w : dims.h // length of the flow axis
  const D = mobile ? Math.min(dims.h * 0.82, dims.w * 0.64, 280) : Math.min(dims.h * 0.42, dims.w * 0.9, 380)
  const S = D * (mobile ? 0.26 : 0.24)
  const count = D > 0 ? Math.ceil((along + D * 2) / S / songs.length) * songs.length : 0

  const state = useRef({ offset: 0, vel: 0, impulse: 0, pops: [] })

  useEffect(() => {
    if (!count) return
    const st = state.current
    st.pops = Array.from({ length: count }, (_, i) => st.pops[i] || 0)
    let raf
    let last = performance.now()
    const base = mobile ? 14 : 12 // slow, calm drift; stops while you point at a record
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const target = hoverRef.current >= 0 || pickingRef.current >= 0 ? 0 : base
      st.vel += (target - st.vel) * Math.min(1, dt * 4)
      st.impulse *= Math.pow(0.04, dt)
      st.offset += (st.vel + st.impulse) * dt
      const total = count * S
      for (let i = 0; i < count; i++) {
        const el = itemRefs.current[i]
        if (!el) continue
        let pos = (((i * S + st.offset) % total) + total) % total
        const y = pos - total / 2
        const p = y / (along / 2 || 1)
        const ap = Math.min(1, Math.abs(p))
        const want = hoverRef.current === i || pickingRef.current === i ? 1 : 0
        st.pops[i] += (want - st.pops[i]) * Math.min(1, dt * 4.5)
        const k = st.pops[i]
        // edge-on in the middle, opening up towards the ends
        const ang = Math.sign(p || 1) * (76 - 46 * ap) * (1 - k)
        const z = 100 - Math.round(ap * 100) + (k > 0.05 ? 500 : 0)
        const out = k * D * (mobile ? 0.45 : 0.5)
        el.style.zIndex = z
        el.style.opacity = Math.abs(y) > along / 2 + D * 0.7 ? 0 : 1
        el.style.transform = mobile
          ? `translate(-50%,-50%) translateX(${y}px) translateY(${-out}px) rotateY(${-ang}deg) scale(${1 + k * 0.1})`
          : `translate(-50%,-50%) translateY(${y}px) translateX(${out}px) rotateX(${ang}deg) scale(${1 + k * 0.08})`
        el.dataset.pos = y
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [count, S, D, along, mobile])

  // pick the slot closest to the pointer along the flow axis
  const slotAt = (clientX, clientY) => {
    const rect = wrapRef.current.getBoundingClientRect()
    const c = mobile ? clientX - rect.left - rect.width / 2 : clientY - rect.top - rect.height / 2
    const cross = mobile ? clientY - rect.top - rect.height / 2 : clientX - rect.left - rect.width / 2
    if (Math.abs(cross) > D * 0.95) return -1
    let best = -1
    let bd = Infinity
    itemRefs.current.forEach((el, i) => {
      if (!el) return
      const d = Math.abs(+el.dataset.pos - c)
      if (d < bd) {
        bd = d
        best = i
      }
    })
    return bd < S * 1.5 ? best : -1
  }

  const setHoverSlot = (i) => {
    if (hoverRef.current === i) return
    hoverRef.current = i
    setHover(i)
  }

  const drag = useRef(null)
  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, moved: 0 }
  }
  const onPointerMove = (e) => {
    if (drag.current && e.buttons) {
      const d = mobile ? e.clientX - drag.current.x : e.clientY - drag.current.y
      drag.current.moved += Math.abs(d)
      drag.current.x = e.clientX
      drag.current.y = e.clientY
      state.current.offset += d
      if (drag.current.moved > 8) setHoverSlot(-1)
      return
    }
    if (!mobile && e.pointerType === 'mouse') setHoverSlot(slotAt(e.clientX, e.clientY))
  }
  const onPointerUp = (e) => {
    const moved = drag.current?.moved ?? 0
    drag.current = null
    if (moved > 8 || pickingRef.current >= 0) return
    const i = slotAt(e.clientX, e.clientY)
    if (i < 0) return
    pickingRef.current = i
    setHoverSlot(i)
    setTimeout(() => {
      pickingRef.current = -1
      onPick(i % songs.length)
    }, 750)
  }
  const onWheel = (e) => {
    state.current.impulse += (mobile ? e.deltaX || e.deltaY : e.deltaY) * 2.2
  }

  const shown = hover >= 0 ? songs[hover % songs.length] : null
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
    <section
      className={`crate ${mobile ? 'is-mobile' : 'is-desktop'}`}
    >
      <FlowBackground src={`${import.meta.env.BASE_URL}crate-bg.jpg`} strength={0.014} speed={0.32} />
      <div className="crate-vignette" />
      <header className="crate-head">
        <p className="crate-kicker">side a · spin something</p>
        <h1 className="crate-title">{title}</h1>
        <p className="crate-hint">{mobile ? 'swipe the crate · tap a record to play' : 'scroll the crate · hover to pull one out · click to play'}</p>
      </header>

      <div
        className="crate-stage"
        ref={wrapRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          drag.current = null
          if (pickingRef.current < 0) setHoverSlot(-1)
        }}
        onWheel={onWheel}
        style={{ cursor: hover >= 0 ? 'pointer' : 'grab' }}
      >
        {Array.from({ length: count }, (_, i) => {
          const s = songs[i % songs.length]
          return (
            <div
              key={i}
              ref={(el) => (itemRefs.current[i] = el)}
              className="crate-item"
              style={{ width: D, height: D }}
            >
              <Vinyl cover={s.cover} spinning />
            </div>
          )
        })}
      </div>

      <aside className={`crate-info${shown ? ' on' : ''}`}>
        {shown ? (
          <div key={shown.id} className="info-card">
            <span className="info-no">No. {String(songs.indexOf(shown) + 1).padStart(2, '0')}</span>
            <h2 className="info-title">{shown.title}</h2>
            <p className="info-artist">{shown.artist}</p>
            <span className="info-cta">{mobile ? 'tap to play ▸' : 'click to play ▸'}</span>
          </div>
        ) : (
          <p className="info-empty">{mobile ? 'tap a record to play' : 'hover over a record'}</p>
        )}
      </aside>

      {nowPlaying && (
        <button className="now-pill" onClick={onResume}>
          <span className="eq" aria-hidden="true"><i /><i /><i /></span>
          now playing · {nowPlaying.title}
        </button>
      )}
    </section>
  )
}
