'use client'

import { motion, useReducedMotion } from 'motion/react'

/**
 * Line icons for the five benefits, drawn on a 48-unit grid with a 2.5 stroke. With `draw`, the
 * strokes draw themselves in (pathLength), once, each time the icon mounts. No circles: shapes are
 * squares, rounded squares and lines, keeping the page's one circle for the title's full stop.
 */
const PATHS: Record<string, string[]> = {
  // Root causes: a stem and leaves above ground, roots spreading below.
  effectiveness: [
    'M24 6v20',
    'M24 14c-4-5-9-5-12-3 3 4 8 5 12 3',
    'M24 12c4-5 9-5 12-3-3 4-8 5-12 3',
    'M8 26h32',
    'M24 26v8m0 0-7 7m7-7 7 7m-7-7v9',
  ],
  // Efficiency: a gauge with its needle towards the high end.
  efficiency: ['M8 34a16 16 0 0 1 32 0', 'M24 34l9-11', 'M12 34h3m18 0h3', 'M24 18v3'],
  // Trust: a shield with a tick.
  trust: ['M24 6l15 6v10c0 10-6.5 17-15 20-8.5-3-15-10-15-20V12z', 'M17 24l5 5 9-10'],
  // Learning: a loop of two arrows.
  learning: ['M12 20a13 13 0 0 1 23-5', 'M35 8v7h-7', 'M36 28a13 13 0 0 1-23 5', 'M13 40v-7h7'],
  // Prevention: an umbrella with rain kept off.
  prevention: [
    'M8 24h32',
    'M8 24c0-9 7-15 16-15s16 6 16 15',
    'M24 24v13a4 4 0 0 1-8 0',
    'M12 6l-2 4m14-6-2 4m14-2-2 4',
  ],
}

export function BenefitIcon({
  id,
  size = 48,
  draw = false,
  className = '',
}: {
  id: string
  size?: number
  draw?: boolean
  className?: string
}) {
  const reduce = useReducedMotion()
  const paths = PATHS[id] ?? []
  return (
    <svg
      className={`bicon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d, i) =>
        draw && !reduce ? (
          <motion.path
            key={i}
            d={d}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : (
          <path key={i} d={d} />
        ),
      )}
    </svg>
  )
}
