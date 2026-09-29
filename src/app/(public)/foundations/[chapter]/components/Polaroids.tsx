'use client'

import { motion, useReducedMotion } from 'motion/react'

import './polaroids.css'

/**
 * Polaroid scatter (from `/different`, idea 01): up to three photographs as prints, overlapping
 * at slight angles, each with a short handwritten caption on its white strip. Pointing at a print,
 * or focusing it, straightens it and lifts it above the others. Reduced motion keeps them still.
 */
export type Polaroid = { src: string; alt: string; caption: string; angle: number }

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
/** Where each print's left edge sits, as a share of the block's width: inset a little so the tilted
    first and last prints stay inside the reading edges. */
const LEFT = [2.5, 32, 61.5]

export function Polaroids({ prints }: { prints: Polaroid[] }) {
  const reduce = useReducedMotion()
  return (
    <ul className="pol" role="list">
      {prints.slice(0, 3).map((p, i) => (
        <motion.li
          key={p.src}
          className="pol__print"
          tabIndex={0}
          style={{ left: `${LEFT[i]}%`, zIndex: i + 1 }}
          initial={{ rotate: p.angle }}
          whileHover={reduce ? undefined : { rotate: 0, y: -12, scale: 1.04, zIndex: 9 }}
          whileFocus={reduce ? undefined : { rotate: 0, y: -12, scale: 1.04, zIndex: 9 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <figure className="pol__figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.alt} loading="lazy" draggable={false} />
            <figcaption>{p.caption}</figcaption>
          </figure>
        </motion.li>
      ))}
    </ul>
  )
}
