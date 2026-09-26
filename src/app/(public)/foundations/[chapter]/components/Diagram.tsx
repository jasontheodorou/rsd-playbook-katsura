'use client'

import {
  ArrowsClockwise,
  Gauge,
  Plant,
  ShieldCheck,
  Umbrella,
  type Icon,
} from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'

import './diagram.css'

/**
 * The diagram: a centre idea with five items around it as tiles with Phosphor icons and short
 * labels. Three looks: colour (each item's tint), minimal (paper and ink) and refined (the gold
 * standard for Foundations pages; see docs/DESIGN-RULES.md, "Refined pattern standard"). Curved connectors join each to the centre; choosing a
 * benefit draws its connector in ink, lifts its tile and opens its passage in the panel beside.
 * The tiles are real buttons laid over an SVG of the connectors. Arrow keys move between them.
 * Without JavaScript it is a tinted list with the same icons and every passage.
 */

/** The Phosphor icons a diagram item can use, by name. Add names here as chapters need them. */
export const DIAGRAM_ICONS = {
  plant: Plant,
  gauge: Gauge,
  shieldCheck: ShieldCheck,
  arrowsClockwise: ArrowsClockwise,
  umbrella: Umbrella,
} satisfies Record<string, Icon>

export type DiagramItem = {
  id: string
  /** A short label under the tile, one or two words. */
  label: string
  /** The item's bold lead-in, shown as the panel heading. */
  lead: string
  body: string
  icon: keyof typeof DIAGRAM_ICONS
  /** Tints for the colour look only. */
  tone?: string
  deep?: string
}
type Benefit = DiagramItem

/** Node centres, as percentages of the square stage: a pentagon around the centre. */
const POS = [
  { x: 50, y: 15 },
  { x: 84, y: 40 },
  { x: 71, y: 81 },
  { x: 29, y: 81 },
  { x: 16, y: 40 },
]
const HUB = { x: 50, y: 50 }

/**
 * A gentle curve from the hub to a node, bowing clockwise, in a 100-unit viewBox. Both ends stop
 * short, at the edge of the centre pill and of the tile, so no line runs under a frosted surface
 * or through a label.
 */
type Half = { x: number; y: number }
const CLEAR = 1.8
/** Distance from a box's centre to its edge along a unit direction, plus clear space. */
const toEdge = (half: Half, ux: number, uy: number) =>
  Math.min(
    Math.abs(ux) > 1e-6 ? half.x / Math.abs(ux) : Infinity,
    Math.abs(uy) > 1e-6 ? half.y / Math.abs(uy) : Infinity,
  ) + CLEAR
/**
 * A gentle curve from the hub to a node, bowing clockwise, in a 100-unit viewBox. Both ends stop at
 * the measured edge of the centre pill and of the tile, plus clear space, so no line runs under a
 * surface or through a label at any width.
 */
const curve = (p: { x: number; y: number }, hubHalf: Half, tileHalf: Half) => {
  const mx = (HUB.x + p.x) / 2
  const my = (HUB.y + p.y) / 2
  const dx = p.x - HUB.x
  const dy = p.y - HUB.y
  const cx = mx - dy * 0.18
  const cy = my + dx * 0.18
  const along = (from: { x: number; y: number }, half: Half) => {
    const vx = cx - from.x
    const vy = cy - from.y
    const len = Math.hypot(vx, vy)
    const ux = vx / len
    const uy = vy / len
    const d = toEdge(half, ux, uy)
    return { x: from.x + ux * d, y: from.y + uy * d }
  }
  const a = along(HUB, hubHalf)
  const b = along(p, tileHalf)
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`
}

const noop = () => () => {}
const useEnhanced = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const tone = (b: Benefit) => ({ '--tone': b.tone, '--deep': b.deep }) as CSSProperties
const n = (i: number) => String(i + 1).padStart(2, '0')

export type DiagramLook = 'colour' | 'minimal' | 'refined'

export function Diagram({
  hub = 'Good design',
  label = 'What good design does',
  emptyTitle = 'Five things good design does',
  emptyBody = 'Choose one on the diagram to find out how.',
  washes,
  items,
  look = 'colour',
}: {
  hub?: string
  label?: string
  /** What the panel says before anything is chosen: a title, then what to do. */
  emptyTitle?: string
  emptyBody?: string
  /** Refined look: the two ambient wash colours. They pick up the chapter's own colour. */
  washes?: [string, string]
  items: Benefit[]
  /** colour: each benefit's tint. minimal: paper and ink. refined: frosted surfaces, soft washes, a slate accent. */
  look?: DiagramLook
}) {
  const minimal = look !== 'colour'
  const enhanced = useEnhanced()
  const reduce = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)
  const [seen, setSeen] = useState<number[]>([])
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const square = useRef<HTMLDivElement>(null)
  const [halves, setHalves] = useState<{ hub: Half; tile: Half }>({
    hub: { x: 11.5, y: 4.5 },
    tile: { x: 7.5, y: 7.5 },
  })

  // Measure the centre pill and a tile against the stage, so line ends track their real edges.
  useLayoutEffect(() => {
    const el = square.current
    if (!el) return
    // Layout sizes (offsetWidth), not rendered boxes: the tiles scale in on entry, and a
    // mid-animation measure would read them too small.
    const measure = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      const hub = el.querySelector<HTMLElement>('.bd__hub')
      const tile = el.querySelector<HTMLElement>('.bd__tile')
      if (!w || !hub || !tile) return
      setHalves({
        hub: { x: (hub.offsetWidth / 2 / w) * 100, y: (hub.offsetHeight / 2 / h) * 100 },
        tile: { x: (tile.offsetWidth / 2 / w) * 100, y: (tile.offsetHeight / 2 / h) * 100 },
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [enhanced])

  if (!enhanced) {
    return (
      <ol className="bd-static">
        {items.map((b) => {
          const I = DIAGRAM_ICONS[b.icon]
          return (
            <li key={b.id} className="bd-static__item" style={tone(b)}>
              <I size={36} weight="duotone" aria-hidden="true" />
              <p>
                <strong>{b.lead}</strong> {b.body}
              </p>
            </li>
          )
        })}
      </ol>
    )
  }

  const choose = (i: number) => {
    setActive(i)
    setSeen((s) => (s.includes(i) ? s : [...s, i]))
  }
  const onKey = (e: KeyboardEvent, i: number) => {
    const last = items.length - 1
    let next: number | null = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = i === last ? 0 : i + 1
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = i === 0 ? last : i - 1
    if (next === null) return
    e.preventDefault()
    buttons.current[next]?.focus()
  }

  const b = active === null ? null : items[active]
  const ActiveIcon = b ? DIAGRAM_ICONS[b.icon] : null

  return (
    <div
      className={`bd${minimal ? ' bd--minimal' : ''}${look === 'refined' ? ' bd--refined' : ''}`}
    >
      <div className="bd__stage">
        {look === 'refined' && (
          <span
            className="bd__washes"
            aria-hidden="true"
            style={
              washes
                ? ({ '--wash-a': washes[0], '--wash-b': washes[1] } as CSSProperties)
                : undefined
            }
          >
            <span />
            <span />
          </span>
        )}
        <div className="bd__square" ref={square}>
          <svg
            className="bd__lines"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {POS.map((p, i) => (
              <path
                key={i}
                d={curve(p, halves.hub, halves.tile)}
                className="bd__line"
                data-seen={seen.includes(i)}
              />
            ))}
            {active !== null && (
              <motion.path
                key={active}
                d={curve(POS[active], halves.hub, halves.tile)}
                className="bd__line bd__line--on"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            )}
          </svg>

          <div className="bd__hub" aria-hidden="true">
            <span className="bd__hub-mark" />
            {hub}
          </div>

          <div role="group" aria-label={label}>
            {items.map((it, i) => {
              const I = DIAGRAM_ICONS[it.icon]
              const on = active === i
              const isSeen = seen.includes(i)
              return (
                <span
                  key={it.id}
                  className="bd__spot"
                  data-label={POS[i].y < HUB.y - 20 ? 'above' : 'below'}
                  style={{ left: `${POS[i].x}%`, top: `${POS[i].y}%` }}
                >
                  <motion.button
                    ref={(el) => {
                      buttons.current[i] = el
                    }}
                    type="button"
                    className="bd__node"
                    style={tone(it)}
                    aria-pressed={on}
                    aria-controls={minimal ? 'bd-panel-min' : 'bd-panel'}
                    aria-label={it.lead}
                    data-on={on}
                    data-seen={isSeen}
                    data-dim={active !== null && !on}
                    onClick={() => choose(i)}
                    onKeyDown={(e) => onKey(e, i)}
                    initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 22,
                      delay: 0.1 + i * 0.07,
                    }}
                  >
                    <span className="bd__tile">
                      {!isSeen && !reduce && look !== 'refined' && (
                        <span className="bd__pulse" aria-hidden="true" />
                      )}
                      <I
                        size={look === 'refined' ? 26 : minimal ? 32 : 40}
                        weight={
                          look === 'refined'
                            ? on
                              ? 'regular'
                              : 'light'
                            : minimal
                              ? on
                                ? 'regular'
                                : 'light'
                              : on
                                ? 'fill'
                                : 'duotone'
                        }
                        aria-hidden="true"
                      />
                    </span>
                    <span className="bd__label" aria-hidden="true">
                      {it.label}
                    </span>
                  </motion.button>
                </span>
              )
            })}
          </div>
        </div>

        <div className="bd__progress" aria-live="polite">
          <span className="bd__squares" aria-hidden="true">
            {items.map((it, i) => (
              <span key={it.id} data-seen={seen.includes(i)} style={tone(it)} />
            ))}
          </span>
          <span>
            {seen.length} of {items.length} explored
          </span>
        </div>
      </div>

      <div
        id={minimal ? 'bd-panel-min' : 'bd-panel'}
        className="bd__panel"
        style={b ? tone(b) : undefined}
        data-empty={!b}
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          {b && ActiveIcon ? (
            <motion.div
              key={b.id}
              className="bd__panel-content"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <motion.span
                className="bd__panel-icon"
                initial={
                  reduce ? false : look === 'refined' ? { opacity: 0 } : { scale: 0.6, rotate: -8 }
                }
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={
                  look === 'refined'
                    ? { duration: 0.4, ease: EASE }
                    : { type: 'spring', stiffness: 260, damping: 18 }
                }
              >
                <ActiveIcon
                  size={look === 'refined' ? 32 : minimal ? 40 : 56}
                  weight={look === 'refined' ? 'light' : minimal ? 'light' : 'duotone'}
                  aria-hidden="true"
                />
              </motion.span>
              <span className="bd__panel-n">{n(active ?? 0)} of 05</span>
              <p className="bd__panel-lead">{b.lead}</p>
              <p className="bd__panel-body">{b.body}</p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="bd__panel-empty"
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
            >
              <p className="bd__panel-empty-title">{emptyTitle}</p>
              <p className="bd__panel-empty-body">{emptyBody}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
