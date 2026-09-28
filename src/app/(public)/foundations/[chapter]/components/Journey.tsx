'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { createOnce } from '../page/once'
import './journey.css'

/**
 * Journey (chapter 06, How we deliver): a model of steps, such as the participation model's
 * Engage, Involve, Collaborate and Grow. One card in two zones, stacked: the steps in a row on a
 * tinted, ambient band, joined by a quiet line, and the chosen step's text on white below. The
 * steps are the only control; arrow keys move between them. The first step pulses on first view
 * until a reader chooses one, then never again. Every step's text is in the page.
 */
export type JourneyStep = { id: string; name: string; lead: string; text: string }

const prompt = createOnce('katsura:journey-used')

export function Journey({
  title,
  label,
  restTitle,
  restBody,
  steps,
}: {
  title?: string
  label: string
  restTitle: string
  restBody: string
  steps: JourneyStep[]
}) {
  const reduce = useReducedMotion()
  const used = prompt.useUsed()
  const [active, setActive] = useState<number | null>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  useEffect(() => {
    if (active !== null) prompt.mark()
  }, [active])
  const last = steps.length - 1
  const onKey = (e: KeyboardEvent, i: number) => {
    let next: number | null = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = i === last ? 0 : i + 1
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = i === 0 ? last : i - 1
    if (next === null) return
    e.preventDefault()
    buttons.current[next]?.focus()
  }
  const n = (i: number) => String(i + 1).padStart(2, '0')

  return (
    <div className="jy">
      <div className="jy__band">
        {title && <p className="jy__title">{title}</p>}
        <ol className="jy__steps" role="group" aria-label={label}>
          {steps.map((s, i) => (
            <motion.li
              key={s.id}
              className="jy__step"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.08 }}
            >
              <button
                ref={(el) => {
                  buttons.current[i] = el
                }}
                type="button"
                className="jy__button"
                aria-pressed={active === i}
                aria-controls="jy-reading"
                data-on={active === i}
                data-dim={active !== null && active !== i}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className="jy__dot">
                  {i === 0 && !used && active === null && !reduce && (
                    <span className="jy__pulse" aria-hidden="true" />
                  )}
                  {n(i)}
                </span>
                <span className="jy__name">{s.name}</span>
                <span className="jy__lead">{s.lead}</span>
              </button>
            </motion.li>
          ))}
        </ol>
      </div>
      <div id="jy-reading" className="jy__result" aria-live="polite">
        <div className="jy__passage" data-on={active === null} aria-hidden={active !== null}>
          <p className="jy__r-name">{restTitle}</p>
          <p className="jy__r-text">{restBody}</p>
        </div>
        {steps.map((s, i) => (
          <div key={s.id} className="jy__passage" data-on={active === i} aria-hidden={active !== i}>
            <p className="jy__r-name">
              {s.name}: {s.lead}
            </p>
            <p className="jy__r-text">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
