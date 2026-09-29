// Turns public/illustrations/landscape/landscape1.svg into the landscape map's art.ts.
// Keeps every path exactly as drawn, marks the 33 people (head and body), traces the five zones
// along the drawn contour lines, and records which zone each shape sits in.
// Run: node scripts/landscape-art.mjs
import { chromium } from 'playwright'
import fs from 'node:fs'

const SRC = 'public/illustrations/landscape/landscape1.svg'
const OUT = 'src/app/(public)/foundations/[chapter]/components/landscape-map/art.ts'
const svg = fs.readFileSync(SRC, 'utf8').replace(/<\?xml[^>]*>/, '')

// Head and body of each person, by path index in the file. Matched one to one against the
// orange figures in landscape2.png (33 of 33).
const PEOPLE = [
  [80, 42],
  [86, 34],
  [87, 53],
  [89, 58],
  [93, 83],
  [94, 64],
  [95, 44],
  [97, 57],
  [98, 67],
  [99, 41],
  [100, 60],
  [101, 48],
  [103, 71],
  [104, 82],
  [105, 51],
  [107, 47],
  [108, 45],
  [109, 66],
  [110, 49],
  [111, 69],
  [112, 59],
  [113, 79],
  [114, 65],
  [115, 72],
  [117, 50],
  [118, 92],
  [119, 70],
  [120, 76],
  [121, 37],
  [102, 88],
  [106, 96],
  [116, 73],
  [68, 36],
]
// Contour lines that bound each zone (path indexes), and a centre to trace them from.
const ZONES = [
  { id: 'individual', lines: [7], centre: [259.6, 249.4] },
  { id: 'service', lines: [3], centre: [290, 255] },
  { id: 'organisation', lines: [2, 4, 14, 8], centre: [420, 265] },
  { id: 'community', lines: [1, 13, 11, 9], centre: [450, 275] },
]
// The table top, from the frame's corners.
const TABLE = 'M206 136 L800 122 L917 405 L40 407 Z'
const FRAME_LINES = [0, 5, 6, 10, 12, 16]
const POINTERS = ['individual', 'service', 'organisation', 'community', 'environment']
// The breaks each line passes through: pairs of line pieces (path indexes) that the drawing
// leaves apart so the line can cross. Closed with a bridge while the line is dormant.
const GAPS = {
  individual: [
    [10, 0],
    [1, 13],
    [2, 14],
    [3, 15],
  ],
  service: [
    [10, 5],
    [13, 11],
    [14, 8],
    [15, 3],
  ],
  organisation: [
    [5, 6],
    [11, 9],
    [8, 4],
  ],
  community: [
    [6, 12],
    [9, 1],
  ],
  environment: [[16, 0]],
}

const b = await chromium.launch()
const p = await b.newPage()
await p.setContent(`<body style="margin:0">${svg}</body>`)
const data = await p.evaluate(
  ({ ZONES, TABLE, GAPS, POINTERS }) => {
    const ps = [...document.querySelectorAll('path')]
    const pts = (i) => {
      const el = ps[i]
      const L = el.getTotalLength()
      const a = []
      for (let s = 0; s <= L; s += 0.5) {
        const q = el.getPointAtLength(s)
        a.push([q.x, q.y])
      }
      return a
    }
    // Furthest drawn point in each direction from the centre; gaps between lines are bridged.
    const trace = (ids, [cx, cy], N = 240) => {
      const R = new Array(N).fill(null)
      for (const i of ids)
        for (const [x, y] of pts(i)) {
          const k =
            ((Math.floor(((Math.atan2(y - cy, x - cx) + Math.PI) / (2 * Math.PI)) * N) % N) + N) % N
          const r = Math.hypot(x - cx, y - cy)
          if (R[k] === null || r > R[k]) R[k] = r
        }
      const has = R.map((v) => v !== null)
      const F = R.slice()
      for (let k = 0; k < N; k++)
        if (!has[k]) {
          let a = k,
            c = k,
            da = 0,
            dc = 0
          while (!has[a]) {
            a = (a - 1 + N) % N
            da++
          }
          while (!has[c]) {
            c = (c + 1) % N
            dc++
          }
          F[k] = R[a] + ((R[c] - R[a]) * da) / (da + dc)
        }
      const S = F.map((v, k) => (F[(k - 1 + N) % N] + 2 * v + F[(k + 1) % N]) / 4)
      return (
        'M' +
        S.map((r, k) => {
          const a = ((k + 0.5) / N) * 2 * Math.PI - Math.PI
          return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`
        }).join(' L') +
        ' Z'
      )
    }
    const outlines = Object.fromEntries(ZONES.map((z) => [z.id, trace(z.lines, z.centre)]))
    // The environment is the table top plus the full footprint of anything drawn standing on it
    // that rises past its edge (the office block and its tree), so a wash fills them evenly.
    {
      const S = 4
      const W = Math.ceil(953 * S)
      const H = Math.ceil(460 * S)
      const cv = document.createElement('canvas')
      cv.width = W
      cv.height = H
      const g = cv.getContext('2d')
      const table = new Path2D(TABLE)
      g.scale(S, S)
      g.fill(table)
      g.lineWidth = 1.5
      g.lineJoin = 'round'
      ps.forEach((el) => {
        if (el.closest('g[id]').id !== 'Layer_2') return
        const bb = el.getBBox()
        const corners = [
          [bb.x, bb.y],
          [bb.x + bb.width, bb.y],
          [bb.x, bb.y + bb.height],
          [bb.x + bb.width, bb.y + bb.height],
        ]
        if (corners.every(([x, y]) => g.isPointInPath(table, x * S, y * S))) return
        const shape = new Path2D(el.getAttribute('d'))
        g.fill(shape)
        g.stroke(shape)
      })
      const alpha = g.getImageData(0, 0, W, H).data
      // Everything the outside cannot reach is inside, so the buildings' hollows count too.
      const outside = new Uint8Array(W * H)
      const stack = [0]
      outside[0] = 1
      while (stack.length) {
        const k = stack.pop()
        const x = k % W
        const y = (k - x) / W
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const u = x + dx
          const v = y + dy
          if (u < 0 || v < 0 || u >= W || v >= H) continue
          const n = v * W + u
          if (!outside[n] && alpha[n * 4 + 3] < 128) {
            outside[n] = 1
            stack.push(n)
          }
        }
      }
      const inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H && !outside[y * W + x]
      // Trace the edge clockwise from its top-left pixel.
      let start = 0
      while (outside[start]) start++
      const DIRS = [
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1],
      ]
      let cur = [start % W, Math.floor(start / W)]
      const first = cur.slice()
      let d = 0
      const edge = []
      for (let steps = 0; steps < 200000; steps++) {
        edge.push(cur)
        let moved = false
        for (let k = 0; k < 8; k++) {
          const nd = (d + 6 + k) % 8
          const nx = cur[0] + DIRS[nd][0]
          const ny = cur[1] + DIRS[nd][1]
          if (inside(nx, ny)) {
            cur = [nx, ny]
            d = nd
            moved = true
            break
          }
        }
        if (!moved || (cur[0] === first[0] && cur[1] === first[1])) break
      }
      outlines.environment =
        'M' +
        edge
          .filter((_, i) => i % 3 === 0)
          .map(([x, y]) => `${(x / S).toFixed(1)} ${(y / S).toFixed(1)}`)
          .join(' L') +
        ' Z'
    }
    // Which zone a point is in: the innermost outline that contains it.
    const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    document.querySelector('svg').appendChild(probe)
    const order = ['individual', 'service', 'organisation', 'community', 'environment']
    const zoneAt = (x, y) => {
      const pt = document.querySelector('svg').createSVGPoint()
      pt.x = x
      pt.y = y
      for (const id of order) {
        probe.setAttribute('d', outlines[id])
        if (probe.isPointInFill(pt)) return id
      }
      return 'environment'
    }
    const shapes = ps.map((el) => {
      const bb = el.getBBox()
      return {
        d: el.getAttribute('d'),
        group: el.closest('g[id]').id,
        box: [bb.x, bb.y, bb.width, bb.height].map((v) => +v.toFixed(1)),
        zone: zoneAt(bb.x + bb.width / 2, bb.y + bb.height / 2),
      }
    })
    const ends = ps
      .filter((el) => el.closest('#Pointers'))
      .map((el) => {
        const a = pts(ps.indexOf(el))
        let top = a[0],
          end = a[0]
        for (const q of a) {
          if (q[1] < top[1]) top = q
          if (q[1] > end[1]) end = q
        }
        return { top: top.map((v) => +v.toFixed(1)), end: end.map((v) => +v.toFixed(1)) }
      })
    // Bridges: for each break, the nearest ends of its two pieces close to the line, each taken
    // a little inside its stroke, joined by a stroke as thick as the thinner piece.
    const cache = new Map()
    const P = (i) => cache.get(i) ?? (cache.set(i, pts(i)), cache.get(i))
    const thick = (i) => {
      const el = ps[i]
      const bb = el.getBBox()
      const S = 8
      const cv = document.createElement('canvas')
      cv.width = Math.ceil(bb.width * S) + 4
      cv.height = Math.ceil(bb.height * S) + 4
      const g = cv.getContext('2d')
      g.setTransform(S, 0, 0, S, -bb.x * S + 2, -bb.y * S + 2)
      g.fill(new Path2D(el.getAttribute('d')))
      const a = g.getImageData(0, 0, cv.width, cv.height).data
      let n = 0
      for (let k = 3; k < a.length; k += 4) n += a[k] / 255
      return n / (S * S) / (el.getTotalLength() / 2)
    }
    const pointerIdx = ps.map((el, i) => (el.closest('#Pointers') ? i : -1)).filter((i) => i >= 0)
    const bridges = []
    POINTERS.forEach((zone, n) => {
      const line = P(pointerIdx[n])
      const near = (q) => line.some(([x, y]) => Math.hypot(x - q[0], y - q[1]) < 18)
      for (const [A, B] of GAPS[zone]) {
        const ca = P(A).filter(near)
        const cb = P(B).filter(near)
        let best = null
        for (const a of ca)
          for (const b of cb) {
            const d = Math.hypot(a[0] - b[0], a[1] - b[1])
            if (!best || d < best.d) best = { a, b, d }
          }
        if (!best) {
          bridges.push({ zone, A, B, missing: true })
          continue
        }
        const tip = (i, q) => {
          const r = P(i).filter(([x, y]) => Math.hypot(x - q[0], y - q[1]) < 7)
          return [
            r.reduce((s, p) => s + p[0], 0) / r.length,
            r.reduce((s, p) => s + p[1], 0) / r.length,
          ]
        }
        const a = tip(A, best.a)
        const b = tip(B, best.b)
        bridges.push({
          zone,
          A,
          B,
          a: a.map((v) => +v.toFixed(1)),
          b: b.map((v) => +v.toFixed(1)),
          w: +Math.min(thick(A), thick(B)).toFixed(2),
          gap: +best.d.toFixed(1),
        })
      }
    })
    return { outlines, shapes, ends, bridges }
  },
  { ZONES, TABLE, GAPS, POINTERS },
)
await b.close()

const person = new Map(
  PEOPLE.flatMap(([h, bd], n) => [
    [h, n],
    [bd, n],
  ]),
)
const lineZone = new Map(ZONES.flatMap((z) => z.lines.map((i) => [i, z.id])))
FRAME_LINES.forEach((i) => lineZone.set(i, 'environment'))
// The short piece that closes the service's outline at its top left.
lineZone.set(15, 'service')

const art = []
const pointers = []
data.shapes.forEach((s, i) => {
  if (s.group === 'Pointers') {
    const n = pointers.length
    pointers.push({ zone: POINTERS[n], d: s.d, ...data.ends[n] })
    return
  }
  const kind = person.has(i)
    ? 'person'
    : lineZone.has(i)
      ? 'contour'
      : s.group === 'Base_frame'
        ? 'contour'
        : Math.max(s.box[2], s.box[3]) >= 15
          ? 'building'
          : 'detail'
  art.push({
    kind,
    d: s.d,
    box: s.box,
    zone: lineZone.get(i) ?? s.zone,
    ...(person.has(i) ? { person: person.get(i) } : {}),
  })
})

if (data.bridges.some((b) => b.missing))
  throw new Error('A break was not found: ' + JSON.stringify(data.bridges.filter((b) => b.missing)))
console.log(
  'breaks',
  data.bridges.map((b) => `${b.zone}:${b.A}-${b.B} gap ${b.gap} w ${b.w}`),
)
const bridges = data.bridges.map(({ zone, A, a, b, w }) => ({
  zone,
  edge: lineZone.get(A),
  a,
  b,
  w,
}))

const ts = `/* Generated by scripts/landscape-art.mjs from ${SRC}. Do not edit by hand. */

export type ZoneId = 'individual' | 'service' | 'organisation' | 'community' | 'environment'
export type ArtShape = {
  kind: 'contour' | 'building' | 'detail' | 'person'
  d: string
  /** x, y, width, height in the drawing's units. */
  box: [number, number, number, number]
  zone: ZoneId
  /** Which person (0 to 32) a head or body belongs to. */
  person?: number
}
export type Pointer = { zone: ZoneId; d: string; top: [number, number]; end: [number, number] }
export type Bridge = {
  zone: ZoneId
  edge: ZoneId
  a: [number, number]
  b: [number, number]
  /** Stroke width, in the drawing's units. */
  w: number
}

export const VIEWBOX = '0 0 953 595.2000122'
/** The ink the drawing uses, and the orange the people take in landscape2. */
export const INK = '#333'
export const PERSON = '#dc7038'

/** Each zone's full outline, traced along the drawn contour lines. Inner zones sit inside outer ones. */
export const OUTLINES: Record<ZoneId, string> = ${JSON.stringify(data.outlines, null, 2)}

export const ART: ArtShape[] = ${JSON.stringify(art)}

export const POINTERS: Pointer[] = ${JSON.stringify(pointers)}

/** Where each line crosses a break in the drawing: a bridge from one piece's end to the other's, closed while the line is dormant. \`zone\` is the line's; \`edge\` is the zone whose edge the pieces draw. */
export const BRIDGES: Bridge[] = ${JSON.stringify(bridges)}
`
fs.writeFileSync(OUT, ts)
console.log(
  `${art.length} shapes, ${art.filter((a) => a.kind === 'person').length} person parts, ${pointers.length} pointers ->`,
  OUT,
)
console.log(
  'people by zone',
  Object.entries(
    art
      .filter((a) => a.kind === 'person')
      .reduce((m, a) => ((m[a.zone] = (m[a.zone] || 0) + 1), m), {}),
  ),
)
