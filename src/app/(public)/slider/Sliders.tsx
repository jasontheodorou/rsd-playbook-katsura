'use client'

import { MaskHappy, Question, Repeat, Scales, type Icon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useId, useState, useSyncExternalStore, type CSSProperties } from 'react'

import type { WatchOut } from './data'

const ICONS: Record<WatchOut['icon'], Icon> = {
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
const n = (i: number) => String(i + 1).padStart(2, '0')

/** Without JavaScript, both options are the same honest list. */
function Static({ items }: { items: WatchOut[] }) {
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

/* 1. Scrubber: one track, four stops, a panel that shows the chosen watch-out. */
export function Scrubber({
  items,
  washes = ['#f1dc93', '#eadfcf'],
}: {
  items: WatchOut[]
  washes?: [string, string]
}) {
  const enhanced = useEnhanced()
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)
  const id = useId()
  if (!enhanced) return <Static items={items} />
  const i = Math.round(value)
  const w = items[i]
  const I = ICONS[w.icon]
  const pct = (value / (items.length - 1)) * 100
  return (
    <div
      className="sl sl1"
      style={{ '--wash-a': washes[0], '--wash-b': washes[1] } as CSSProperties}
    >
      <span className="sl__washes" aria-hidden="true">
        <span />
        <span />
      </span>
      <div className="sl1__panel" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={w.id}
            className="sl1__content"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <span className="sl__icon">
              <I size={30} weight="light" aria-hidden="true" />
            </span>
            <span className="sl__count">
              Watch-out {n(i)} of {String(items.length).padStart(2, '0')}
            </span>
            <p className="sl__lead">{w.lead}</p>
            <p className="sl__body">{w.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="sl1__control">
        <div className="sl1__rail" aria-hidden="true">
          <span className="sl1__fill" style={{ width: `${pct}%` }} />
          {items.map((it, k) => (
            <span
              key={it.id}
              className="sl1__stop"
              data-on={k <= i}
              style={{ left: `${(k / (items.length - 1)) * 100}%` }}
            />
          ))}
        </div>
        <input
          id={id}
          className="sl1__range"
          type="range"
          min={0}
          max={items.length - 1}
          step={0.01}
          value={value}
          aria-label="Design watch-outs"
          aria-valuetext={`${n(i)}: ${w.lead}`}
          onChange={(e) => setValue(Number(e.target.value))}
          onPointerUp={() => setValue(Math.round(value))}
          onBlur={() => setValue(Math.round(value))}
          onKeyDown={(e) => {
            // Arrow keys move a whole stop; dragging stays smooth.
            const last = items.length - 1
            const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key]
            if (step !== undefined) {
              e.preventDefault()
              setValue(Math.min(last, Math.max(0, Math.round(value) + step)))
            } else if (e.key === 'Home' || e.key === 'End') {
              e.preventDefault()
              setValue(e.key === 'Home' ? 0 : last)
            }
          }}
        />
        <div className="sl1__labels" aria-hidden="true">
          {items.map((it, k) => {
            const LI = ICONS[it.icon]
            return (
              <button
                key={it.id}
                type="button"
                tabIndex={-1}
                className="sl1__label"
                data-on={k === i}
                style={{ left: `${(k / (items.length - 1)) * 100}%` }}
                onClick={() => setValue(k)}
              >
                <LI size={18} weight={k === i ? 'regular' : 'light'} />
                <span>{it.short}</span>
              </button>
            )
          })}
        </div>
        <p className="sl__hint">Slide to see each watch-out</p>
      </div>
    </div>
  )
}

/* 2. Balance: four sliders, each from a failure to good practice. Past the middle, the watch-out shows. */
export function Balance({
  items,
  washes = ['#f1dc93', '#eadfcf'],
  compact = false,
}: {
  items: WatchOut[]
  washes?: [string, string]
  /** Simpler, smaller, subtler: no icons, no row cards, a thin track, the text column's width. */
  compact?: boolean
}) {
  const enhanced = useEnhanced()
  const reduce = useReducedMotion()
  const [values, setValues] = useState<number[]>(() => items.map(() => 12))
  if (!enhanced) return <Static items={items} />
  const balanced = values.filter((v) => v >= 50).length
  return (
    <div
      className={`sl sl2${compact ? ' sl2--compact' : ''}`}
      style={{ '--wash-a': washes[0], '--wash-b': washes[1] } as CSSProperties}
    >
      {!compact && (
        <span className="sl__washes" aria-hidden="true">
          <span />
          <span />
        </span>
      )}
      <div className="sl2__head">
        <p className="sl2__title">
          {compact ? 'Slide each towards good practice' : 'Move each one towards good practice'}
        </p>
        <p className="sl2__count" aria-live="polite">
          {balanced} of {items.length} in balance
        </p>
      </div>
      <ul className="sl2__rows">
        {items.map((w, k) => {
          const v = values[k]
          const good = v >= 50
          const I = ICONS[w.icon]
          return (
            <li key={w.id} className="sl2__row" data-good={good}>
              <div className="sl2__line">
                {!compact && (
                  <span className="sl__icon sl__icon--small">
                    <I size={22} weight={good ? 'regular' : 'light'} aria-hidden="true" />
                  </span>
                )}
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
            </li>
          )
        })}
      </ul>
    </div>
  )
}
