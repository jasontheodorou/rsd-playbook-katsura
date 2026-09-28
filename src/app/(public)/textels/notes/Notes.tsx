'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef, useState, type CSSProperties, type ReactNode } from 'react'

import '../../foundations/[chapter]/components/body-text.css'
import '../../foundations/[chapter]/components/part-section.css'

/* The Hands part from chapter 03, in the manual's words, the same in every arrangement. */
const ACCENT = '#a61448'
const TINTS = ['#f7e7ee', '#f2dce6', '#fbf0f4']
const P = [
  'Our skills, methods and capabilities span the full lifecycle of a project and a service, which means we can always find the right tools for the task at hand.',
  'Working alongside our colleagues, clients and partners, we incrementally turn the ideas, service concepts and prototypes into real working services.',
  'We relentlessly focus on elements that deliver the greatest value, testing assumptions, learning and enhancing our designs throughout the process.',
  'Where our assumptions or hypotheses fall short, it provides the option to ‘pivot’; to review the research, insights to change direction.',
  'We use three techniques to explore the key questions: desirability (is it solving a problem or filling a gap for users?), feasibility (can it be done?), and viability (is the size of the prize right?).',
]
const QS = [
  { label: 'Desirability', text: 'Is it solving a problem or filling a gap for users?' },
  { label: 'Feasibility', text: 'Can it be done?' },
  { label: 'Viability', text: 'Is the size of the prize right?' },
]
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

function Heading() {
  return (
    <h2 className="part__heading">
      Designing the possible
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="part__mark"
        src="/illustrations/hhh/hands-scribble.png"
        alt=""
        aria-hidden="true"
      />
    </h2>
  )
}
const Body = ({ children, top = 48 }: { children: ReactNode; top?: number }) => (
  <div className="body-text" style={{ marginTop: top }}>
    {children}
  </div>
)

/** One sticky note: square corners, the part's tint, a soft shadow and a tilt. It settles onto
    the page on first view. */
function Note({
  label,
  children,
  tilt = -1.2,
  tint = TINTS[0],
  delay = 0,
  className = '',
  style,
  big = false,
}: {
  label: string
  children: ReactNode
  tilt?: number
  tint?: string
  delay?: number
  className?: string
  style?: CSSProperties
  big?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  return (
    <motion.aside
      ref={ref}
      className={`sn ${big ? 'sn--big' : ''} ${className}`.trim()}
      style={{ background: tint, ...style }}
      initial={reduce ? false : { opacity: 0, y: -10, rotate: tilt - 3 }}
      animate={inView ? { opacity: 1, y: 0, rotate: tilt } : undefined}
      transition={{ type: 'spring', stiffness: 170, damping: 20, delay }}
    >
      <span className="sn__label" style={{ color: ACCENT }}>
        {label}
      </span>
      <p className="sn__text">{children}</p>
    </motion.aside>
  )
}

/* ── 1. One note: the pivot, lifted out of the flow ── */

export function OneNote() {
  return (
    <section className="part">
      <Heading />
      <Body>
        <p>{P[0]}</p>
        <p>{P[1]}</p>
        <p>{P[2]}</p>
      </Body>
      <div className="sn-row">
        <Note label="When we pivot" big>
          {P[3]}
        </Note>
      </div>
      <Body>
        <p>{P[4]}</p>
      </Body>
    </section>
  )
}

/* ── 2. A pair: the focus on value and the pivot, side by side, tilted opposite ways ── */

export function Pair() {
  return (
    <section className="part">
      <Heading />
      <Body>
        <p>{P[0]}</p>
        <p>{P[1]}</p>
      </Body>
      <div className="sn-row sn-row--pair">
        <Note label="What we focus on" tilt={-1.6}>
          {P[2]}
        </Note>
        <Note
          label="When we pivot"
          tilt={1.4}
          tint={TINTS[1]}
          delay={0.12}
          style={{ marginTop: 28 }}
        >
          {P[3]}
        </Note>
      </div>
      <Body>
        <p>{P[4]}</p>
      </Body>
    </section>
  )
}

/* ── 3. Three questions: desirability, feasibility and viability as a cluster of three notes,
       overlapping a little, like the notes around the sketch's hand ── */

export function ThreeQuestions() {
  return (
    <section className="part">
      <Heading />
      <Body>
        {P.slice(0, 4).map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p>We use three techniques to explore the key questions:</p>
      </Body>
      <div className="sn-cluster">
        {QS.map((q, i) => (
          <Note
            key={q.label}
            label={q.label}
            tilt={[-2, 1.5, -0.8][i]}
            tint={TINTS[i]}
            delay={i * 0.1}
            className="sn--square"
            style={{ marginTop: [0, 36, 12][i] }}
          >
            {q.text}
          </Note>
        ))}
      </div>
    </section>
  )
}

/* ── 4. Margin notes: the text keeps its column; two notes sit in the empty columns to its right,
       each beside the paragraph it belongs to. Below 1024px they fall back into the flow ── */

export function MarginNotes() {
  return (
    <section className="part sn-margin">
      <div className="sn-margin__text">
        <Heading />
        <Body>
          <p>{P[0]}</p>
          <p>{P[1]}</p>
          <p>{P[2]}</p>
          <p>We use three techniques to explore the key questions:</p>
        </Body>
      </div>
      <div className="sn-margin__notes">
        <Note label="When we pivot" tilt={1.6} style={{ marginTop: 150 }}>
          {P[3]}
        </Note>
        <Note
          label="The three questions"
          tilt={-1.4}
          tint={TINTS[1]}
          delay={0.1}
          style={{ marginTop: 40 }}
        >
          Desirability: is it solving a problem or filling a gap for users? Feasibility: can it be
          done? Viability: is the size of the prize right?
        </Note>
      </div>
    </section>
  )
}

/* ── 5. Fanned stack: the three questions as a neat stack that fans out when pointed at or
       chosen, so each can be read ── */

export function FannedStack() {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  return (
    <section className="part">
      <Heading />
      <Body>
        {P.slice(0, 4).map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p>We use three techniques to explore the key questions:</p>
      </Body>
      <button
        type="button"
        className="sn-fan"
        aria-expanded={open}
        aria-label={open ? 'The three questions, spread out' : 'Spread out the three questions'}
        onPointerEnter={() => setOpen(true)}
        onPointerLeave={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
      >
        {QS.map((q, i) => (
          <motion.span
            key={q.label}
            className="sn sn--square sn-fan__note"
            style={{ background: TINTS[i], zIndex: 3 - i }}
            animate={
              open || reduce
                ? { x: i * 104 + '%', y: [0, 18, 6][i], rotate: [-2, 1.5, -0.8][i] }
                : { x: i * 6, y: i * 6, rotate: [-2, 1, 3][i] }
            }
            transition={{ duration: 0.55, ease: EASE }}
          >
            <span className="sn__label" style={{ color: ACCENT }}>
              {q.label}
            </span>
            <span className="sn__text">{q.text}</span>
          </motion.span>
        ))}
      </button>
    </section>
  )
}
