'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useState, type CSSProperties, type ReactNode } from 'react'

import { useChapterScroll } from '../page/scroll-context'
import './stack-cards.css'

/**
 * Stacking cards, from the /options demo (after Wise), as a Foundations block. Each card pins at
 * the top of the chapter frame, in line with the rail's number, and the next slides up over it;
 * scrolling back uncovers it. Pinned cards sit 16px apart, so the stack shows as a run of edges,
 * and a card's shade deepens slightly as the next one covers it. Inside a card: an eyebrow and a
 * title on content columns 2 to 6, a photograph on 7 to 10. Below 1024px the cards simply stack.
 */
export type StackCardItem = {
  id: string
  eyebrow: string
  title: ReactNode
  photo: string
  alt: string
  /** The card's own colour, for its eyebrow (dark enough for small text). */
  accent?: string
}

export function StackCards({ cards }: { cards: StackCardItem[] }) {
  // The cards' elements, collected by callback ref, so each card can watch the one that covers it.
  const [els, setEls] = useState<(HTMLDivElement | null)[]>([])
  return (
    <div className="stk">
      {cards.map((c, i) => {
        const next = els[i + 1] ?? null
        return (
          <Card
            // Remount once the next card exists, so its scroll tracking starts on a real element.
            key={`${c.id}${next ? '-tracked' : ''}`}
            card={c}
            index={i}
            tone={((i % 3) + 1) as 1 | 2 | 3}
            setRef={(el) =>
              setEls((prev) => {
                if (prev[i] === el) return prev
                const copy = [...prev]
                copy[i] = el
                return copy
              })
            }
            next={next}
          />
        )
      })}
    </div>
  )
}

function Card({
  card,
  index,
  tone,
  setRef,
  next,
}: {
  card: StackCardItem
  index: number
  tone: 1 | 2 | 3
  setRef: (el: HTMLDivElement | null) => void
  next: HTMLDivElement | null
}) {
  const reduce = useReducedMotion()
  const container = useChapterScroll()
  // Fixed for this mount: the parent remounts the card once the next card exists.
  const [nextRef] = useState(() => ({ current: next }))
  const { scrollYProgress } = useScroll(
    next
      ? {
          target: nextRef,
          container: container ?? undefined,
          offset: ['start end', 'start start'],
        }
      : undefined,
  )
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.05])
  return (
    <motion.div
      ref={setRef}
      className={`stk__card stk__card--${tone}`}
      style={{ '--i': index } as CSSProperties}
    >
      <div className="stk__text">
        <span className="stk__eyebrow" style={card.accent ? { color: card.accent } : undefined}>
          {card.eyebrow}
        </span>
        <p className="stk__title">{card.title}</p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="stk__photo" src={card.photo} alt={card.alt} />
      {!reduce && next && (
        <motion.span className="stk__shade" style={{ opacity: dim }} aria-hidden="true" />
      )}
    </motion.div>
  )
}
