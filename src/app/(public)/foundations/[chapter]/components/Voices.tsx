'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'

import './voices.css'

/**
 * Voices (chapter 05, What we care about): short quotations from the people services are for,
 * side by side in one tinted card, each under a Georgia speech mark. They fade up in turn as the
 * card scrolls into view. For the user quotes a story section ends on; up to three.
 */
export function Voices({
  label,
  quotes,
  tint = '#fdf0ee',
}: {
  /** A small label at the card's top left, saying whose words these are. */
  label?: string
  quotes: string[]
  tint?: string
}) {
  const reduce = useReducedMotion()
  return (
    <figure className="vx" style={{ '--vx-tint': tint } as CSSProperties}>
      {label && <figcaption className="vx__label">{label}</figcaption>}
      <div className="vx__row">
        {quotes.slice(0, 3).map((q, i) => (
          <motion.blockquote
            key={q}
            className="vx__quote"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.12 }}
          >
            <span className="vx__mark" aria-hidden="true">
              &ldquo;
            </span>
            <p>{q}</p>
          </motion.blockquote>
        ))}
      </div>
    </figure>
  )
}
