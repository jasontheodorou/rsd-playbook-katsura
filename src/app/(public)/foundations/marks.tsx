/**
 * One mark per Foundations card. Every mark is a circle (the only shape the brand lets carry a
 * solid colour) with its own simple geometry, drawn in the playbook palette. Pure SVG, so they
 * render with no JavaScript and scale to any card size.
 */
type MarkProps = { className?: string }

const base = { viewBox: '0 0 100 100', 'aria-hidden': true, focusable: 'false' as const }

/** What we do: uncertainty on one side, clarity on the other. */
export function WhatWeDoMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className}>
      <path d="M50 2 A48 48 0 0 0 50 98 Z" fill="var(--grey-3)" />
      <path d="M50 2 A48 48 0 0 1 50 98 Z" fill="var(--orange)" />
    </svg>
  )
}

/** Why we do it: a north star in a deep navy sky. */
export function WhyWeDoItMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="50" cy="50" r="48" fill="var(--navy)" />
      <path d="M64 24 l3 8.5 L75.5 35.5 l-8.5 3 L64 47 l-3-8.5 L52.5 35.5 l8.5-3 Z" fill="var(--yellow)" />
    </svg>
  )
}

/** Our difference: T-shaped, breadth across the top and depth down the middle. */
export function OurDifferenceMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="50" cy="50" r="48" fill="var(--purple)" />
      <rect x="26" y="30" width="48" height="10" rx="5" fill="#ffffff" />
      <rect x="45" y="30" width="10" height="42" rx="5" fill="#ffffff" />
    </svg>
  )
}

/** Head, heart and hands: three orbs, one for each. */
export function HeadHeartHandsMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="50" cy="50" r="48" fill="var(--grey-2)" />
      <circle cx="50" cy="34" r="14" fill="var(--navy)" />
      <circle cx="35" cy="60" r="14" fill="var(--orange)" />
      <circle cx="65" cy="60" r="14" fill="var(--teal)" />
    </svg>
  )
}

/** Our methods: a toolkit, nine tools laid out in a grid. */
export function OurMethodsMark({ className }: MarkProps) {
  const cells = [-1, 0, 1]
  return (
    <svg {...base} className={className}>
      <circle cx="50" cy="50" r="48" fill="var(--teal)" />
      {cells.flatMap((row) =>
        cells.map((col) => (
          <rect
            key={`${row}${col}`}
            x={50 + col * 19 - 6.5}
            y={50 + row * 19 - 6.5}
            width="13"
            height="13"
            rx="3"
            fill="#ffffff"
            fillOpacity={row === 0 && col === 0 ? 1 : 0.8}
          />
        )),
      )}
    </svg>
  )
}

/** Our values: many people gathered around one centre. */
export function OurValuesMark({ className }: MarkProps) {
  const dots = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2
    return { x: (50 + Math.cos(a) * 34).toFixed(2), y: (50 + Math.sin(a) * 34).toFixed(2) }
  })
  return (
    <svg {...base} className={className}>
      <circle cx="50" cy="50" r="48" fill="var(--sky)" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="5.5" fill="#ffffff" />
      ))}
      <circle cx="50" cy="50" r="11" fill="var(--navy)" />
    </svg>
  )
}
