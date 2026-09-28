'use client'

import { MaskHappy, Question, Repeat, Scales, type Icon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState, useSyncExternalStore, type CSSProperties } from 'react'

import './balance.css'

/**
 * Balance: a set of sliders, each from a failure to good practice. Handles start near the failure
 * end; sliding one past the middle brightens its row and reveals the passage behind it. Refined
 * pattern standard (docs/DESIGN-RULES.md): frosted rows over very soft washes in the chapter's
 * colour, a slate accent, light Phosphor icons. Built on native range inputs, so it works with the
 * keyboard and screen readers; without JavaScript it is a plain list.
 */
export type BalanceItem = {
  id: string
  icon: 'question' | 'repeat' | 'mask' | 'scales'
  lead: string
  body: string
  /** The failure end and the good-practice end of the balance slider, from the watch-out's words. */
  from: string
  to: string
  /** A one- or two-word label under the scrubber's stop. */
  short: string
}

const ICONS: Record<BalanceItem['icon'], Icon> = {
  question: Question,
  repeat: Repeat,
  mask: MaskHappy,
  scales: Scales,
}

const noop = () => () => {}
const useEnhanced = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/** Without JavaScript, both options are the same honest list. */
function Static({ items }: { items: BalanceItem[] }) {
  return (
    <ul className="sl-static">
      {items.map((w) => {
        const I = ICONS[w.icon]
        return (
          <li key={w.id}>
            <I size={28} weight="light" aria-hidden="true" />
            <p>
              <strong>{w.lead}</strong> {w.body}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

/* 2. Balance: four sliders, each from a failure to good practice. Past the middle, the watch-out shows. */
export function Balance({
  items,
  washes = ['#f1dc93', '#eadfcf'],
  prompt = 'Move each one towards good practice',
}: {
  items: BalanceItem[]
  washes?: [string, string]
  /** The line above the sliders, telling the reader what to do. */
  prompt?: string
}) {
  const enhanced = useEnhanced()
  const reduce = useReducedMotion()
  const [values, setValues] = useState<number[]>(() => items.map(() => 12))
  if (!enhanced) return <Static items={items} />
  const balanced = values.filter((v) => v >= 50).length
  return (
    <div
      className="sl sl2"
      style={{ '--wash-a': washes[0], '--wash-b': washes[1] } as CSSProperties}
    >
      <span className="sl__washes" aria-hidden="true">
        <span />
        <span />
      </span>
      <motion.div
        className="sl2__head"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <p className="sl2__title">{prompt}</p>
        <p className="sl2__count" aria-live="polite">
          {balanced} of {items.length} in balance
        </p>
      </motion.div>
      <ul className="sl2__rows">
        {items.map((w, k) => {
          const v = values[k]
          const good = v >= 50
          const I = ICONS[w.icon]
          return (
            <motion.li
              key={w.id}
              className="sl2__row"
              data-good={good}
              // Fades in once as it scrolls into view, one row after another, as the diagram's tiles do.
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.05 + k * 0.05 }}
            >
              <div className="sl2__line">
                <span className="sl__icon sl__icon--small">
                  <I size={22} weight={good ? 'regular' : 'light'} aria-hidden="true" />
                </span>
                <span className="sl2__end sl2__end--from">{w.from}</span>
                <div className="sl2__track" style={{ '--v': `${v}%` } as CSSProperties}>
                  <span className="sl2__fill" aria-hidden="true" />
                  <span className="sl2__mid" aria-hidden="true" />
                  <input
                    className="sl2__range"
                    type="range"
                    min={0}
                    max={100}
                    value={v}
                    aria-label={`${w.lead} From ${w.from} to ${w.to}`}
                    aria-valuetext={good ? `${w.to}` : `${w.from}`}
                    onChange={(e) => {
                      const next = [...values]
                      next[k] = Number(e.target.value)
                      setValues(next)
                    }}
                  />
                </div>
                <span className="sl2__end sl2__end--to">{w.to}</span>
              </div>
              <AnimatePresence initial={false}>
                {good && (
                  <motion.div
                    className="sl2__reveal"
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.3, ease: EASE },
                      opacity: { duration: 0.25, delay: 0.1 },
                    }}
                  >
                    <p className="sl__body">
                      <strong>{w.lead}</strong> {w.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
