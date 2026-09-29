// Chooses which object a pointer position refers to, using each object's
// on-screen rectangle, its drawn shape, and a generous margin for small things.

export interface PickCandidate {
  id: string
  /** Screen rectangle in CSS pixels. */
  rect: { x0: number; y0: number; x1: number; y1: number }
  /** Distance from the camera; nearer wins ties. */
  depth: number
  /** Extra reach in pixels around the rectangle (bigger for small objects). */
  reach: number
  /** True if the drawing is solid at this point in the rectangle (0..1 each way). */
  solidAt?: (u: number, v: number) => boolean
}

export function pick(px: number, py: number, items: PickCandidate[]): string | null {
  let best: string | null = null
  let bestScore = Infinity
  let bestDepth = Infinity
  for (const it of items) {
    const { x0, y0, x1, y1 } = it.rect
    const dx = Math.max(x0 - px, 0, px - x1)
    const dy = Math.max(y0 - py, 0, py - y1)
    const outside = Math.hypot(dx, dy)
    if (outside > it.reach) continue
    let score: number
    if (outside === 0) {
      const solid = it.solidAt ? it.solidAt((px - x0) / (x1 - x0), (py - y0) / (y1 - y0)) : true
      // Inside the rectangle but on empty paper: a weak hit, so nearby objects can still win.
      score = solid ? 0 : Math.min(it.reach, 6)
    } else score = outside
    if (score < bestScore - 0.01 || (Math.abs(score - bestScore) <= 0.01 && it.depth < bestDepth)) {
      best = it.id
      bestScore = score
      bestDepth = it.depth
    }
  }
  return best
}

/** Pointer movement beyond this many pixels counts as a drag, not a click. */
export const DRAG_THRESHOLD = 6

export function isDrag(dx: number, dy: number): boolean {
  return Math.hypot(dx, dy) > DRAG_THRESHOLD
}
