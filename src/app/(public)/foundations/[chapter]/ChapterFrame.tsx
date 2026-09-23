'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

/** Lets anything inside the frame (the hamburger, a back link) close it with the exit animation. */
const FrameContext = createContext<{ close: () => void }>({ close: () => {} })
export const useChapterFrame = () => useContext(FrameContext)

// The original build's timing: a chapter grows out of its card, and shrinks back into it.
const GROW = { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
const SHRINK = { duration: 0.42, ease: [0.7, 0, 0.84, 0] as [number, number, number, number] }
const TOP_BAR = 63

type Props = { slug: string; children: ReactNode }

/**
 * A fixed layer below the top bar that holds a chapter. It scales up from the centre of the
 * chapter's card while the grid stays visible beneath, and scales back into the card on close.
 */
export function ChapterFrame({ slug, children }: Props) {
  const router = useRouter()
  const reduce = useReducedMotion()
  const [leaving, setLeaving] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)

  // Find the card this chapter came from, so the frame grows out of it (and back into it).
  // Set directly on the element: it is a one-off measurement, not state to render from.
  useEffect(() => {
    const card = document.querySelector<HTMLElement>(`[data-chapter="${slug}"]`)
    if (card && frameRef.current) {
      const r = card.getBoundingClientRect()
      frameRef.current.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2 - TOP_BAR}px`
    }
    // While a chapter is open the grid beneath is scenery: no scrolling, no focus, no reading order.
    const grid = document.querySelector<HTMLElement>('.landing')
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    grid?.setAttribute('inert', '')
    return () => {
      document.body.style.overflow = previous
      grid?.removeAttribute('inert')
    }
  }, [slug])

  const finish = () => {
    router.push('/foundations', { scroll: false })
    router.refresh() // the grid beneath re-renders with the new read state
  }

  const close = () => {
    if (leaving) return
    setLeaving(true)
    if (reduce) finish()
  }

  const hidden = { scale: 0.32, opacity: 0 }
  const shown = { scale: 1, opacity: 1 }

  return (
    <FrameContext.Provider value={{ close }}>
      <motion.div
        ref={frameRef}
        className="chapter-frame"
        initial={reduce ? false : hidden}
        animate={leaving ? hidden : shown}
        transition={leaving ? SHRINK : GROW}
        onAnimationComplete={() => {
          if (leaving) finish()
        }}
        style={{ transformOrigin: '50% 50%' }}
      >
        {children}
      </motion.div>
    </FrameContext.Provider>
  )
}
