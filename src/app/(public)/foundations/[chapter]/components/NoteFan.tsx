'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { createOnce } from '../page/once'

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

/* The hint shows until the reader has opened any stack once, then never again. */
const hint = createOnce('katsura:note-fan-used')

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
}: {
  notes: FanNote[]
  /** What the set is, for screen readers, for example "The three core principles". */
  label: string
  accent?: string
  tints?: string[]
}) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const used = hint.useUsed()
  const spread = open || Boolean(reduce)
  // Remember the first opening after it happens, not while React is drawing the stack.
  useEffect(() => {
    if (open) hint.mark()
  }, [open])
  return (
    <ul
      className="nfan"
      aria-label={label}
      tabIndex={0}
      data-open={spread}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
    >
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
      {/* The hint: beside the stack while it is closed; it slides away and fades as the notes fan
          out, so it never sits under them. */}
      <AnimatePresence>
        {!spread && !used && (
          <motion.li
            key="hint"
            className="nfan__hint"
            aria-hidden="true"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: 24,
              filter: 'blur(2px)',
              transition: { duration: 0.25, ease: 'easeIn' },
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <span>Hover to expand</span>
            <motion.svg
              className="nfan__arrow"
              viewBox="0 0 24 24"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.6 }}
            >
              <path d="M5 12h13M13 6l6 6-6 6" />
            </motion.svg>
          </motion.li>
        )}
      </AnimatePresence>
    </ul>
  )
}
