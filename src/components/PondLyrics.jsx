import { memo } from 'react'
import slotsData from '../data/francisSlots.json'
import { rng } from '../lib/rng'

/*
  Francis Forever, landscape: the ripple artwork is mirrored into three
  ponds (left mirrored | original | right mirrored). The poster's own word
  labels were erased; the current lyric is laid out in the same diagonal
  label pattern in all three ponds.
*/
const { w: PW, h: PH, slots } = slotsData

// pick n slots spread evenly through the poster's reading order
function pickSlots(n) {
  if (n >= slots.length) return slots.map((_, i) => i)
  if (n === 1) return [0]
  return Array.from({ length: n }, (_, k) => Math.round((k * (slots.length - 1)) / (n - 1)))
}

// merge words when a line has more words than label slots
function fitWords(words) {
  const out = [...words]
  while (out.length > slots.length) {
    let bi = 0
    let bl = Infinity
    for (let i = 0; i < out.length - 1; i++) {
      const l = out[i].length + out[i + 1].length
      if (l < bl) {
        bl = l
        bi = i
      }
    }
    out.splice(bi, 2, `${out[bi]} ${out[bi + 1]}`)
  }
  return out
}

function place(panel, slot) {
  const [x0, y0, x1, y1] = slots[slot]
  const mirrored = panel !== 1
  const px = mirrored ? PW - x1 : x0
  let x = ((panel * PW + px) / (PW * 3)) * 100
  let y = (y0 / PH) * 100
  // the left pond sits under the record + controls, so lift its labels
  if (panel === 0) y = 4 + y * 0.6
  return { x, y }
}

const PondLine = memo(function PondLine({ line, idx, leaving }) {
  const r = rng(`francis-pond:${idx}`)
  const words = fitWords(line.text.toLowerCase().split(/\s+/).filter(Boolean))
  const picks = pickSlots(words.length)
  const dur = Math.max(1.2, line.end - line.t)
  const step = Math.min(0.6, (dur * 0.7) / words.length)

  return (
    <div className={`pond-line${leaving ? ' leaving' : ''}`}>
      {[0, 1, 2].map((panel) =>
        words.map((w, k) => {
          const { x, y } = place(panel, picks[k])
          return (
            <span
              key={`${panel}-${k}`}
              className="pop pond-pos"
              style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${k * step + panel * 0.07}s` }}
            >
              <span className="francis-label boil" style={{ '--r': `${r.range(-1.2, 1.2)}deg` }}>
                {w}
              </span>
            </span>
          )
        }),
      )}
    </div>
  )
})

export default PondLine
