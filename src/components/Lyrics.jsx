import { memo, useEffect, useRef, useState } from 'react'
import { rng, burstPolygon, tornPolygon } from '../lib/rng'
import { THEMES } from './cutouts'

const clean = (w) => w.replace(/[^a-z0-9']/gi, '')

function splitRows(words, maxChars) {
  const rows = []
  let row = []
  let len = 0
  words.forEach((w, i) => {
    if (row.length && len + w.length > maxChars) {
      rows.push(row)
      row = []
      len = 0
    }
    row.push(i)
    len += w.length + 1
  })
  if (row.length) rows.push(row)
  return rows
}

const LyricLine = memo(function LyricLine({ song, line, idx, mobile, leaving }) {
  const theme = THEMES[song.theme]
  const r = rng(`${song.id}:${idx}`)
  const words = line.text.split(/\s+/).filter(Boolean)

  // The longest word becomes the "hero" (gets real cut-out letters).
  let hero = -1
  let best = 2
  words.forEach((w, i) => {
    const n = clean(w).length
    if (n > best || (n === best && r() < 0.35)) {
      best = n
      hero = i
    }
  })

  const rows = splitRows(words, Math.round(theme.rowChars * (mobile ? 0.68 : 1)))
  const dur = Math.max(1.2, line.end - line.t)
  const step =
    theme.stagger === 'spread'
      ? Math.min(0.6, (dur * 0.7) / words.length)
      : Math.min(0.2, (dur * 0.5) / words.length)

  // staircase: each row drifts right then occasionally resets, like the
  // collage reference.
  const maxOff = mobile ? 22 : 34
  let off = r.range(0, 8)
  const offsets = rows.map((_, ri) => {
    if (ri > 0) {
      off += r.range(5, 13)
      if (off > maxOff) off = r.range(0, 8)
    }
    return off
  })

  const nodes = words.map((w, i) => theme.word(w, { r, i, hero: i === hero, first: i === 0 }))

  let scrap = null
  if (theme.scrap && r() < theme.scrap.chance) {
    const burst = theme.scrap.fill === 'pink-burst' || r() < 0.4
    scrap = (
      <span
        className={`scrap ${theme.scrap.fill}`}
        style={{
          left: `${r.range(-6, 30)}%`,
          top: `${r.range(-14, 20)}%`,
          width: `${r.range(45, 75)}%`,
          height: `${r.range(70, 120)}%`,
          '--r': `${r.range(-14, 14)}deg`,
          clipPath: burst ? burstPolygon(r, r.int(9, 16), r.range(0.6, 0.8)) : tornPolygon(r, 9, 6),
        }}
      />
    )
  }

  const stickers = theme.stickers.length
    ? Array.from({ length: r.int(...(theme.stickerCount || [2, 4])) }, (_, k) => (
        <span
          key={k}
          className="sticker boil"
          style={{
            left: `${r.range(-4, 98)}%`,
            top: `${r.range(-18, 108)}%`,
            color: theme.stickerColor,
            fontSize: `${r.range(0.6, 1.3)}em`,
            '--r': `${r.range(-20, 20)}deg`,
            animationDelay: `${r.range(0.1, Math.min(dur, 2))}s, var(--bd, 0s)`,
          }}
        >
          {r.pick(theme.stickers)}
        </span>
      ))
    : null

  const spiral =
    theme.spiral && r() < theme.spiral
      ? Array.from({ length: r.int(1, 2) }, (_, k) => (
          <img
            key={k}
            className="spiral-sticker"
            src={`${import.meta.env.BASE_URL}spiral.png`}
            alt=""
            style={{
              left: `${k ? r.range(-6, 20) : r.range(70, 100)}%`,
              top: `${k ? r.range(70, 110) : r.range(-25, 30)}%`,
              '--r': `${r.range(0, 360)}deg`,
              '--sz': `${r.range(1.8, 3.4)}em`,
            }}
          />
        ))
      : null

  return (
    <div className={`lyric-line theme-${song.theme}${leaving ? ' leaving' : ''}`} aria-hidden={leaving}>
      {scrap}
      {rows.map((row, ri) => (
        <div className="lyric-row" key={ri} style={{ marginLeft: `${offsets[ri]}%` }}>
          {row.map((wi) => (
            <span key={wi} className="pop" style={{ animationDelay: `${wi * step}s` }}>
              {nodes[wi]}
            </span>
          ))}
        </div>
      ))}
      {spiral}
      {stickers}
    </div>
  )
})

export default function Lyrics({ song, active, mobile }) {
  const [leavingIdx, setLeavingIdx] = useState(null)
  const last = useRef(active)

  useEffect(() => {
    if (last.current !== active && last.current >= 0) {
      setLeavingIdx(last.current)
      const id = setTimeout(() => setLeavingIdx(null), 380)
      last.current = active
      return () => clearTimeout(id)
    }
    last.current = active
  }, [active])

  return (
    <div className="lyrics-stage" aria-live="polite">
      {leavingIdx != null && leavingIdx !== active && song.lyrics[leavingIdx] && (
        <LyricLine key={`l${leavingIdx}`} song={song} line={song.lyrics[leavingIdx]} idx={leavingIdx} mobile={mobile} leaving />
      )}
      {active >= 0 && (
        <LyricLine key={`a${active}`} song={song} line={song.lyrics[active]} idx={active} mobile={mobile} />
      )}
      <span className="sr-only">{active >= 0 ? song.lyrics[active].text : ''}</span>
    </div>
  )
}
