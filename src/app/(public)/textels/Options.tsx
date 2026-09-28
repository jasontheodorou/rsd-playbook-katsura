'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef, type ReactNode } from 'react'

import '../foundations/[chapter]/components/body-text.css'
import '../foundations/[chapter]/components/part-section.css'

/* The Hands part from chapter 03, the same in every option, so only the text treatment changes. */
const ACCENT = '#a61448'
const TINT = '#f7e7ee'
const P = [
  'Our skills, methods and capabilities span the full lifecycle of a project and a service, which means we can always find the right tools for the task at hand.',
  'Working alongside our colleagues, clients and partners, we incrementally turn the ideas, service concepts and prototypes into real working services.',
  'We relentlessly focus on elements that deliver the greatest value, testing assumptions, learning and enhancing our designs throughout the process.',
  'Where our assumptions or hypotheses fall short, it provides the option to ‘pivot’; to review the research, insights to change direction.',
  'We use three techniques to explore the key questions: desirability (is it solving a problem or filling a gap for users?), feasibility (can it be done?), and viability (is the size of the prize right?).',
]
const QUESTIONS = [
  { name: 'Desirability', q: 'Is it solving a problem or filling a gap for users?' },
  { name: 'Feasibility', q: 'Can it be done?' },
  { name: 'Viability', q: 'Is the size of the prize right?' },
]

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

/* ── 1. Lead and body: the first paragraph set like the statement, larger, in ink; the rest as body ── */

export function LeadAndBody() {
  return (
    <section className="part">
      <Heading />
      <p className="tx-lead">{P[0]}</p>
      <Body top={40}>
        {P.slice(1).map((p) => (
          <p key={p}>{p}</p>
        ))}
      </Body>
    </section>
  )
}

/* ── 2. Ink and grey: in each paragraph the first clause is ink and the rest grey, as in the
       statement under every title, so the eye can skim the ink alone ── */

const SPLITS = [
  [
    'Our skills, methods and capabilities span the full lifecycle of a project and a service,',
    ' which means we can always find the right tools for the task at hand.',
  ],
  [
    'Working alongside our colleagues, clients and partners,',
    ' we incrementally turn the ideas, service concepts and prototypes into real working services.',
  ],
  [
    'We relentlessly focus on elements that deliver the greatest value,',
    ' testing assumptions, learning and enhancing our designs throughout the process.',
  ],
  [
    'Where our assumptions or hypotheses fall short,',
    ' it provides the option to ‘pivot’; to review the research, insights to change direction.',
  ],
  [
    'We use three techniques to explore the key questions:',
    ' desirability (is it solving a problem or filling a gap for users?), feasibility (can it be done?), and viability (is the size of the prize right?).',
  ],
]

export function InkAndGrey() {
  return (
    <section className="part">
      <Heading />
      <Body>
        {SPLITS.map(([a, b]) => (
          <p key={a}>
            <span className="tx-ink">{a}</span>
            <span className="tx-grey">{b}</span>
          </p>
        ))}
      </Body>
    </section>
  )
}

/* ── 3. Highlighter: a few key phrases get a stroke of the part's colour, drawn across them as
       they scroll into view, like marker on a printout ── */

function Mark({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 1 })
  const reduce = useReducedMotion()
  return (
    <motion.span
      ref={ref}
      className="tx-mark"
      initial={reduce ? false : { backgroundSize: '0% 0.6em' }}
      animate={inView ? { backgroundSize: '100% 0.6em' } : undefined}
      transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
    >
      {children}
    </motion.span>
  )
}

export function Highlighter() {
  return (
    <section className="part">
      <Heading />
      <Body>
        <p>
          Our skills, methods and capabilities span <Mark>the full lifecycle</Mark> of a project and
          a service, which means we can always find the right tools for the task at hand.
        </p>
        <p>
          Working alongside our colleagues, clients and partners, we incrementally turn the ideas,
          service concepts and prototypes <Mark>into real working services</Mark>.
        </p>
        <p>
          We relentlessly focus on elements that deliver <Mark>the greatest value</Mark>, testing
          assumptions, learning and enhancing our designs throughout the process.
        </p>
        <p>{P[3]}</p>
        <p>{P[4]}</p>
      </Body>
    </section>
  )
}

/* ── 4. Read more: the first two paragraphs show; the rest wait behind a quiet disclosure, the
       "hide to include" rule applied to prose ── */

export function ReadMore() {
  return (
    <section className="part">
      <Heading />
      <Body>
        <p>{P[0]}</p>
        <p>{P[1]}</p>
      </Body>
      <details className="tx-more">
        <summary className="tx-more__summary">How we test and learn</summary>
        <Body top={32}>
          <p>{P[2]}</p>
          <p>{P[3]}</p>
          <p>{P[4]}</p>
        </Body>
      </details>
    </section>
  )
}

/* ── 5. Three questions: the closing paragraph's three questions set as three small cards, in
       the manual's own words, so the page ends on something to look at ── */

export function ThreeQuestions() {
  const ref = useRef<HTMLOListElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
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
      <ol ref={ref} className="tx-qs">
        {QUESTIONS.map((q, i) => (
          <motion.li
            key={q.name}
            className="tx-q"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
          >
            <span className="tx-q__name" style={{ color: ACCENT }}>
              {q.name}
            </span>
            <span className="tx-q__text">{q.q}</span>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}

/* ── 6. Sticky note: one aside paragraph (the pivot) is lifted out of the flow onto a sticky note
       in the part's tint, slightly tilted, like the notes on the sketch ── */

export function StickyNote() {
  return (
    <section className="part">
      <Heading />
      <Body>
        <p>{P[0]}</p>
        <p>{P[1]}</p>
        <p>{P[2]}</p>
      </Body>
      <aside className="tx-note" style={{ background: TINT }}>
        <span className="tx-note__label" style={{ color: ACCENT }}>
          When we pivot
        </span>
        <p>{P[3]}</p>
      </aside>
      <Body>
        <p>{P[4]}</p>
      </Body>
    </section>
  )
}

/* ── 7. Together: a lead paragraph, a sticky note for the pivot and the three questions as cards.
       The combination recommended for Hands ── */

export function Together() {
  const ref = useRef<HTMLOListElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  return (
    <section className="part">
      <Heading />
      <p className="tx-lead">{P[0]}</p>
      <Body top={40}>
        <p>{P[1]}</p>
        <p>{P[2]}</p>
      </Body>
      <aside className="tx-note" style={{ background: TINT }}>
        <span className="tx-note__label" style={{ color: ACCENT }}>
          When we pivot
        </span>
        <p>{P[3]}</p>
      </aside>
      <Body>
        <p>We use three techniques to explore the key questions:</p>
      </Body>
      <ol ref={ref} className="tx-qs">
        {QUESTIONS.map((q, i) => (
          <motion.li
            key={q.name}
            className="tx-q"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
          >
            <span className="tx-q__name" style={{ color: ACCENT }}>
              {q.name}
            </span>
            <span className="tx-q__text">{q.q}</span>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
