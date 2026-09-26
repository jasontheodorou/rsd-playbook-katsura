'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState, useSyncExternalStore, type CSSProperties } from 'react'

import type { Benefit } from './data'

const noop = () => () => {}
const useEnhanced = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const n = (i: number) => String(i + 1).padStart(2, '0')

/** Shared state: which benefit is open and which have been found. */
function useDiscovery(items: Benefit[]) {
  const [open, setOpen] = useState<string | null>(null)
  const [found, setFound] = useState<string[]>([])
  const choose = (id: string) => {
    setOpen((o) => (o === id ? null : id))
    setFound((f) => (f.includes(id) ? f : [...f, id]))
  }
  return { open, found, choose, all: found.length === items.length }
}

/** Without JavaScript every version is the same honest list: lead-in and passage, in order. */
function Static({ items }: { items: Benefit[] }) {
  return (
    <ol className="dg-static">
      {items.map((b, i) => (
        <li key={b.id} className="dg-static__item">
          <span className="dg-n">{n(i)}</span>
          <p>
            <strong>{b.lead}</strong> {b.body}
          </p>
        </li>
      ))}
    </ol>
  )
}

const Count = ({ found, total }: { found: number; total: number }) => (
  <p className="dg-count" aria-live="polite">
    {found} of {total} found
  </p>
)

const tone = (b: Benefit) => ({ '--tone': b.tone, '--deep': b.deep }) as CSSProperties

/* 1. Tiles and panel */
export function TilesPanel({ items }: { items: Benefit[] }) {
  const enhanced = useEnhanced()
  const reduce = useReducedMotion()
  const d = useDiscovery(items)
  if (!enhanced) return <Static items={items} />
  const current = items.find((b) => b.id === d.open)
  return (
    <div className="dg1">
      <div className="dg1__tiles" role="group" aria-label="What good design does">
        {items.map((b, i) => (
          <motion.button
            key={b.id}
            type="button"
            className="dg1__tile"
            style={tone(b)}
            data-found={d.found.includes(b.id)}
            aria-pressed={d.open === b.id}
            aria-controls="dg1-panel"
            onClick={() => d.choose(b.id)}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24, delay: i * 0.06 }}
          >
            <span className="dg-n">{n(i)}</span>
            <span className="dg1__lead">{b.lead}</span>
          </motion.button>
        ))}
      </div>
      <div className="dg1__foot">
        <Count found={d.found.length} total={items.length} />
      </div>
      <div id="dg1-panel" className="dg1__panel" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {current ? (
            <motion.div
              key={current.id}
              className="dg1__panel-inner"
              style={tone(current)}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <p className="dg1__panel-lead">{current.lead}</p>
              <p className="dg-body">{current.body}</p>
            </motion.div>
          ) : (
            <p className="dg1__hint">Choose a benefit to read it.</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* 2. Bento: the chosen benefit moves into the large tile */
export function Bento({ items }: { items: Benefit[] }) {
  const enhanced = useEnhanced()
  const reduce = useReducedMotion()
  const d = useDiscovery(items)
  if (!enhanced) return <Static items={items} />
  const activeId = d.open ?? items[0].id
  const active = items.find((b) => b.id === activeId)!
  const activeIndex = items.indexOf(active)
  return (
    <div className="dg2">
      <motion.div
        layout
        className="dg2__hero"
        style={tone(active)}
        aria-live="polite"
        transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.3 }}
          >
            <span className="dg-n">{n(activeIndex)}</span>
            <p className="dg2__hero-lead">{active.lead}</p>
            <p className="dg-body">{active.body}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="dg2__small" role="group" aria-label="What good design does">
        {items.map((b, i) => (
          <button
            key={b.id}
            type="button"
            className="dg2__tile"
            style={tone(b)}
            data-found={d.found.includes(b.id) || (d.open === null && i === 0)}
            aria-pressed={activeId === b.id}
            onClick={() => d.choose(b.id)}
          >
            <span className="dg-n">{n(i)}</span>
            <span className="dg2__lead">{b.lead}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* 3. Flip cards: each tile turns over to show its passage in place */
export function FlipCards({ items }: { items: Benefit[] }) {
  const enhanced = useEnhanced()
  const reduce = useReducedMotion()
  const [flipped, setFlipped] = useState<string[]>([])
  if (!enhanced) return <Static items={items} />
  const toggle = (id: string) =>
    setFlipped((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  return (
    <div className="dg3">
      <div className="dg3__cards" role="group" aria-label="What good design does">
        {items.map((b, i) => {
          const isFlipped = flipped.includes(b.id)
          return (
            <button
              key={b.id}
              type="button"
              className="dg3__card"
              style={tone(b)}
              aria-pressed={isFlipped}
              onClick={() => toggle(b.id)}
            >
              <motion.span
                className="dg3__inner"
                animate={reduce ? undefined : { rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                data-reduced={reduce ? 'true' : 'false'}
                data-flipped={isFlipped}
              >
                <span className="dg3__face dg3__front">
                  <span className="dg-n">{n(i)}</span>
                  <span className="dg3__lead">{b.lead}</span>
                  <span className="dg3__turn" aria-hidden="true">
                    Turn over
                  </span>
                </span>
                <span className="dg3__face dg3__back">
                  <span className="dg3__back-body">{b.body}</span>
                </span>
              </motion.span>
            </button>
          )
        })}
      </div>
      <Count found={flipped.length} total={items.length} />
    </div>
  )
}

/* 4. Progress count: numbered tiles and a slim bar that fills as each is found */
export function ProgressTiles({ items }: { items: Benefit[] }) {
  const enhanced = useEnhanced()
  const reduce = useReducedMotion()
  const d = useDiscovery(items)
  if (!enhanced) return <Static items={items} />
  const current = items.find((b) => b.id === d.open)
  return (
    <div className="dg4">
      <div className="dg4__bar" aria-hidden="true">
        <motion.span
          className="dg4__fill"
          animate={{ scaleX: d.found.length / items.length }}
          transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
        />
      </div>
      <div className="dg4__head">
        <Count found={d.found.length} total={items.length} />
        {d.all && <p className="dg4__done">All five found.</p>}
      </div>
      <div className="dg4__tiles" role="group" aria-label="What good design does">
        {items.map((b, i) => {
          const isFound = d.found.includes(b.id)
          return (
            <button
              key={b.id}
              type="button"
              className="dg4__tile"
              style={tone(b)}
              data-found={isFound}
              aria-pressed={d.open === b.id}
              aria-controls="dg4-panel"
              onClick={() => d.choose(b.id)}
            >
              <span className="dg4__n">{n(i)}</span>
              <span className="dg4__lead">{b.lead}</span>
              <span className="dg4__tick" aria-hidden="true" />
            </button>
          )
        })}
      </div>
      <div id="dg4-panel" className="dg4__panel" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {current && (
            <motion.p
              key={current.id}
              className="dg-body"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <strong>{current.lead}</strong> {current.body}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* 5. Expanding columns: the chosen column widens to show its passage */
export function ExpandingColumns({ items }: { items: Benefit[] }) {
  const enhanced = useEnhanced()
  const d = useDiscovery(items)
  if (!enhanced) return <Static items={items} />
  const activeId = d.open ?? items[0].id
  return (
    <div className="dg5" role="group" aria-label="What good design does">
      {items.map((b, i) => {
        const isOpen = activeId === b.id
        return (
          <button
            key={b.id}
            type="button"
            className="dg5__col"
            style={tone(b)}
            data-open={isOpen}
            aria-expanded={isOpen}
            onClick={() => d.choose(b.id)}
          >
            <span className="dg-n">{n(i)}</span>
            <span className="dg5__lead">{b.lead}</span>
            <span className="dg5__body">{b.body}</span>
          </button>
        )
      })}
    </div>
  )
}
