'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, useSyncExternalStore } from 'react'

/*
 * Five animated message boxes that sit over the Design Landscape and ask the reader to choose a
 * region. Each is in one Transform colour, rises in once when it comes into view, then keeps one
 * small repeating movement until a region is chosen (the map fades the box out). Under reduced
 * motion each shows still.
 */
const QUERY = '(prefers-reduced-motion: reduce)'
const subscribe = (fn: () => void) => {
  const m = window.matchMedia(QUERY)
  m.addEventListener('change', fn)
  return () => m.removeEventListener('change', fn)
}
/** Reduced motion, read after hydration so the server's HTML and the first client render match. */
const useReduced = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const ARRIVE = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.8 },
  transition: { duration: 0.7, ease: EASE, delay: 0.3 },
}
const TEXT = 'Select a region to explore the ecosystem'
const REGIONS = ['Individual', 'Service', 'Organisation', 'Community', 'Environment']

/** 1. Float: an orange speech bubble, its tail at the map, rising and falling 5px. */
export function Float() {
  const reduce = useReduced()
  return (
    <motion.div {...ARRIVE}>
      <motion.div
        className="cue cue--orange cue--tail"
        animate={reduce ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 2.6, ease: 'easeInOut', repeat: Infinity }}
      >
        {TEXT}
      </motion.div>
    </motion.div>
  )
}

/** 2. Beacon: a navy card with a small light that sends out a soft ring every two seconds. */
export function Beacon() {
  const reduce = useReduced()
  return (
    <motion.div {...ARRIVE} className="cue cue--navy cue--tail">
      <span className="cue-beacon" aria-hidden="true">
        {!reduce && (
          <motion.span
            className="cue-beacon__ring"
            animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
            transition={{ duration: 1.6, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.4 }}
          />
        )}
        <span className="cue-beacon__dot" />
      </span>
      {TEXT}
    </motion.div>
  )
}

/** 3. Roll call: a teal pill naming each region in turn, the name rolling up to the next. */
export function RollCall() {
  const reduce = useReduced()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI((n) => (n + 1) % REGIONS.length), 1800)
    return () => clearInterval(t)
  }, [reduce])
  return (
    <motion.div {...ARRIVE} className="cue cue--teal cue--tail">
      Explore the
      <span className="cue-roll">
        {/* The longest name holds the width, so the pill never changes size. */}
        <span className="cue-roll__hold" aria-hidden="true">
          Organisation
        </span>
        <AnimatePresence initial={false}>
          <motion.span
            key={REGIONS[i]}
            className="cue-roll__word"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {REGIONS[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.div>
  )
}

/** 4. Sticky note: a yellow note, slightly tilted and swaying, with an arrow that draws itself down. */
export function StickyNote() {
  const reduce = useReduced()
  return (
    <motion.div {...ARRIVE} className="cue-note-wrap">
      <motion.div
        className="cue cue--yellow"
        style={{ rotate: -2 }}
        animate={reduce ? undefined : { rotate: [-2, 0.5, -2] }}
        transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
      >
        {TEXT}
      </motion.div>
      <svg className="cue-note__arrow" viewBox="0 0 40 44" aria-hidden="true">
        <motion.path
          d="M8 4 C 4 18, 14 30, 28 36 M 20 38 L 29 36.5 L 26 28"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 1.1, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.4 }
          }
        />
      </svg>
    </motion.div>
  )
}

/** 5. Tap: a purple pill with a pointer that presses and sends out a ripple, as a click would. */
export function Tap() {
  const reduce = useReduced()
  const loop = { duration: 2.4, repeat: Infinity, ease: 'easeOut' } as const
  return (
    <motion.div {...ARRIVE} className="cue cue--purple">
      <span className="cue-tap" aria-hidden="true">
        {!reduce && (
          <motion.span
            className="cue-tap__ripple"
            animate={{ scale: [0.2, 0.2, 1.35], opacity: [0, 0.6, 0] }}
            transition={{ ...loop, times: [0, 0.25, 0.7] }}
          />
        )}
        <motion.svg
          className="cue-tap__hand"
          viewBox="0 0 24 24"
          animate={reduce ? undefined : { scale: [1, 1, 0.82, 1, 1], y: [0, 0, 1.5, 0, 0] }}
          transition={{ ...loop, times: [0, 0.15, 0.25, 0.4, 1] }}
        >
          <path d="M5 3 L5 18 L9 14.5 L11.6 20.5 L14 19.4 L11.4 13.6 L16.6 13.2 Z" />
        </motion.svg>
      </span>
      {TEXT}
    </motion.div>
  )
}
