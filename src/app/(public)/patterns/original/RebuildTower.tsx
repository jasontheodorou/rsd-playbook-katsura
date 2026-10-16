// Copied from the-rsd-playbook src/components/RebuildTower.tsx for the pattern library's record of the original build.
'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import './RebuildTower.css'

type BrickColor = 'orange' | 'red' | 'yellow' | 'cream' | 'grey'

type FixedBrick = { id: string; color: BrickColor; studs: number; x: number; layer: number }

type Spec = {
  id: string
  title: string
  summary: string
  why: string[]
  tip: string
  color: BrickColor
  studs: number
  slot: number
  targetX: number
  targetLayer: number
}

type LooseState =
  | { id: string; mode: 'scatter' }
  | { id: string; mode: 'grid'; x: number; layer: number }

type DragInfo = {
  id: string
  pointerId: number
  startCX: number
  startCY: number
  startX: number
  startY: number
}

const STUD = 28
const H = 46
const LEFT = 56
const FLOOR = 480

const FIXED: FixedBrick[] = [
  { id: 'f1', color: 'grey', studs: 7, x: 2, layer: 0 },
  { id: 'f2', color: 'cream', studs: 6, x: 3, layer: 1 },
  { id: 'f3', color: 'yellow', studs: 5, x: 3, layer: 2 },
  { id: 'f4', color: 'red', studs: 6, x: 2, layer: 3 },
  { id: 'f5', color: 'orange', studs: 5, x: 3, layer: 4 },
]

const SPECS: Spec[] = [
  {
    id: 'accessibility',
    title: 'Accessibility',
    summary: 'Design so more people can use it.',
    why: ['Removes barriers', 'Makes patterns more robust', 'Improves the whole experience'],
    tip: 'Accessibility is a quality of the system, not a final check.',
    color: 'cream', studs: 5, slot: 0, targetX: 3, targetLayer: 5,
  },
  {
    id: 'navigation',
    title: 'Navigation',
    summary: 'Help people know where they are.',
    why: ['Supports orientation', 'Makes complex journeys easier', 'Builds confidence'],
    tip: 'People should never have to guess what happens next.',
    color: 'orange', studs: 6, slot: 1, targetX: 2, targetLayer: 6,
  },
  {
    id: 'feedback',
    title: 'Feedback',
    summary: 'Show people what just happened.',
    why: ['Confirms actions', 'Prevents uncertainty', 'Makes systems feel responsive'],
    tip: 'Small moments of feedback can carry a lot of trust.',
    color: 'yellow', studs: 4, slot: 2, targetX: 3, targetLayer: 7,
  },
  {
    id: 'motion',
    title: 'Motion',
    summary: 'Use movement to explain change.',
    why: ['Clarifies relationships', 'Directs attention', 'Adds character without clutter'],
    tip: 'Motion should explain first and delight second.',
    color: 'red', studs: 4, slot: 3, targetX: 3, targetLayer: 8,
  },
]

function specById(id: string): Spec {
  const s = SPECS.find(b => b.id === id)
  if (!s) throw new Error(`Unknown spec id: ${id}`)
  return s
}

function brickWidth(studs: number): number {
  return studs * STUD - 3
}

function overlap(ax: number, aw: number, bx: number, bw: number): number {
  return Math.max(0, Math.min(ax + aw, bx + bw) - Math.max(ax, bx))
}

function floorY(sceneHeight: number): number {
  return Math.min(FLOOR, sceneHeight - 60)
}

function maxGrid(sceneWidth: number): number {
  return Math.max(16, Math.floor((Math.max(560, sceneWidth) - LEFT - 24) / STUD))
}

function scatterPos(spec: Spec, sceneWidth: number, sceneHeight: number): { x: number; y: number } {
  const width = brickWidth(spec.studs)
  const pad = Math.max(18, Math.min(40, sceneWidth * 0.035))
  const right = sceneWidth - pad
  const fy = floorY(sceneHeight)
  const gap = 18
  if (sceneWidth >= 1000) {
    const widths = [5, 6, 4, 4].map(s => brickWidth(s))
    const total = widths.reduce((a, c) => a + c, 0) + gap * 3
    const start = right - total
    const offsets = [
      0,
      widths[0] + gap,
      widths[0] + widths[1] + gap * 2,
      widths[0] + widths[1] + widths[2] + gap * 3,
    ]
    return { x: Math.min(right - width, start + offsets[spec.slot]), y: fy - H }
  }
  const zw = Math.min(sceneWidth * 0.58, 390)
  const zl = Math.max(sceneWidth * 0.39, right - zw)
  const col = spec.slot % 2
  const row = Math.floor(spec.slot / 2)
  const cell = zw / 2
  const x = zl + col * cell + (cell - width) / 2
  // Stack rows exactly one brick height so the upper row sits on top of the
  // lower row like a small pile — no visual "hanging" bricks.
  const y = fy - H - row * H
  return { x: Math.max(pad, Math.min(right - width, x)), y }
}

function pos(state: LooseState, sceneWidth: number, sceneHeight: number): { x: number; y: number } {
  if (state.mode === 'scatter') return scatterPos(specById(state.id), sceneWidth, sceneHeight)
  return { x: LEFT + state.x * STUD, y: floorY(sceneHeight) - (state.layer + 1) * H }
}

function gridStates(world: LooseState[]): Array<Extract<LooseState, { mode: 'grid' }>> {
  return world.filter((s): s is Extract<LooseState, { mode: 'grid' }> => s.mode === 'grid')
}

function collides(id: string, x: number, layer: number, world: LooseState[]): boolean {
  const w = specById(id).studs
  if (FIXED.some(b => b.layer === layer && overlap(x, w, b.x, b.studs) > 0)) return true
  return gridStates(world).some(b => b.id !== id && b.layer === layer && overlap(x, w, b.x, specById(b.id).studs) > 0)
}

function supported(id: string, x: number, layer: number, world: LooseState[]): boolean {
  if (layer === 0) return true
  const w = specById(id).studs
  if (FIXED.some(b => b.layer === layer - 1 && overlap(x, w, b.x, b.studs) >= 1)) return true
  return gridStates(world).some(b => b.id !== id && b.layer === layer - 1 && overlap(x, w, b.x, specById(b.id).studs) >= 1)
}

function settle(world: LooseState[]): LooseState[] {
  const scatter = world.filter(s => s.mode === 'scatter')
  const grid = gridStates(world).map(s => ({ ...s }))
  for (let pass = 0; pass < SPECS.length + 3; pass++) {
    let changed = false
    grid.sort((a, b) => a.layer - b.layer)
    for (const b of grid) {
      let nl = b.layer
      while (nl > 0) {
        const combined: LooseState[] = [...scatter, ...grid]
        if (supported(b.id, b.x, nl, combined)) break
        const next = nl - 1
        if (collides(b.id, b.x, next, combined)) break
        nl = next
      }
      if (nl !== b.layer) {
        b.layer = nl
        changed = true
      }
    }
    if (!changed) break
  }
  return [...scatter, ...grid]
}

function bestSnap(id: string, dx: number, dl: number, world: LooseState[], sceneWidth: number): { x: number; layer: number } {
  const b = specById(id)
  const max = maxGrid(sceneWidth)
  const clampX = (v: number) => Math.max(0, Math.min(max - b.studs, v))
  const candidates: Array<{ x: number; layer: number; score: number }> = []
  for (let off = -2; off <= 2; off++) {
    const x = clampX(dx + off)
    for (let lo = -1; lo <= 1; lo++) {
      const layer = Math.max(0, dl + lo)
      if (collides(id, x, layer, world) || !supported(id, x, layer, world)) continue
      candidates.push({ x, layer, score: Math.abs(off) * 1.1 + Math.abs(lo) * 2.1 })
    }
    if (!collides(id, x, 0, world)) {
      candidates.push({ x, layer: 0, score: 8 + Math.abs(off) + dl * 2.4 })
    }
  }
  candidates.sort((a, b) => a.score - b.score)
  return candidates[0] ?? { x: clampX(dx), layer: 0 }
}

// Any valid stacking of all four loose bricks on top of the foundation
// (layer >= 5) counts as complete. Deliberately forgiving so the celebration
// fires whenever a learner has meaningfully built the tower, not only when
// they hit an exact puzzle solution.
function isComplete(world: LooseState[]): boolean {
  return SPECS.every(b => {
    const s = world.find(x => x.id === b.id)
    return s?.mode === 'grid' && s.layer >= 5
  })
}

export function RebuildTower() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 680, h: 560 })
  const [loose, setLoose] = useState<LooseState[]>(() => SPECS.map(b => ({ id: b.id, mode: 'scatter' })))
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const [hintSpec, setHintSpec] = useState<Spec | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const [haloTrigger, setHaloTrigger] = useState(0)
  const [snap, setSnap] = useState<{ x: number; y: number; w: number } | null>(null)

  const dragInfoRef = useRef<DragInfo | null>(null)
  const sizeRef = useRef(size)
  const looseRef = useRef(loose)
  const successTimer = useRef<number | null>(null)
  const celebrateTimer = useRef<number | null>(null)

  useEffect(() => { sizeRef.current = size }, [size])
  useEffect(() => { looseRef.current = loose }, [loose])

  useEffect(() => {
    const el = sceneRef.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- copied unchanged from the original build
    setLoose(prev => {
      const max = maxGrid(size.w)
      return prev.map(s =>
        s.mode === 'scatter' ? s : { ...s, x: Math.max(0, Math.min(max - specById(s.id).studs, s.x)) }
      )
    })
  }, [size.w])

  useEffect(() => () => {
    if (successTimer.current) window.clearTimeout(successTimer.current)
    if (celebrateTimer.current) window.clearTimeout(celebrateTimer.current)
  }, [])

  // Window-level pointer handlers — installed only while a drag is active.
  useEffect(() => {
    if (!dragId) return

    function onMove(e: PointerEvent) {
      const info = dragInfoRef.current
      if (!info || e.pointerId !== info.pointerId) return
      const sc = sizeRef.current
      const b = specById(info.id)
      const w = brickWidth(b.studs)
      const newX = Math.max(8, Math.min(sc.w - w - 8, info.startX + (e.clientX - info.startCX)))
      const newY = Math.max(8, Math.min(sc.h - H - 8, info.startY + (e.clientY - info.startCY)))
      setDragPos({ x: newX, y: newY })
      const dx = Math.round((newX - LEFT) / STUD)
      const dl = Math.max(0, Math.round((floorY(sc.h) - newY) / H) - 1)
      const world = looseRef.current.filter(x => x.id !== info.id)
      const p = bestSnap(info.id, dx, dl, world, sc.w)
      setSnap({
        x: LEFT + p.x * STUD,
        y: floorY(sc.h) - (p.layer + 1) * H,
        w,
      })
    }

    function onUp(e: PointerEvent) {
      const info = dragInfoRef.current
      if (!info || e.pointerId !== info.pointerId) return
      const sc = sizeRef.current
      const b = specById(info.id)
      const w = brickWidth(b.studs)
      const rawX = info.startX + (e.clientX - info.startCX)
      const rawY = info.startY + (e.clientY - info.startCY)
      const finalX = Math.max(8, Math.min(sc.w - w - 8, rawX))
      const finalY = Math.max(8, Math.min(sc.h - H - 8, rawY))
      const dx = Math.round((finalX - LEFT) / STUD)
      const dl = Math.max(0, Math.round((floorY(sc.h) - finalY) / H) - 1)
      const without = looseRef.current.filter(x => x.id !== info.id)
      const p = bestSnap(info.id, dx, dl, without, sc.w)
      const nextWorld = settle([...without, { id: info.id, mode: 'grid', x: p.x, layer: p.layer }])

      // Settle the world now, but keep the drag visual for one frame so the
      // brick can smoothly transition from its drag position to its settled
      // position. Without this two-frame sequence, browsers may skip the CSS
      // transition because the "dragging" class removed it.
      setLoose(nextWorld)
      setSnap(null)
      requestAnimationFrame(() => {
        dragInfoRef.current = null
        setDragId(null)
        setDragPos(null)
      })

      if (isComplete(nextWorld)) {
        setCelebrating(true)
        setHaloTrigger(v => v + 1)
        if (celebrateTimer.current) window.clearTimeout(celebrateTimer.current)
        celebrateTimer.current = window.setTimeout(() => setCelebrating(false), 1600)
        // Success message appears once the brick has landed and the pulse
        // cascade has begun.
        if (successTimer.current) window.clearTimeout(successTimer.current)
        successTimer.current = window.setTimeout(() => {
          setShowSuccess(true)
          successTimer.current = window.setTimeout(() => setShowSuccess(false), 2600)
        }, 500)
      }
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [dragId])

  const handlePointerDown = useCallback((e: ReactPointerEvent<HTMLButtonElement>, id: string) => {
    if (e.button !== undefined && e.button !== 0) return
    e.preventDefault()
    const state = looseRef.current.find(s => s.id === id)
    if (!state) return
    const p = pos(state, sizeRef.current.w, sizeRef.current.h)
    dragInfoRef.current = {
      id,
      pointerId: e.pointerId,
      startCX: e.clientX,
      startCY: e.clientY,
      startX: p.x,
      startY: p.y,
    }
    setHintSpec(specById(id))
    setDragId(id)
    setDragPos({ x: p.x, y: p.y })
  }, [])

  const handleReset = useCallback(() => {
    dragInfoRef.current = null
    setLoose(SPECS.map(b => ({ id: b.id, mode: 'scatter' })))
    setDragId(null)
    setDragPos(null)
    setSnap(null)
    setShowSuccess(false)
    setCelebrating(false)
  }, [])

  const renderStuds = (n: number) => (
    <span className="rebuild-tower__studs">
      {Array.from({ length: n }, (_, i) => <i key={i} />)}
    </span>
  )

  return (
    <div className="rebuild-tower" data-celebrating={celebrating}>
      <div className="rebuild-tower__scene" ref={sceneRef}>
        <div className="rebuild-tower__floor" />

        {snap && (
          <div
            className="rebuild-tower__snap rebuild-tower__snap--show"
            style={{ left: snap.x, top: snap.y, width: snap.w }}
          />
        )}

        <button className="rebuild-tower__reset" type="button" onClick={handleReset}>
          ↻ Reset
        </button>

        {FIXED.map(b => {
          const x = LEFT + b.x * STUD
          const y = floorY(size.h) - (b.layer + 1) * H
          return (
            <div
              key={b.id}
              className={`rebuild-tower__brick rebuild-tower__brick--fixed rebuild-tower__brick--${b.color}`}
              style={{
                width: brickWidth(b.studs),
                left: x,
                top: y,
                zIndex: 10 + b.layer,
                ['--rt-layer' as string]: b.layer,
              }}
            >
              {renderStuds(b.studs)}
            </div>
          )
        })}

        {loose.map(s => {
          const b = specById(s.id)
          const isDragging = dragId === s.id
          const p = isDragging && dragPos ? dragPos : pos(s, size.w, size.h)
          const layerZ = isDragging ? 100 : s.mode === 'grid' ? s.layer : 0
          const cascadeLayer = s.mode === 'grid' ? s.layer : 9 + b.slot
          return (
            <button
              key={s.id}
              type="button"
              className={`rebuild-tower__brick rebuild-tower__brick--loose rebuild-tower__brick--${b.color} ${isDragging ? 'rebuild-tower__brick--dragging' : ''}`}
              style={{
                width: brickWidth(b.studs),
                left: p.x,
                top: p.y,
                zIndex: 40 + layerZ,
                ['--rt-layer' as string]: cascadeLayer,
              }}
              onPointerDown={e => handlePointerDown(e, b.id)}
              aria-label={b.title}
            >
              {renderStuds(b.studs)}
            </button>
          )
        })}

        {/* Elegant fade-in FYI — richer content, still no chrome. */}
        <div className={`rebuild-tower__hint ${dragId ? 'rebuild-tower__hint--show' : ''}`}>
          {hintSpec && (
            <>
              <p className="rebuild-tower__hint-title">{hintSpec.title}</p>
              <p className="rebuild-tower__hint-summary">{hintSpec.summary}</p>
              <p className="rebuild-tower__hint-sub">Why it matters</p>
              <ul className="rebuild-tower__hint-why">
                {hintSpec.why.map((line, i) => <li key={i}>{line}</li>)}
              </ul>
              <div className="rebuild-tower__hint-tip">
                <strong>Design note</strong>
                <span>{hintSpec.tip}</span>
              </div>
            </>
          )}
        </div>

        <div className={`rebuild-tower__success ${showSuccess ? 'rebuild-tower__success--show' : ''}`}>
          <p className="rebuild-tower__success-title">Complete <span aria-hidden="true">✦</span></p>
          <p className="rebuild-tower__success-summary">Good design makes everything better.</p>
        </div>

        <div
          key={haloTrigger}
          className={`rebuild-tower__halo ${haloTrigger > 0 ? 'rebuild-tower__halo--go' : ''}`}
        />

        {/* Sparkle bursts fire only during the celebration. */}
        <div className={`rebuild-tower__sparkles ${celebrating ? 'rebuild-tower__sparkles--go' : ''}`} aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => <span key={i} style={{ ['--i' as string]: i }} />)}
        </div>
      </div>
    </div>
  )
}
