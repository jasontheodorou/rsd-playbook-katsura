'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useState, type ReactNode } from 'react'

/* Stacking cards (after Wise): each card pins near the top of the screen and the next slides up
   over it. Scrolling back uncovers it, so nothing is lost. Every card is the same width, from the
   wordmark's line to the account line. Each pinned card sits 16px below the one before, so the
   stack shows as a neat run of edges, and a card's shade deepens slightly as the next covers it. */
export type StackCard = { id: string; tone: 1 | 2 | 3; content: ReactNode }

export function StackingCards({ cards }: { cards: StackCard[] }) {
  // The cards' elements, collected by callback ref, so each card can watch the one that covers it.
  const [els, setEls] = useState<(HTMLDivElement | null)[]>([])
  return (
    <div className="stack">
      {cards.map((c, i) => {
        const next = els[i + 1] ?? null
        return (
          <StackedCard
            // Remount once the next card exists, so its scroll tracking starts on a real element.
            key={`${c.id}${next ? '-tracked' : ''}`}
            card={c}
            index={i}
            setRef={(el) => {
              setEls((prev) => {
                if (prev[i] === el) return prev
                const copy = [...prev]
                copy[i] = el
                return copy
              })
            }}
            next={next}
          />
        )
      })}
    </div>
  )
}

function StackedCard({
  card,
  index,
  setRef,
  next,
}: {
  card: StackCard
  index: number
  setRef: (el: HTMLDivElement | null) => void
  next: HTMLDivElement | null
}) {
  const reduce = useReducedMotion()
  // Fixed for this mount: the parent remounts the card once the next card exists.
  const [nextRef] = useState(() => ({ current: next }))
  const { scrollYProgress } = useScroll(
    next ? { target: nextRef, offset: ['start end', 'start start'] } : undefined,
  )
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.05])
  return (
    <motion.div
      ref={setRef}
      className={`stack__card stack__card--${card.tone}`}
      style={{ top: `calc(87px + ${index * 16}px)` }}
    >
      <div className="stack__content">{card.content}</div>
      {!reduce && next && (
        <motion.span className="stack__shade" style={{ opacity: dim }} aria-hidden="true" />
      )}
    </motion.div>
  )
}
