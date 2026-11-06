import { memo } from 'react'
import { rng } from '../lib/rng'

const B = import.meta.env.BASE_URL
const SETS = {
  // blue doodles for Francis Forever
  francis: ['fb-confetti', 'fb-star-trail', 'fb-spiral', 'fb-stars', 'fb-pale-stars', 'fb-clef-cloud'],
  // pink elements, shared by Hello? and the perfect pair
  hello: ['pk-stars', 'pk-rays', 'pk-sparkle', 'pk-flourish', 'pk-notes'],
  pair: ['pk-stars', 'pk-rays', 'pk-sparkle', 'pk-flourish', 'pk-notes'],
  // black & white doodles for Linger (ink lightened so it reads on the dark cover)
  linger: ['li-constellation', 'li-sheet-music', 'li-star-yellow', 'li-notes', 'li-flourish', 'li-star-wizard'],
}

// Spots on the sides / between the lyric areas, in % of the screen.
const SPOTS = {
  francis: {
    desk: [[33, 14], [67, 20], [33, 60], [67, 66], [52, 88], [84, 88], [95, 10], [33, 90]],
    phone: [[12, 7], [88, 9], [10, 50], [90, 48]],
  },
  hello: {
    desk: [[29, 12], [92, 12], [94, 54], [91, 88], [40, 92], [64, 6]],
    phone: [[12, 7], [88, 9], [10, 50], [90, 48]],
  },
  pair: {
    desk: [[29, 12], [92, 12], [94, 54], [91, 88], [40, 92], [64, 6]],
    phone: [[12, 7], [88, 9], [10, 50], [90, 48]],
  },
  linger: {
    desk: [[31, 13], [90, 14], [93, 52], [90, 86], [42, 90], [64, 8], [30, 86]],
    phone: [[12, 7], [88, 9], [10, 50], [90, 48]],
  },
}

/* A few doodles stuck on around the lyrics. They change with each lyric
   line and pop in with the same stop-motion feel as the cut-outs. */
const Doodles = memo(function Doodles({ theme, line, mobile }) {
  const set = SETS[theme]
  if (!set) return null
  // Francis: only in the middle of the song, a couple at a time, changing
  // every few lines instead of every line
  // Francis: only mid-song, changing every few lines.
  // Hello / the perfect pair: two pink pieces, changing every two lines.
  const calm = theme !== 'linger'
  if (theme === 'francis' && (line < 5 || line > 10)) return null
  const key = theme === 'francis' ? Math.floor((line - 5) / 3) : calm ? Math.floor(line / 2) : line
  const r = rng(`${theme}:doodles:${key}`)
  const spots = [...SPOTS[theme][mobile ? 'phone' : 'desk']]
  const n = calm ? (mobile ? 1 : 2) : mobile ? 2 : r.int(3, 4)
  const pool = [...set]
  const items = []
  for (let k = 0; k < n && spots.length && pool.length; k++) {
    const [x, y] = spots.splice(Math.floor(r() * spots.length), 1)[0]
    const name = pool.splice(Math.floor(r() * pool.length), 1)[0]
    items.push(
      <span
        key={`${key}-${k}`}
        className="doodle"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          height: mobile ? '9vh' : `${r.range(calm ? 11 : 13, calm ? 16 : 19)}vh`,
          '--r': `${r.range(-14, 14)}deg`,
          animationDelay: `${0.15 + k * 0.18}s`,
        }}
      >
        <img src={`${B}doodles/${name}.png`} alt="" className="boil" style={{ '--r': `${r.range(-3, 3)}deg` }} />
      </span>,
    )
  }
  return <div className={`doodles doodles-${theme}`} aria-hidden="true">{items}</div>
})

export default Doodles
