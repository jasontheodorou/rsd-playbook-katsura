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
import './data-path.css'

/**
 * The data path, rebuilt (1 October 2026) to line up. One hairline card split on a page grid
 * line: the tint on page columns 2 to 7, white on 8 to 11. On the tint, five stops rise like
 * points on a chart, each one directly above its label, and the labels share one line along the
 * bottom. Every stop sits on a point of the dot grid, and the drawing is centred by what is drawn.
 * Two lines run across both halves: along the top, the speech bubble, the highest stop and the
 * reading's title; along the bottom, the labels and the reading's count. Choosing a stop fills
 * the line in slate up to it and shows its words on white. Without JavaScript it is a plain list.
 */

/** How far up the drawing each stop sits, from the lowest (0) to the highest (1). */
const RISE = [0, 0.3, 0.5, 0.74, 1]

type Geometry = {
  pts: { x: number; y: number }[]
  /** The bottom of the drawing: the labels' top less the gap above them. */
  floor: number
  /** Where the shading ends on the right: the last label's or stop's right edge. */
  end: number
  ox: number
  oy: number
  w: number
  h: number
}

/** A smooth line through the points (Catmull-Rom, drawn as cubic curves). */
function smooth(pts: { x: number; y: number }[]) {
  let d = `M${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    d += ` C${c1.x.toFixed(2)} ${c1.y.toFixed(2)} ${c2.x.toFixed(2)} ${c2.y.toFixed(2)} ${p2.x} ${p2.y}`
  }
  return d
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
const px = (el: Element, name: string) => parseFloat(getComputedStyle(el).getPropertyValue(name))

export function DataPath({
  prompt = 'Follow how we use data',
  label = 'How we use data',
  restTitle,
  restBody,
  items,
  memoryKey = 'data-path',
}: {
  prompt?: string
  label?: string
  restTitle: string
  restBody: string
  items: DiagramItem[]
  memoryKey?: string
}) {
  const enhanced = useEnhanced()
  const reduce = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)
  const [remembered, remember] = usePromptMemory(memoryKey)
  const stage = useRef<HTMLDivElement>(null)
  const [geo, setGeo] = useState<Geometry | null>(null)

  // Lay the drawing out from the stage's size: the pitch and the rows are whole steps of the dot
  // grid, and the dot grid is moved so a dot sits under every stop.
  useLayoutEffect(() => {
    const el = stage.current
    if (!el) return
    const layout = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w) return
      const g = px(el, '--g')
      const inset = px(el, '--inset')
      const tile = px(el, '--tile')
      const room = px(el, '--room') || 0
      const n = items.length - 1
      const labels = [...el.querySelectorAll<HTMLElement>('.dpn__label')]
      // The pitch is a whole number of dot steps, as wide as the labels at the ends allow. Labels
      // may wrap to fit between their neighbours, so it is worked out twice: once from the labels'
      // natural widths, then again once they have wrapped.
      const fit = () => {
        const lw = labels.map((l) => l.offsetWidth)
        const a = Math.max(tile, lw[0]) / 2
        const b = Math.max(tile, lw[n]) / 2
        return { a, b, pitch: Math.floor((w - 2 * inset - a - b) / n / g) * g }
      }
      labels.forEach((l) => (l.style.maxWidth = ''))
      const first = fit()
      labels.forEach((l) => (l.style.maxWidth = `${first.pitch - 8}px`))
      const { a, b, pitch } = fit()
      const lh = Math.max(...labels.map((l) => l.offsetHeight))
      const x0 = (w - (a + n * pitch + b)) / 2 + a
      // Top row: the highest stop's top on the inset line (below the bubble's band on phones).
      // Bottom row: the lowest stop's foot 12px above the labels, which end on the inset line.
      const labelTop = h - inset - lh
      const top = inset + room + tile / 2
      const rows = Math.floor((labelTop - 12 - tile / 2 - top) / g)
      const pts = RISE.slice(0, items.length).map((r, i) => ({
        x: x0 + i * pitch,
        y: top + Math.round(rows * (1 - r)) * g,
      }))
      const lastX = pts[n].x
      setGeo({
        pts,
        floor: labelTop - 8,
        end: lastX + b,
        ox: ((x0 % g) + g) % g,
        oy: ((top % g) + g) % g,
        w,
        h,
      })
    }
    layout()
    const ro = new ResizeObserver(layout)
    ro.observe(el)
    return () => ro.disconnect()
  }, [enhanced, items.length])

  if (!enhanced) {
    return (
      <ul className="dpn-static">
        {items.map((it) => (
          <li key={it.id}>
            <strong>{it.lead}</strong> {it.body}
          </li>
        ))}
      </ul>
    )
  }

  const used = active !== null || remembered
  const last = items.length - 1
  const choose = (i: number) => {
    setActive(i)
    remember()
  }
  const onKey = (e: KeyboardEvent, i: number) => {
    let next: number | null = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = Math.min(last, i + 1)
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = Math.max(0, i - 1)
    if (next === null) return
    e.preventDefault()
    ;(e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus()
  }

  const line = geo ? smooth(geo.pts) : ''
  const area = geo
    ? `${line} L${geo.end} ${geo.pts[last].y} L${geo.end} ${geo.floor} L${geo.pts[0].x} ${geo.floor} Z`
    : ''
  const reach = geo && active !== null ? geo.pts[active].x : 0

  return (
    <div className="dpn">
      <div
        ref={stage}
        className="dpn__stage"
        style={
          geo ? ({ '--ox': `${geo.ox}px`, '--oy': `${geo.oy}px` } as CSSProperties) : undefined
        }
      >
        <p className="dpn__bubble" data-gone={used} aria-hidden="true">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          >
            {prompt}
          </motion.span>
        </p>

        {geo && (
          <svg
            className="dpn__svg"
            width={geo.w}
            height={geo.h}
            viewBox={`0 0 ${geo.w} ${geo.h}`}
            aria-hidden="true"
          >
            <defs>
              {/* The shading fades out downwards, so it has no hard bottom edge. */}
              <linearGradient id="dpn-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34566b" stopOpacity={0.072} />
                <stop offset="100%" stopColor="#34566b" stopOpacity={0} />
              </linearGradient>
              <clipPath id="dpn-reach">
                <motion.rect
                  x={0}
                  y={0}
                  height={geo.h}
                  initial={false}
                  animate={{ width: reach }}
                  transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }}
                />
              </clipPath>
            </defs>
            <path d={area} fill="url(#dpn-fade)" />
            {/* A drop line from each stop to its label, so each stop reads with its label. */}
            {geo.pts.map((p, i) => (
              <line
                key={i}
                className="dpn__drop"
                data-on={active !== null && i <= active}
                x1={p.x}
                x2={p.x}
                y1={p.y}
                y2={geo.floor}
              />
            ))}
            <path d={line} className="dpn__line" />
            <path d={line} className="dpn__line dpn__line--on" clipPath="url(#dpn-reach)" />
          </svg>
        )}

        <div className="dpn__stops" role="group" aria-label={label}>
          {items.map((it, i) => {
            const I = DIAGRAM_ICONS[it.icon]
            const on = active === i
            const p = geo?.pts[i]
            return (
              <motion.button
                key={it.id}
                type="button"
                className="dpn__stop"
                data-on={on}
                data-past={active !== null && i < active}
                aria-pressed={on}
                aria-label={it.lead}
                style={p ? { left: p.x, top: p.y } : { visibility: 'hidden' }}
                onClick={() => choose(i)}
                onKeyDown={(e) => onKey(e, i)}
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.06 }}
              >
                {!used && !reduce && (
                  <span
                    className="dpn__pulse"
                    style={{ animationDelay: `${i * 0.35}s` }}
                    aria-hidden="true"
                  />
                )}
                <span className="dpn__tile">
                  <I weight={on ? 'regular' : 'light'} aria-hidden="true" />
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* The labels share one line along the bottom, each centred under its stop. */}
        <div className="dpn__labels" aria-hidden="true">
          {items.map((it, i) => (
            <span
              key={it.id}
              className="dpn__label"
              data-on={active === i}
              style={geo ? { left: geo.pts[i].x } : undefined}
              onClick={() => choose(i)}
            >
              {it.label}
            </span>
          ))}
        </div>
      </div>

      <div className="dpn__side" aria-live="polite">
        <div className="dpn__passages">
          <div className="dpn__passage" data-on={active === null} aria-hidden={active !== null}>
            <p className="dpn__lead">{restTitle}</p>
            <p className="dpn__body">{restBody}</p>
          </div>
          {items.map((it, i) => (
            <div
              key={it.id}
              className="dpn__passage"
              data-on={active === i}
              aria-hidden={active !== i}
            >
              <p className="dpn__lead">{it.lead}</p>
              <p className="dpn__body">{it.body}</p>
            </div>
          ))}
        </div>
        <span className="dpn__count">
          {active === null ? `${items.length} steps` : `${nn(active)} of ${nn(last)}`}
        </span>
      </div>
    </div>
  )
}
