'use client'

import { motion, useReducedMotion } from 'motion/react'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'

import { createOnce } from '../page/once'
import { DIAGRAM_ICONS, HUB, POS, curve, type DiagramItem, type Half } from './Diagram'
import './photo-diagram.css'

/**
 * The photo diagram: the refined diagram rebuilt as one card that holds a photograph for each
 * item, at the size the diagram had without one. Three zones sit side by side on the card's
 * 10 columns: the diagram (4), the reading (3) and a portrait photograph (3). Every passage is
 * laid in the same grid cell, so the card is always as tall as the longest and never jumps.
 * Without JavaScript it
 * is the diagram's plain list.
 */

const noop = () => () => {}
const useEnhanced = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const n = (i: number) => String(i + 1).padStart(2, '0')

/* The first tile pulses until the reader has chosen any tile once, then never again. */
const prompt = createOnce('katsura:diagram-used')

export function PhotoDiagram({
  hub = 'Good design',
  label = 'What good design does',
  emptyTitle = 'Five things good design does',
  emptyBody = 'Choose one on the diagram to find out how.',
  restPhoto,
  restAlt = '',
  title,
  washes,
  items,
  look,
  cue = 'once',
}: {
  hub?: string
  label?: string
  emptyTitle?: string
  emptyBody?: string
  /** The photograph shown before anything is chosen. */
  restPhoto?: string
  restAlt?: string
  /** A short instruction at the top left of the card, as the balance slider has. */
  title?: string
  washes?: [string, string]
  items: DiagramItem[]
  /** A look to try on the /refine options page; the chapter uses the default. */
  look?: string
  /** 'once' pulses the first tile until the reader has ever chosen one; 'visit' pulses every
      tile in turn, 0.35 seconds apart, on each visit until the first choice (the look sets the
      pulse's own timing). */
  cue?: 'once' | 'visit'
}) {
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

  const usedEver = prompt.useUsed()
  const used = cue === 'visit' ? active !== null || seen.length > 0 : usedEver
  useEffect(() => {
    if (active !== null) prompt.mark()
  }, [active])

  // Line ends track the real edges of the centre pill and the tiles (layout sizes, so the
  // tiles' scale-in does not skew the measure).
  useLayoutEffect(() => {
    const el = square.current
    if (!el) return
    const measure = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      const hubEl = el.querySelector<HTMLElement>('.pd__hub')
      const tile = el.querySelector<HTMLElement>('.pd__tile')
      if (!w || !hubEl || !tile) return
      setHalves({
        hub: { x: (hubEl.offsetWidth / 2 / w) * 100, y: (hubEl.offsetHeight / 2 / h) * 100 },
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
            <li key={b.id} className="bd-static__item">
              <I size={36} weight="light" aria-hidden="true" />
              <p>
                <strong>{b.lead}</strong> {b.body}
              </p>
            </li>
          )
        })}
      </ol>
    )
  }

  const last = items.length - 1
  const choose = (i: number) => {
    setActive(i)
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
    <div
      className="pd"
      data-look={look}
      data-used={active !== null || seen.length > 0}
      style={
        washes ? ({ '--wash-a': washes[0], '--wash-b': washes[1] } as CSSProperties) : undefined
      }
    >
      {/* ── The diagram, in its own frosted box: the title at its top left, the diagram
          centred in the space below ── */}
      <div className="pd__stage">
        <span className="pd__washes" aria-hidden="true">
          <span />
          <span />
        </span>
        {title && (
          <motion.p
            className="pd__title"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
          >
            {title}
          </motion.p>
        )}
        <div className="pd__diagram">
          <div className="pd__square" ref={square}>
            <svg
              className="pd__lines"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {POS.map((p, i) => (
                <path
                  key={i}
                  d={curve(p, halves.hub, halves.tile)}
                  className="pd__line"
                  data-seen={seen.includes(i)}
                />
              ))}
              {active !== null && (
                <motion.path
                  key={active}
                  d={curve(POS[active], halves.hub, halves.tile)}
                  className="pd__line pd__line--on"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              )}
            </svg>

            <div className="pd__hub" aria-hidden="true">
              {hub}
            </div>

            <div role="group" aria-label={label}>
              {items.map((it, i) => {
                const I = DIAGRAM_ICONS[it.icon]
                const on = active === i
                return (
                  <span
                    key={it.id}
                    className="pd__spot"
                    data-label={POS[i].y < HUB.y - 20 ? 'above' : 'below'}
                    style={{ left: `${POS[i].x}%`, top: `${POS[i].y}%` }}
                  >
                    <motion.button
                      ref={(el) => {
                        buttons.current[i] = el
                      }}
                      type="button"
                      className="pd__node"
                      aria-pressed={on}
                      aria-controls="pd-reading"
                      aria-label={it.lead}
                      data-on={on}
                      data-dim={active !== null && !on}
                      onClick={() => choose(i)}
                      onKeyDown={(e) => onKey(e, i)}
                      initial={reduce ? false : { opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.06 }}
                    >
                      <span className="pd__tile">
                        {(i === 0 || cue === 'visit') && !used && active === null && !reduce && (
                          <span
                            className="pd__pulse"
                            aria-hidden="true"
                            style={cue === 'visit' ? { animationDelay: `${i * 0.35}s` } : undefined}
                          />
                        )}
                        <I size={24} weight={on ? 'regular' : 'light'} aria-hidden="true" />
                      </span>
                      <span className="pd__label" aria-hidden="true">
                        {it.label}
                      </span>
                    </motion.button>
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── The result, in its own white card: the reading and the photograph ── */}
      <div className="pd__result">
        {/* The reading: every passage in one cell, the chosen one shown */}
        <div className="pd__read">
          <div id="pd-reading" className="pd__passages" aria-live="polite">
            <div className="pd__passage" data-on={active === null} aria-hidden={active !== null}>
              <span className="pd__n">{items.length} to explore</span>
              <p className="pd__lead">{emptyTitle}</p>
              <p className="pd__body">{emptyBody}</p>
            </div>
            {items.map((it, i) => (
              <div
                key={it.id}
                className="pd__passage"
                data-on={active === i}
                aria-hidden={active !== i}
              >
                <span className="pd__n">
                  {n(i)} of {n(last)}
                </span>
                <p className="pd__lead">{it.lead}</p>
                <p className="pd__body">{it.body}</p>
              </div>
            ))}
          </div>

          <span className="pd__sr" aria-live="polite">
            {seen.length} of {items.length} explored
          </span>
        </div>

        {/* ── The photograph: all of them stacked, the chosen one faded in ── */}
        <div className="pd__photo">
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
