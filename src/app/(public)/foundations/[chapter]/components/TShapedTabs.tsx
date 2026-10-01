'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

import './t-shaped-tabs.css'

/**
 * T-shaped tabs, after the original build's "morphing pill" version. A row of tabs with an orange
 * pill that springs to the chosen one; the panel slides in from the direction of travel. Every
 * panel sits in the same grid cell, so the stage is always as tall as the longest and nothing
 * below it moves. Without JavaScript, every role renders in turn under its own heading.
 *
 * It spans a Foundations page's 11 content columns (page columns 2 to 12).
 */
export type Method = { term: string; text: ReactNode }
export type Role = {
  id: string
  label: string
  photo: string
  alt: string
  intro: ReactNode
  methods: Method[]
  more?: { summary: string; items: Method[] }
  /** The role's drawing, without `.svg`: `<art>-ink.svg` and `<art>-accent.svg` sit beside it. */
  art?: string
}

/**
 * Ways to show a role's drawing, tried on /icons (1 October 2026). Pen: drawn in, ink then orange.
 * Accent: the ink is there; the orange springs in on a soft orange bloom. Paper: the drawing on a
 * tilted card of watercolour paper that settles straight. Sticker: the photo stays, the drawing a
 * die-cut sticker on its corner. Plane: the drawing on a tile with the page's coloured plane.
 */
export type ArtLook = 'pen' | 'accent' | 'paper' | 'sticker' | 'plane'

/** The plane's colour for each role in turn, from the page's own plane tones. */
const PLANES = ['#cbd9da', '#d8b4a3', '#f1d46e', '#ccc8c4']

const noop = () => () => {}
/** False during server render and hydration, true once JavaScript is running. */
const useEnhanced = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

function Art({ role, look, index }: { role: Role; look: ArtLook; index: number }) {
  const layers = (
    <span className="tst-art__draw">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tst-art__ink" src={`${role.art}-ink.svg`} alt="" draggable={false} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tst-art__accent" src={`${role.art}-accent.svg`} alt="" draggable={false} />
    </span>
  )
  if (look === 'sticker')
    return (
      <div className="tst-art tst-art--sticker">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tst__photo" src={role.photo} alt={role.alt} loading="lazy" />
        <span className="tst-art__sticker" aria-hidden="true">
          {layers}
        </span>
      </div>
    )
  return (
    <div
      className={`tst-art tst-art--${look}`}
      role="img"
      aria-label={`Drawing for ${role.label}`}
      style={{ ['--plane' as string]: PLANES[index % PLANES.length] }}
    >
      {look === 'plane' && <span className="tst-art__plane" aria-hidden="true" />}
      <span className="tst-art__tile">{layers}</span>
    </div>
  )
}

function Panel({ role, look, index = 0 }: { role: Role; look?: ArtLook; index?: number }) {
  return (
    <div className="tst__panel">
      {look && role.art ? (
        <Art role={role} look={look} index={index} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="tst__photo" src={role.photo} alt={role.alt} loading="lazy" />
      )}
      <div className="tst__copy">
        <p className="tst__intro">{role.intro}</p>
        <ul className="tst__methods">
          {role.methods.map((m) => (
            <li key={m.term}>
              <strong>{m.term}</strong> — {m.text}
            </li>
          ))}
        </ul>
        {role.more && (
          <details className="tst__more">
            <summary className="tst__more-summary">{role.more.summary}</summary>
            <ul className="tst__methods tst__methods--more">
              {role.more.items.map((m) => (
                <li key={m.term}>
                  <strong>{m.term}:</strong> {m.text}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  )
}

export function TShapedTabs({
  roles,
  className = '',
  look,
}: {
  roles: Role[]
  className?: string
  /** Show each role's drawing this way (see ArtLook). Without it, the photograph. */
  look?: ArtLook
}) {
  const enhanced = useEnhanced()
  // The drawings play their entrance only once the card is in view, and on every change after.
  const root = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = root.current
    if (!el || !look) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [look, enhanced])
  const reduce = useReducedMotion()
  const [[active, dir], setState] = useState<[number, number]>([0, 0])
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  if (!enhanced) {
    return (
      <div className={`tst tst--static ${className}`.trim()}>
        {roles.map((r) => (
          <section key={r.id} className="tst__static">
            <h3 className="tst__static-heading">{r.label}</h3>
            <Panel role={r} look={look} />
          </section>
        ))}
      </div>
    )
  }

  const select = (i: number, focus = false) => {
    setState(([a]) => [i, i > a ? 1 : i < a ? -1 : 0])
    if (focus) tabs.current[i]?.focus()
  }
  const onKey = (e: KeyboardEvent) => {
    const last = roles.length - 1
    if (e.key === 'ArrowRight') select(active === last ? 0 : active + 1, true)
    else if (e.key === 'ArrowLeft') select(active === 0 ? last : active - 1, true)
    else if (e.key === 'Home') select(0, true)
    else if (e.key === 'End') select(last, true)
    else return
    e.preventDefault()
  }
  const role = roles[active]

  return (
    <div ref={root} className={`tst ${className}`.trim()} data-art={look} data-seen={seen || undefined}>
      <div className="tst__bar" role="tablist" aria-label="Roles" onKeyDown={onKey}>
        {roles.map((r, i) => (
          <button
            key={r.id}
            ref={(el) => {
              tabs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`tst-tab-${r.id}`}
            aria-selected={i === active}
            aria-controls={`tst-panel-${r.id}`}
            tabIndex={i === active ? 0 : -1}
            className="tst__tab"
            onClick={() => select(i)}
          >
            {i === active && (
              <motion.span
                layoutId="tst-pill"
                className="tst__pill"
                transition={
                  reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 38 }
                }
              />
            )}
            <span className="tst__label">{r.label}</span>
          </button>
        ))}
      </div>

      <div className="tst__stage">
        {/* Every panel, invisible, in the same cell: the stage takes the tallest one's height. */}
        {roles.map((r) => (
          <div key={r.id} className="tst__reserve" aria-hidden="true" inert>
            <Panel role={r} look={look} />
          </div>
        ))}
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={role.id}
            id={`tst-panel-${role.id}`}
            role="tabpanel"
            aria-labelledby={`tst-tab-${role.id}`}
            className="tst__live"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -40 }}
            transition={{ duration: reduce ? 0.12 : 0.36, ease: EASE }}
          >
            <Panel role={role} look={look} index={active} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
