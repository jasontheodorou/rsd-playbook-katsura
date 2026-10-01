'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { usePromptMemory } from '../page/once'

import './note-fan.css'

/**
 * A fanned stack of sticky notes ("Fanned stack", chosen from /textels/notes on 28 September
 * 2026). Up to three notes lie in a neat stack, the top one readable; pointing at the stack,
 * focusing it or choosing it fans them out in a row so each can be read. Like the notes around
 * the head, heart and hands sketch: square, in shades of the part's tint, slightly tilted. All
 * the text is in the page for screen readers, and with reduced motion (or on a phone) the notes
 * simply sit spread out.
 */
export type FanNote = { label: string; text: string }

const REST = [
  { x: 0, y: 0, rotate: -2 },
  { x: 6, y: 6, rotate: 1 },
  { x: 12, y: 12, rotate: 3 },
]
const SPREAD = [
  { x: '0%', y: 0, rotate: -2 },
  { x: '104%', y: 18, rotate: 1.5 },
  { x: '208%', y: 6, rotate: -0.8 },
]

export function NoteFan({
  notes,
  label,
  accent = '#111',
  tints = ['#f5f1ea', '#efe9e0', '#faf7f2'],
  prompt,
}: {
  notes: FanNote[]
  /** What the set is, for screen readers, for example "The three core principles". */
  label: string
  accent?: string
  tints?: string[]
  /** The yellow speech bubble to the right of the stack, pointing at it, with a pulse on the top
      note, shown on every visit until the stack is first opened. The chapter gives it to the
      page's first stack only. */
  prompt?: string
}) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const spread = open || Boolean(reduce)
  const [opened, setOpened] = useState(false)
  const [seen, remember] = usePromptMemory('note-fan')
  // Opening the stack once puts its prompt away for this visit.
  const show = (v: boolean) => {
    setOpen(v)
    if (v) {
      setOpened(true)
      if (prompt) remember()
    }
  }
  return (
    <ul
      className="nfan"
      aria-label={label}
      tabIndex={0}
      data-open={spread}
      onPointerEnter={(e) => e.pointerType === 'mouse' && show(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && show(false)}
      onFocus={() => show(true)}
      onBlur={() => show(false)}
      onClick={() => show(!open)}
    >
      {/* The Design Landscape's pulses on the top note: a soft blue disc and ring rising from the
          note's empty lower half, three in turn 0.35 seconds apart, every 5 seconds, from when
          the stack comes into view until it is first opened. */}
      {prompt && !opened && !seen && !reduce && (
        <motion.li
          className="nfan__tap"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          {[0, 1, 2].map((k) => (
            <span key={k} style={{ animationDelay: `${0.6 + k * 0.35}s` }} />
          ))}
        </motion.li>
      )}
      {notes.slice(0, 3).map((n, i) => (
        <motion.li
          key={n.label}
          className="nfan__note"
          style={{ background: tints[i % tints.length], zIndex: 3 - i }}
          initial={false}
          animate={spread ? SPREAD[i] : REST[i]}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="nfan__label" style={{ color: accent }}>
            {n.label}
          </span>
          <span className="nfan__text">{n.text}</span>
        </motion.li>
      ))}
      <AnimatePresence>
        {prompt && !opened && !seen && (
          <motion.li
            key="bubble"
            className="nfan__bubble"
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            {prompt}
          </motion.li>
        )}
      </AnimatePresence>
    </ul>
  )
}
