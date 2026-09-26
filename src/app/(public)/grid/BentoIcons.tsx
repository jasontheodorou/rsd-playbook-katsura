'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState, useSyncExternalStore, type CSSProperties } from 'react'

import type { Benefit } from './data'
import { BenefitIcon } from './icons'

const noop = () => () => {}
const useEnhanced = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const n = (i: number) => String(i + 1).padStart(2, '0')
const tone = (b: Benefit) => ({ '--tone': b.tone, '--deep': b.deep }) as CSSProperties

function useBento(items: Benefit[]) {
  const [active, setActive] = useState<string | null>(null)
  const [seen, setSeen] = useState<string[]>([])
  const choose = (id: string) => {
    setActive(id)
    setSeen((s) => (s.includes(id) ? s : [...s, id]))
  }
  return { active, seen, choose, total: items.length }
}

function Static({ items }: { items: Benefit[] }) {
  return (
    <ol className="bx-static">
      {items.map((b) => (
        <li key={b.id} className="bx-static__item" style={tone(b)}>
          <BenefitIcon id={b.id} size={40} />
          <p>
            <strong>{b.lead}</strong> {b.body}
          </p>
        </li>
      ))}
    </ol>
  )
}

/** The large tile's contents: icon drawing in, lead-in, passage. Or, before a choice, a prompt. */
function Hero({ b, index, prompt }: { b?: Benefit; index?: number; prompt: string }) {
  const reduce = useReducedMotion()
  return (
    <AnimatePresence mode="wait" initial={false}>
      {b ? (
        <motion.div
          key={b.id}
          className="bx-hero__content"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <BenefitIcon id={b.id} size={72} draw className="bx-hero__icon" />
          <span className="bx-n">{n(index ?? 0)}</span>
          <p className="bx-hero__lead">{b.lead}</p>
          <p className="bx-hero__body">{b.body}</p>
        </motion.div>
      ) : (
        <motion.div
          key="prompt"
          className="bx-hero__prompt"
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
        >
          <span className="bx-hero__prompt-arrow" aria-hidden="true" />
          <p>{prompt}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* A. Icon tiles: icon-led tiles with an explicit open cue and an unread marker. */
export function IconTiles({ items }: { items: Benefit[] }) {
  const enhanced = useEnhanced()
  const s = useBento(items)
  if (!enhanced) return <Static items={items} />
  const i = items.findIndex((b) => b.id === s.active)
  const b = items[i]
  return (
    <div className="bxa">
      <div
        className="bx-hero bxa__hero"
        style={b ? tone(b) : undefined}
        data-empty={!b}
        aria-live="polite"
      >
        <Hero
          b={b}
          index={i}
          prompt="Choose one of the five benefits to read what good design does."
        />
      </div>
      <div className="bxa__tiles" role="group" aria-label="What good design does">
        {items.map((it, k) => {
          const isSeen = s.seen.includes(it.id)
          return (
            <button
              key={it.id}
              type="button"
              className="bxa__tile"
              style={tone(it)}
              aria-pressed={s.active === it.id}
              data-seen={isSeen}
              onClick={() => s.choose(it.id)}
            >
              <span className="bxa__top">
                <BenefitIcon id={it.id} size={40} />
                {!isSeen && <span className="bxa__new">New</span>}
              </span>
              <span className="bxa__lead">{it.lead}</span>
              <span className="bxa__cue" aria-hidden="true">
                <span className="bxa__plus" />
                {s.active === it.id ? 'Reading' : 'Open'}
              </span>
              <span className="visually-hidden">{n(k)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* B. Interactive diagram: good design at the centre, five icon nodes around it. */
const NODES = [
  { x: 200, y: 58 },
  { x: 342, y: 162 },
  { x: 288, y: 330 },
  { x: 112, y: 330 },
  { x: 58, y: 162 },
]

export function Diagram({ items }: { items: Benefit[] }) {
  const enhanced = useEnhanced()
  const reduce = useReducedMotion()
  const s = useBento(items)
  if (!enhanced) return <Static items={items} />
  const i = items.findIndex((b) => b.id === s.active)
  const b = items[i]
  return (
    <div className="bxb">
      <div className="bxb__stage">
        <svg
          className="bxb__svg"
          viewBox="0 0 400 400"
          role="group"
          aria-label="What good design does"
        >
          {/* Spokes: faint, with the chosen one drawn in over it. */}
          {NODES.map((p, k) => (
            <line key={k} x1="200" y1="200" x2={p.x} y2={p.y} className="bxb__spoke" />
          ))}
          {i >= 0 && (
            <motion.line
              key={b.id}
              x1="200"
              y1="200"
              x2={NODES[i].x}
              y2={NODES[i].y}
              className="bxb__spoke bxb__spoke--on"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          )}
          <g className="bxb__hub">
            <rect x="150" y="176" width="100" height="48" rx="12" />
            <text x="200" y="205" textAnchor="middle">
              Good design
            </text>
          </g>
          {items.map((it, k) => {
            const p = NODES[k]
            const on = s.active === it.id
            const seen = s.seen.includes(it.id)
            return (
              <g
                key={it.id}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={it.lead}
                className="bxb__node"
                data-on={on}
                data-seen={seen}
                style={tone(it)}
                transform={`translate(${p.x - 32} ${p.y - 32})`}
                onClick={() => s.choose(it.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    s.choose(it.id)
                  }
                }}
              >
                <rect className="bxb__node-bg" width="64" height="64" rx="16" />
                <g transform="translate(12 12) scale(0.8333)">
                  <BenefitIcon id={it.id} size={48} />
                </g>
              </g>
            )
          })}
        </svg>
        <p className="bxb__count" aria-live="polite">
          {s.seen.length} of {s.total} explored
        </p>
      </div>
      <div
        className="bx-hero bxb__hero"
        style={b ? tone(b) : undefined}
        data-empty={!b}
        aria-live="polite"
      >
        <Hero
          b={b}
          index={i}
          prompt="Choose a square on the diagram to see how good design helps."
        />
      </div>
    </div>
  )
}

/* C. Icon control: a large panel above a row of five icon buttons with a progress line. */
export function IconControl({ items }: { items: Benefit[] }) {
  const enhanced = useEnhanced()
  const reduce = useReducedMotion()
  const s = useBento(items)
  if (!enhanced) return <Static items={items} />
  const i = items.findIndex((b) => b.id === s.active)
  const b = items[i]
  return (
    <div className="bxc">
      <div
        className="bx-hero bxc__hero"
        style={b ? tone(b) : undefined}
        data-empty={!b}
        aria-live="polite"
      >
        <Hero
          b={b}
          index={i}
          prompt="Choose an icon below. There are five things good design does."
        />
      </div>
      <div className="bxc__bar">
        <motion.span
          className="bxc__fill"
          animate={{ scaleX: s.seen.length / s.total }}
          transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
        />
      </div>
      <div className="bxc__buttons" role="group" aria-label="What good design does">
        {items.map((it, k) => (
          <button
            key={it.id}
            type="button"
            className="bxc__btn"
            style={tone(it)}
            aria-pressed={s.active === it.id}
            data-seen={s.seen.includes(it.id)}
            onClick={() => s.choose(it.id)}
          >
            <span className="bxc__icon">
              <BenefitIcon id={it.id} size={44} />
            </span>
            <span className="bxc__label" aria-hidden="true">
              {it.lead.replace(/ (by|and) .*$/, '').replace(/\.$/, '')}
            </span>
            <span className="visually-hidden">
              {n(k)}: {it.lead}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
