// Small deterministic RNG so each lyric line always gets the same collage.
export function hash(str) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

export function rng(seed) {
  let a = typeof seed === 'string' ? hash(seed) : seed >>> 0
  const next = () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  next.range = (lo, hi) => lo + next() * (hi - lo)
  next.pick = (arr) => arr[Math.floor(next() * arr.length)]
  next.int = (lo, hi) => Math.floor(lo + next() * (hi - lo + 1))
  return next
}

// Irregular "cut with scissors" polygon (percent coords) for clip-path.
export function tornPolygon(r, jag = 6, steps = 7) {
  const pts = []
  const j = () => r.range(0, jag)
  for (let i = 0; i <= steps; i++) pts.push([(i / steps) * 100, j()])
  for (let i = 1; i < 3; i++) pts.push([100 - j(), (i / 3) * 100])
  for (let i = steps; i >= 0; i--) pts.push([(i / steps) * 100, 100 - j()])
  for (let i = 2; i > 0; i--) pts.push([j(), (i / 3) * 100])
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}% ${y.toFixed(1)}%`).join(',')})`
}

// Few-sided scissor cut, like the letter patches on the alphabet sheets.
export function patchPolygon(r) {
  const c = () => r.range(0, 12)
  return `polygon(${c()}% ${c()}%, ${100 - c()}% ${c()}%, ${100 - c()}% ${50 + r.range(-8, 8)}%, ${100 - c()}% ${100 - c()}%, ${c()}% ${100 - c()}%)`
}

// Jagged starburst / blob for the paper scraps behind a lyric line.
export function burstPolygon(r, spikes = 14, inner = 0.72) {
  const pts = []
  const n = spikes * 2
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const rad = (i % 2 ? inner : 1) * r.range(0.86, 1)
    pts.push([50 + Math.cos(a) * 50 * rad, 50 + Math.sin(a) * 50 * rad])
  }
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}% ${y.toFixed(1)}%`).join(',')})`
}
