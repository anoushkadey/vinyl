// Cut-out letter building blocks + the per-song lyric styles.
import sprites from '../data/sprites.json'
import { patchPolygon, tornPolygon } from '../lib/rng'

const BASE = import.meta.env.BASE_URL

/* ---------- primitives ---------- */

// A letter cropped straight out of one of the alphabet sheets.
export function SpriteLetter({ sheet, rect, h = 1.25, rot = 0, boil = true }) {
  const s = sprites[sheet]
  const k = h / rect[3]
  return (
    <span
      className={`cut-letter sprite${boil ? ' boil' : ''}`}
      style={{
        width: `${rect[2] * k}em`,
        height: `${h}em`,
        backgroundImage: `url(${BASE}${s.src})`,
        backgroundSize: `${s.w * k}em ${s.h * k}em`,
        backgroundPosition: `${-rect[0] * k}em ${-rect[1] * k}em`,
        '--r': `${rot}deg`,
        '--bd': `${-(Math.abs(rot * 97) % 600)}ms`,
      }}
    />
  )
}

export function spriteFor(sheet, ch, r) {
  const list = sprites[sheet]?.letters[ch.toLowerCase()]
  return list ? r.pick(list) : null
}

// A letter built in code: a scrap of paper with a printed glyph.
export function PaperLetter({ ch, bg, color, font, rot = 0, clip, shadow, size = 1, className = '' }) {
  return (
    <span
      className={`cut-letter paper boil ${className}`}
      style={{
        background: bg,
        color,
        fontFamily: font,
        clipPath: clip,
        textShadow: shadow,
        fontSize: `${size}em`,
        '--r': `${rot}deg`,
        '--bd': `${-(Math.abs(rot * 131) % 600)}ms`,
      }}
    >
      {ch}
    </span>
  )
}

const RANSOM_FONTS = [
  "'Abril Fatface', serif",
  "'Archivo Black', sans-serif",
  "'Playfair Display', serif",
  "'Special Elite', monospace",
  "'DM Serif Display', serif",
  "'Bagel Fat One', sans-serif",
]

// Mixed-sheet ransom word used for headings (crate title etc.)
export function RansomWord({ text, seed, h = 1.2 }) {
  const r = seed
  const sheets = ['ransom', 'purple', 'patterned', 'ransom', 'purple']
  return (
    <span className="cut-word">
      {[...text].map((ch, i) => {
        if (ch === ' ') return <span key={i} className="cut-space" />
        const sheet = r.pick(sheets)
        const rect = spriteFor(sheet, ch, r)
        const rot = r.range(-7, 7)
        if (rect) return <SpriteLetter key={i} sheet={sheet} rect={rect} h={h * r.range(0.9, 1.1)} rot={rot} />
        return (
          <PaperLetter
            key={i}
            ch={ch}
            bg="#f7d3df"
            color="#141014"
            font={r.pick(RANSOM_FONTS)}
            rot={rot}
            clip={patchPolygon(r)}
          />
        )
      })}
    </span>
  )
}

/* ---------- per-song themes ----------
   Each theme turns one word into a React node. `ctx` gives the line's rng,
   the word index and whether this word is the line's "hero" word. */

const clean = (w) => w.replace(/[^a-z0-9']/gi, '')

function lettersFromSheet(word, sheet, r, fallback, h = 1.3) {
  return [...word].map((ch, i) => {
    const rect = /[a-z0-9]/i.test(ch) ? spriteFor(sheet, ch, r) : null
    const rot = r.range(-8, 8)
    if (rect) return <SpriteLetter key={i} sheet={sheet} rect={rect} h={h * r.range(0.9, 1.08)} rot={rot} />
    return fallback(ch, i, rot)
  })
}

/* Hello? — Clairo. Pink paper word boxes like the poster ("Hello..?",
   "like", "i'm", "into", "you?") + black-on-pink ransom letters. */
const hello = {
  rowChars: 15,
  scrap: { fill: 'halftone-pink', chance: 0.8 },
  stickers: ['✱', '✦'],
  stickerColor: '#ffffff',
  word(w, { r, hero }) {
    if (hero && clean(w).length <= 9) {
      return (
        <span className="cut-word">
          {lettersFromSheet(w, 'ransom', r, (ch, i, rot) => (
            <PaperLetter key={i} ch={ch} bg="#f6cbd8" color="#121012" font={r.pick(RANSOM_FONTS)} rot={rot} clip={patchPolygon(r)} />
          ), 1.35)}
        </span>
      )
    }
    const kind = r.pick(['paper', 'paper', 'hot', 'bold', 'paper', 'hot'])
    if (kind === 'bold')
      return <span className="hello-bold boil" style={{ '--r': `${r.range(-4, 4)}deg` }}>{w.toLowerCase()}</span>
    return (
      <span
        className={`hello-box ${kind} boil`}
        style={{ '--r': `${r.range(-5, 5)}deg`, clipPath: tornPolygon(r, 3, 4) }}
      >
        {w.toLowerCase()}
      </span>
    )
  },
}

/* the perfect pair — beabadoobee. Patterned alphabet squares (sheet 3) +
   illustrated drop caps (sheet 4), pink/yellow like the poster. */
const PAIR_BG = ['#f4b6cf', '#6e8f3c', '#1f6f8b', '#e8434d', '#f3ead8', '#c6d65e', '#2e4b2a', '#ec4f8f']
const PAIR_FG = { '#f4b6cf': '#2e4b2a', '#6e8f3c': '#f7e9ef', '#1f6f8b': '#f7e9ef', '#e8434d': '#fde3ec', '#f3ead8': '#e8434d', '#c6d65e': '#2e4b2a', '#2e4b2a': '#f4b6cf', '#ec4f8f': '#fff3c4' }
const PATTERNS = [
  'radial-gradient(circle, rgba(255,255,255,.38) 22%, transparent 24%) 0 0/.42em .42em',
  'repeating-linear-gradient(45deg, rgba(255,255,255,.28) 0 .1em, transparent .1em .26em)',
  'conic-gradient(rgba(255,255,255,.3) 25%, transparent 0 50%, rgba(255,255,255,.3) 0 75%, transparent 0) 0 0/.5em .5em',
  'repeating-linear-gradient(90deg, rgba(0,0,0,.12) 0 .12em, transparent .12em .3em)',
]
const pair = {
  rowChars: 16,
  scrap: { fill: 'pink-burst', chance: 0.7 },
  stickers: ['✦', '✦', '✧'],
  stickerColor: '#f5d33f',
  word(w, { r, hero, first }) {
    const letters = [...w]
    if (hero && clean(w).length <= 8) {
      return (
        <span className="cut-word">
          {lettersFromSheet(w, 'patterned', r, (ch, i, rot) => (
            <PaperLetter key={i} ch={ch} bg="#f4b6cf" color="#e8434d" font="'Shrikhand', serif" rot={rot} />
          ), 1.25)}
        </span>
      )
    }
    const bg = r.pick(PAIR_BG)
    let drop = null
    if (first) {
      const rect = spriteFor('illustrated', letters[0], r)
      if (rect) {
        drop = <SpriteLetter sheet="illustrated" rect={rect} h={1.7} rot={r.range(-6, 6)} />
        letters.shift()
      }
    }
    return (
      <span className="cut-word">
        {drop}
        {letters.length > 0 && (
          <span
            className="pair-tile boil"
            style={{
              background: `${r.pick(PATTERNS)}, ${bg}`,
              color: PAIR_FG[bg],
              fontFamily: r() < 0.6 ? "'Shrikhand', serif" : "'Fraunces', serif",
              '--r': `${r.range(-5, 5)}deg`,
            }}
          >
            {letters.join('').toLowerCase()}
          </span>
        )}
      </span>
    )
  },
}

/* Francis Forever — Mitski. Little white word labels scattered down the
   page, exactly like the ripple poster. */
const francis = {
  rowChars: 9,
  stagger: 'spread',
  scrap: null,
  stickers: [],
  word(w, { r }) {
    return (
      <span className="francis-label boil" style={{ '--r': `${r.range(-1.5, 1.5)}deg` }}>
        {w.toLowerCase()}
      </span>
    )
  },
}

/* Fade Into You — Mazzy Star. Purple paper letters (sheet 1, the purple one). */
const FADE_BG = ['#c9a3dc', '#9b6bbf', '#e8a7cf', '#7a4a9a', '#f4e7d6', '#d58ac0', '#b48ad6', '#5e3a7e']
const FADE_FG = ['#1b1020', '#4a2470', '#e05a9a', '#ffffff', '#f6e9d7']
const FADE_FONTS = ["'Playfair Display', serif", "'Abril Fatface', serif", "'DM Serif Display', serif", "'Fraunces', serif"]
const fade = {
  rowChars: 13,
  scrap: { fill: 'lilac-gingham', chance: 0.65 },
  stickers: ['✦', '✧'],
  stickerColor: '#f3e3ff',
  word(w, { r }) {
    return (
      <span className="cut-word">
        {lettersFromSheet(w, 'purple', r, (ch, i, rot) => {
          const bg = r.pick(FADE_BG)
          let fg = r.pick(FADE_FG)
          if (fg === bg) fg = '#1b1020'
          return (
            <PaperLetter
              key={i}
              ch={ch.toLowerCase()}
              bg={bg}
              color={fg}
              font={r.pick(FADE_FONTS)}
              rot={rot}
              clip={patchPolygon(r)}
              shadow={r() < 0.4 ? '0.05em 0.05em 0 #fff' : 'none'}
            />
          )
        }, 1.3)}
      </span>
    )
  },
}

/* Linger — The Cranberries. Torn white paper words in brown serif, like
   the "you know i'm such a fooool for you" poster. */
const linger = {
  rowChars: 12,
  scrap: { fill: 'notebook', chance: 0.45 },
  stickers: ['✦', '✶', '★'],
  stickerColor: '#d9b44a',
  word(w, { r }) {
    let t = w.toLowerCase()
    if (/^fool$/i.test(clean(w))) t = t.replace(/o+/, 'ooooo')
    return (
      <span
        className="linger-paper boil"
        style={{ '--r': `${r.range(-5, 5)}deg`, clipPath: tornPolygon(r, 7, 6) }}
      >
        {t}
      </span>
    )
  },
}

export const THEMES = { hello, pair, francis, fade, linger }
