'use client'

import { motion, useReducedMotion } from 'motion/react'
import {
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'

import { usePromptMemory } from '../page/once'
import { DIAGRAM_ICONS, type DiagramItem } from './Diagram'
import './benefits-card.css'

/**
 * The benefits card (rebuilt from scratch, 29 September 2026). One card in two equal halves:
 * on the left, on a warm tint, five items on a pentagon around a centre; on the right, the
 * reading with the chosen item's photo under it in a rounded rectangle. A grey speech bubble
 * sits just above the drawing and each item pulses in turn until the first choice, on every
 * visit. Only the chosen passage takes space and the photo fills the rest; the card's height
 * is set by the diagram's half, so it never changes.
 * Without JavaScript it is a plain list.
 *
 * Geometry, in a 100-unit square: a regular pentagon of radius R about a centre that sits
 * R(1 − cos 36°)/2 below the square's middle, so the top point and the two bottom points are
 * the same distance from the middle and the drawing centres itself, labels and all.
 */

const R = 35
const CY = 50 + (R * (1 - Math.cos(Math.PI / 5))) / 2
const POINTS = [0, 1, 2, 3, 4].map((k) => {
  const a = ((-90 + 72 * k) * Math.PI) / 180
  return { x: 50 + R * Math.cos(a), y: CY + R * Math.sin(a) }
})
/** Clear space between a line's end and the surface it meets, in square units. */
const CLEAR = 2
/** How far each connector bows, as a share of its length (clockwise). */
const BOW = 0.12

type Size = { hubX: number; hubY: number; tile: number }

/** A connector from the centre label's edge to a tile's edge, bowing gently clockwise. */
function connector(p: { x: number; y: number }, s: Size) {
  const dx = p.x - 50
  const dy = p.y - CY
  const len = Math.hypot(dx, dy)
  const ux = dx / len
  const uy = dy / len
  // Leave the centre label where the ray crosses its box, plus clear space.
  const t0 = Math.min(s.hubX / Math.abs(ux || 1e-6), s.hubY / Math.abs(uy || 1e-6)) + CLEAR
  const t1 = len - s.tile - CLEAR
  const ax = 50 + ux * t0
  const ay = CY + uy * t0
  const bx = 50 + ux * t1
  const by = CY + uy * t1
  const mx = (ax + bx) / 2 - uy * (t1 - t0) * BOW
  const my = (ay + by) / 2 + ux * (t1 - t0) * BOW
  return `M${ax.toFixed(2)} ${ay.toFixed(2)} Q${mx.toFixed(2)} ${my.toFixed(2)} ${bx.toFixed(2)} ${by.toFixed(2)}`
}

const noop = () => () => {}
const useEnhanced = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const nn = (i: number) => String(i + 1).padStart(2, '0')

export function BenefitsCard({
  prompt = 'Explore the root elements of good design',
  hub = 'Good design',
  label = 'What good design does',
  restTitle = 'Five things good design does',
  restBody = 'Choose one on the diagram to find out how.',
  restPhoto,
  restAlt = '',
  items,
  memoryKey = 'benefits',
}: {
  /** The speech bubble's words, shown until the first choice. */
  prompt?: string
  hub?: string
  label?: string
  restTitle?: string
  restBody?: string
  restPhoto?: string
  restAlt?: string
  items: DiagramItem[]
  /** The name its prompt is remembered under on the page. */
  memoryKey?: string
}) {
  const enhanced = useEnhanced()
  const reduce = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)
  const [seen, setSeen] = useState<number[]>([])
  const [remembered, remember] = usePromptMemory(memoryKey)
  const square = useRef<HTMLDivElement>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const [size, setSize] = useState<Size>({ hubX: 14, hubY: 3, tile: 10 })

  // Line ends follow the real sizes of the centre label and the tiles, in square units.
  useLayoutEffect(() => {
    const el = square.current
    if (!el) return
    const measure = () => {
      const w = el.offsetWidth
      const hubEl = el.querySelector<HTMLElement>('.bc__hub')
      const tile = el.querySelector<HTMLElement>('.bc__tile')
      if (!w || !hubEl || !tile) return
      setSize({
        hubX: (hubEl.offsetWidth / 2 / w) * 100,
        hubY: (hubEl.offsetHeight / 2 / w) * 100,
        tile: (tile.offsetWidth / 2 / w) * 100,
      })
      // Labels differ in width, so the drawn parts can sit off the square's centre. Shift the
      // square by half the difference, so the space either side of what is drawn is equal. Both
      // sides are measured against the square itself, so the shift does not feed back.
      const box = el.getBoundingClientRect()
      const parts = [...el.querySelectorAll<HTMLElement>('.bc__tile, .bc__label')].map((n) =>
        n.getBoundingClientRect(),
      )
      if (parts.length) {
        const left = Math.min(...parts.map((r) => r.left)) - box.left
        const right = box.right - Math.max(...parts.map((r) => r.right))
        el.style.setProperty('--shift', `${((right - left) / 2).toFixed(1)}px`)
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [enhanced])

  if (!enhanced) {
    return (
      <ul className="bc-static">
        {items.map((it) => (
          <li key={it.id}>
            <strong>{it.lead}</strong> {it.body}
          </li>
        ))}
      </ul>
    )
  }

  const used = seen.length > 0 || remembered
  const last = items.length - 1
  const choose = (i: number) => {
    setActive(i)
    remember()
    setSeen((s) => (s.includes(i) ? s : [...s, i]))
  }
  const onKey = (e: KeyboardEvent, i: number) => {
    let next: number | null = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = i === last ? 0 : i + 1
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = i === 0 ? last : i - 1
    if (next === null) return
    e.preventDefault()
    buttons.current[next]?.focus()
  }

  return (
    <div className="bc">
      <div className="bc__stage">
        <div className="bc__square" ref={square}>
          {/* The Design Landscape's suggester: a grey speech bubble just above the drawing, its
              tail's tip 32px above the top label. It rises in as the pulses start and fades at
              the first choice. */}
          <div className="bc__bubble" data-gone={used} aria-hidden="true">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
            >
              {prompt}
            </motion.p>
          </div>
          <svg className="bc__lines" viewBox="0 0 100 100" aria-hidden="true">
            {POINTS.map((p, i) => (
              <path key={i} d={connector(p, size)} data-seen={seen.includes(i)} />
            ))}
            {active !== null && (
              <motion.path
                key={active}
                d={connector(POINTS[active], size)}
                className="bc__line-on"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
              />
            )}
          </svg>

          <span className="bc__hub" style={{ top: `${CY}%` }} aria-hidden="true">
            {hub}
          </span>

          <div role="group" aria-label={label}>
            {items.map((it, i) => {
              const I = DIAGRAM_ICONS[it.icon]
              const on = active === i
              return (
                <motion.button
                  key={it.id}
                  ref={(el) => {
                    buttons.current[i] = el
                  }}
                  type="button"
                  className="bc__item"
                  data-on={on}
                  data-dim={active !== null && !on}
                  data-label={i === 0 ? 'above' : 'below'}
                  aria-pressed={on}
                  aria-label={it.lead}
                  style={{ left: `${POINTS[i].x}%`, top: `${POINTS[i].y}%` }}
                  onClick={() => choose(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  initial={reduce ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.06 }}
                >
                  {!used && !reduce && (
                    <span
                      className="bc__pulse"
                      style={{ animationDelay: `${i * 0.35}s` } as CSSProperties}
                      aria-hidden="true"
                    />
                  )}
                  <span className="bc__tile">
                    <I weight={on ? 'regular' : 'light'} aria-hidden="true" />
                  </span>
                  <span className="bc__label" aria-hidden="true">
                    {it.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bc__side">
        <div className="bc__passages" aria-live="polite">
          <div className="bc__passage" data-on={active === null} aria-hidden={active !== null}>
            <span className="bc__count">{items.length} to explore</span>
            <p className="bc__lead">{restTitle}</p>
            <p className="bc__body">{restBody}</p>
          </div>
          {items.map((it, i) => (
            <div
              key={it.id}
              className="bc__passage"
              data-on={active === i}
              aria-hidden={active !== i}
            >
              <span className="bc__count">
                {nn(i)} of {nn(last)}
              </span>
              <p className="bc__lead">{it.lead}</p>
              <p className="bc__body">{it.body}</p>
            </div>
          ))}
        </div>

        <div className="bc__photo">
          {restPhoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={restPhoto} alt={active === null ? restAlt : ''} data-on={active === null} />
          )}
          {items.map((it, i) =>
            it.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={it.id}
                src={it.photo}
                alt={active === i ? (it.alt ?? '') : ''}
                data-on={active === i}
                style={it.focus ? { objectPosition: it.focus } : undefined}
                loading="lazy"
              />
            ) : null,
          )}
        </div>
      </div>
    </div>
  )
}
