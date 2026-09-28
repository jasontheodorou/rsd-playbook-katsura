'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { useState } from 'react'

/**
 * Five ways to tell a reader that chapters 04 to 06 are each one part of Head, heart and hands,
 * and to take them back to it. Each sits just below the chapter title, borrows the sketch's own
 * scribbles and posters, and keeps its words to a line.
 */
type PartId = 'head' | 'heart' | 'hands'
const PARTS: {
  id: PartId
  name: string
  slug: string
  colour: string
  tint: string
  line: string
}[] = [
  {
    id: 'head',
    name: 'Head',
    slug: 'how-we-think',
    colour: '#a94c00',
    tint: '#fdeede',
    line: 'How we think',
  },
  {
    id: 'heart',
    name: 'Heart',
    slug: 'what-we-care-about',
    colour: '#c4121f',
    tint: '#fde8e9',
    line: 'What we care about',
  },
  {
    id: 'hands',
    name: 'Hands',
    slug: 'how-we-deliver',
    colour: '#a61448',
    tint: '#f7e7ee',
    line: 'How we deliver',
  },
]
const HOME = '/foundations/head-heart-and-hands'
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const scribble = (id: PartId) => `/illustrations/hhh/${id}-scribble.png`
const poster = (id: PartId) => `/illustrations/hhh/${id}.png`
const current = PARTS[0]

/* ── 1. Segmented pill: one frosted pill; the three parts as segments, the current one lit ── */

export function SegmentedPill() {
  return (
    <nav className="hn-seg" aria-label="Head, heart and hands">
      <Link href={HOME} className="hn-seg__home">
        Head, heart and hands
      </Link>
      <span className="hn-seg__parts">
        {PARTS.map((p) => {
          const on = p.id === current.id
          return (
            <Link
              key={p.id}
              href={`/foundations/${p.slug}`}
              className="hn-seg__part"
              aria-current={on ? 'page' : undefined}
              style={on ? { background: p.tint, color: p.colour } : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={scribble(p.id)} alt="" aria-hidden="true" />
              {p.name}
            </Link>
          )
        })}
      </span>
    </nav>
  )
}

/* ── 2. Mini wall: the sketch's three posters as small thumbnails; this chapter's poster in
       colour and lifted, the others in pencil grey ── */

export function MiniWall() {
  return (
    <nav className="hn-wall" aria-label="Head, heart and hands">
      <span className="hn-wall__posters">
        {PARTS.map((p) => {
          const on = p.id === current.id
          return (
            <Link
              key={p.id}
              href={`/foundations/${p.slug}`}
              className="hn-wall__poster"
              data-on={on}
              aria-label={`${p.name}: ${p.line}`}
              aria-current={on ? 'page' : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={poster(p.id)} alt="" />
            </Link>
          )
        })}
      </span>
      <span className="hn-wall__text">
        <span className="hn-wall__line">
          This is <strong style={{ color: current.colour }}>Head</strong>, one of three parts.
        </span>
        <Link href={HOME} className="hn-link">
          See all three <span aria-hidden="true">→</span>
        </Link>
      </span>
    </nav>
  )
}

/* ── 3. Thread: the three parts on a short line, like a route; this chapter a filled stop in
       its colour ── */

export function Thread() {
  return (
    <nav className="hn-thread" aria-label="Head, heart and hands">
      <Link href={HOME} className="hn-thread__home">
        Head, heart and hands
      </Link>
      <ol className="hn-thread__stops">
        {PARTS.map((p, i) => {
          const on = p.id === current.id
          return (
            <li key={p.id} className="hn-thread__stop" data-on={on}>
              <Link
                href={`/foundations/${p.slug}`}
                aria-current={on ? 'page' : undefined}
                style={{ '--c': p.colour } as React.CSSProperties}
              >
                <span className="hn-thread__dot" aria-hidden="true" />
                <span className="hn-thread__name">{p.name}</span>
              </Link>
              {i < PARTS.length - 1 && <span className="hn-thread__line" aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* ── 4. Scribble chip: the smallest option, one line with the chapter's scribble ── */

export function ScribbleChip() {
  return (
    <Link href={HOME} className="hn-chip" style={{ '--c': current.colour } as React.CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={scribble(current.id)} alt="" aria-hidden="true" />
      <span>
        <strong>Head</strong> · part 1 of Head, heart and hands
      </span>
      <span className="hn-chip__arrow" aria-hidden="true">
        →
      </span>
    </Link>
  )
}

/* ── 5. Glass bar that opens: a slim frosted bar; pointing at it or focusing it opens the three
       posters with their chapters, so the idea is sold without taking space until asked ── */

export function GlassBar() {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  return (
    <nav
      className="hn-glass"
      aria-label="Head, heart and hands"
      data-open={open}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <span className="hn-glass__bar">
        <span className="hn-glass__scribbles" aria-hidden="true">
          {PARTS.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p.id} src={scribble(p.id)} alt="" data-on={p.id === current.id} />
          ))}
        </span>
        <span className="hn-glass__label">
          Part of <strong>Head, heart and hands</strong>
        </span>
        <button
          type="button"
          className="hn-glass__toggle"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Explore'}
        </button>
      </span>
      <AnimatePresence initial={false}>
        {open && (
          <motion.span
            className="hn-glass__panel"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <span className="hn-glass__cards">
              {PARTS.map((p) => (
                <Link
                  key={p.id}
                  href={`/foundations/${p.slug}`}
                  className="hn-glass__card"
                  data-on={p.id === current.id}
                  aria-current={p.id === current.id ? 'page' : undefined}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={poster(p.id)} alt="" />
                  <span className="hn-glass__name" style={{ color: p.colour }}>
                    {p.name}
                  </span>
                  <span className="hn-glass__chapter">{p.line}</span>
                </Link>
              ))}
              <Link href={HOME} className="hn-glass__all">
                All three, together <span aria-hidden="true">→</span>
              </Link>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </nav>
  )
}
