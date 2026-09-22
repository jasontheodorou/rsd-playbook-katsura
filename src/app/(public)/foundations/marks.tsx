import type { CSSProperties } from 'react'

/**
 * One mark per Foundations card. Every mark is a circle (the only shape the brand lets carry a
 * solid colour) with its own simple geometry, drawn in the playbook palette.
 *
 * Every shape carries both a fill and a stroke in the mark's colours. A card with
 * data-state="unread" turns fills off and strokes on, so the same drawing becomes an outline;
 * data-state="read" fills it solid. Pure SVG, so it renders with no JavaScript.
 */
type MarkProps = { className?: string; style?: CSSProperties }

const base = { viewBox: '0 0 100 100', 'aria-hidden': true, focusable: 'false' as const }

/** Sets the mark's colour variables: a is the primary (and the outline colour), b and c are details. */
const palette = (a: string, b = '#ffffff', c = a): CSSProperties =>
  ({ '--mark-a': a, '--mark-b': b, '--mark-c': c }) as CSSProperties

const shape = (colour: string) => ({ fill: colour, stroke: 'var(--mark-a)' })

/** What we do: uncertainty on one side, clarity on the other. */
export function WhatWeDoMark({ className, style }: MarkProps) {
  return (
    <svg {...base} className={className} style={{ ...palette('var(--orange)', 'var(--grey-3)'), ...style }}>
      <path d="M50 2 A48 48 0 0 0 50 98 Z" {...shape('var(--mark-b)')} />
      <path d="M50 2 A48 48 0 0 1 50 98 Z" {...shape('var(--mark-a)')} />
    </svg>
  )
}

/** Why we do it: a north star in a deep navy sky. */
export function WhyWeDoItMark({ className, style }: MarkProps) {
  return (
    <svg {...base} className={className} style={{ ...palette('var(--navy)', 'var(--yellow)'), ...style }}>
      <circle cx="50" cy="50" r="48" {...shape('var(--mark-a)')} />
      <path d="M64 24 l3 8.5 L75.5 35.5 l-8.5 3 L64 47 l-3-8.5 L52.5 35.5 l8.5-3 Z" {...shape('var(--mark-b)')} />
    </svg>
  )
}

/** Our difference: T-shaped, breadth across the top and depth down the middle. */
export function OurDifferenceMark({ className, style }: MarkProps) {
  return (
    <svg {...base} className={className} style={{ ...palette('var(--purple)'), ...style }}>
      <circle cx="50" cy="50" r="48" {...shape('var(--mark-a)')} />
      <rect x="26" y="30" width="48" height="10" rx="5" {...shape('var(--mark-b)')} />
      <rect x="45" y="30" width="10" height="42" rx="5" {...shape('var(--mark-b)')} />
    </svg>
  )
}

/** Head, heart and hands: three orbs, one for each. */
export function HeadHeartHandsMark({ className, style }: MarkProps) {
  return (
    <svg {...base} className={className} style={{ ...palette('var(--navy)', 'var(--grey-2)'), ...style }}>
      <circle cx="50" cy="50" r="48" {...shape('var(--mark-b)')} />
      <circle cx="50" cy="34" r="14" {...shape('var(--navy)')} />
      <circle cx="35" cy="60" r="14" {...shape('var(--orange)')} />
      <circle cx="65" cy="60" r="14" {...shape('var(--teal)')} />
    </svg>
  )
}

/** Our methods: a toolkit, nine tools laid out in a grid. */
export function OurMethodsMark({ className, style }: MarkProps) {
  const cells = [-1, 0, 1]
  return (
    <svg {...base} className={className} style={{ ...palette('var(--teal)'), ...style }}>
      <circle cx="50" cy="50" r="48" {...shape('var(--mark-a)')} />
      {cells.flatMap((row) =>
        cells.map((col) => (
          <rect
            key={`${row}${col}`}
            x={50 + col * 19 - 6.5}
            y={50 + row * 19 - 6.5}
            width="13"
            height="13"
            rx="3"
            {...shape('var(--mark-b)')}
            opacity={row === 0 && col === 0 ? 1 : 0.85}
          />
        )),
      )}
    </svg>
  )
}

/** Our values: many people gathered around one centre. */
export function OurValuesMark({ className, style }: MarkProps) {
  const dots = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2
    return { x: (50 + Math.cos(a) * 34).toFixed(2), y: (50 + Math.sin(a) * 34).toFixed(2) }
  })
  return (
    <svg {...base} className={className} style={{ ...palette('var(--sky)', '#ffffff', 'var(--navy)'), ...style }}>
      <circle cx="50" cy="50" r="48" {...shape('var(--mark-a)')} />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="5.5" {...shape('var(--mark-b)')} />
      ))}
      <circle cx="50" cy="50" r="11" {...shape('var(--mark-c)')} />
    </svg>
  )
}
