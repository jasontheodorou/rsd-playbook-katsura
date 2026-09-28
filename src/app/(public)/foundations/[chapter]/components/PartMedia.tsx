'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

import { useChapterScroll } from '../page/scroll-context'
import type { PlaneTone } from './PartSection'

/**
 * A part's photograph on its offset plane, with a drifting plane ("Drifting plane", chosen from
 * /hhh2 on 28 September 2026), kept subtle. As the reader scrolls past, the plane and the
 * photograph move at different speeds, so the frame seems to float behind the photograph. Each
 * part's plane drifts its own way, so the page does not repeat itself: diagonally (up to 16px up
 * and 8px across), vertically (20px) or sideways (16px). The photograph moves 6px the other way.
 * Scroll is read from the chapter frame, which scrolls instead of the window.
 */
export type Drift = 'diagonal' | 'vertical' | 'sideways'

const RANGE: Record<Drift, { x: number; y: number }> = {
  diagonal: { x: 8, y: 16 },
  vertical: { x: 0, y: 20 },
  sideways: { x: 16, y: 4 },
}

export function PartMedia({
  photo,
  alt,
  plane,
  side,
  drift = 'diagonal',
}: {
  photo: string
  alt: string
  plane: PlaneTone
  side: 'tl' | 'br' | 'bl'
  drift?: Drift
}) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const container = useChapterScroll()
  const { scrollYProgress } = useScroll({
    target: ref,
    container: container ?? undefined,
    offset: ['start end', 'end start'],
  })
  const r = RANGE[drift]
  const dir = side === 'br' ? -1 : 1
  const planeY = useTransform(scrollYProgress, [0, 1], [r.y / 2, -r.y / 2])
  const planeX = useTransform(scrollYProgress, [0, 1], [(r.x / 2) * dir, (-r.x / 2) * dir])
  const photoY = useTransform(scrollYProgress, [0, 1], [-3, 3])
  return (
    <figure ref={ref} className={`part__media part__media--${side} part__media--${plane}`}>
      <motion.span
        className="part__plane"
        aria-hidden="true"
        style={reduce ? undefined : { y: planeY, x: planeX }}
      />
      <motion.img
        className="part__photo"
        src={photo}
        alt={alt}
        loading="lazy"
        style={reduce ? undefined : { y: photoY }}
      />
    </figure>
  )
}
