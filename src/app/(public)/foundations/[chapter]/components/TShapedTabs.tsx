'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from 'react'

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
}

const noop = () => () => {}
/** False during server render and hydration, true once JavaScript is running. */
const useEnhanced = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

function Panel({ role }: { role: Role }) {
  return (
    <div className="tst__panel">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tst__photo" src={role.photo} alt={role.alt} loading="lazy" />
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

export function TShapedTabs({ roles, className = '' }: { roles: Role[]; className?: string }) {
  const enhanced = useEnhanced()
  const reduce = useReducedMotion()
  const [[active, dir], setState] = useState<[number, number]>([0, 0])
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  if (!enhanced) {
    return (
      <div className={`tst tst--static ${className}`.trim()}>
        {roles.map((r) => (
          <section key={r.id} className="tst__static">
            <h3 className="tst__static-heading">{r.label}</h3>
            <Panel role={r} />
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
    <div className={`tst ${className}`.trim()}>
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
            <Panel role={r} />
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
            <Panel role={role} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
