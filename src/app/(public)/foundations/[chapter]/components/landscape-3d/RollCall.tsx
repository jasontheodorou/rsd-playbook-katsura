'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, useSyncExternalStore } from 'react'

/*
 * The Design Landscape's message box (Roll call, chosen from /hover on 29 September 2026): a
 * yellow pill above the map, its tail pointing down at it, naming each layer in turn. It rises in
 * once when it comes into view, and the map fades it out at the first choice. Screen readers hear
 * the plain prompt; under reduced motion it stays on the first layer.
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

export function RollCall({
  names,
  prompt,
  lead = 'Select a region to explore the ',
}: {
  names: string[]
  prompt: string
  /** The words before the changing name (the participation model passes its own). With no names,
      the box shows just these words, standing still. */
  lead?: string
}) {
  const reduce = useReduced()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce || names.length < 2) return
    const t = setInterval(() => setI((n) => (n + 1) % names.length), 1800)
    return () => clearInterval(t)
  }, [reduce, names.length])
  // The longest name holds the width, so the pill never changes size.
  const longest = names.reduce((a, b) => (b.length > a.length ? b : a), '')
  return (
    <motion.div
      className="l3d-roll"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
    >
      <span className="l3d-roll__sr">{prompt}</span>
      <span aria-hidden="true">{lead}</span>
      {names.length > 0 && (
        <span className="l3d-roll__slot" aria-hidden="true">
          <span className="l3d-roll__hold">{longest}</span>
          <AnimatePresence initial={false}>
            <motion.span
              key={names[i]}
              className="l3d-roll__word"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {names[i]}
            </motion.span>
          </AnimatePresence>
        </span>
      )}
    </motion.div>
  )
}
