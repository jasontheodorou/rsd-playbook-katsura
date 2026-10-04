'use client'

import { useId, useState } from 'react'

import { useHydrated } from '../progress'
import { Frame } from './Frame'

export type CheckProps = {
  question: string
  multiple: boolean
  options: { text: string; correct: boolean; feedback: string }[]
  after?: string
}

/**
 * Quick check: choose one option (or several), then Check. Each chosen option shows its feedback
 * with a word and an icon; Try again clears. After a correct answer, the after text appears.
 */
export function QuickCheck({ question, multiple, options, after }: CheckProps) {
  const hydrated = useHydrated()
  const name = useId()
  const [chosen, setChosen] = useState<number[]>([])
  const [checked, setChecked] = useState(false)
  const [solved, setSolved] = useState(false)

  if (!hydrated)
    return (
      <Frame kind="check" label="Quick check">
        <p className="pc-check__q">{question}</p>
        <ul className="pc-plain">
          {options.map((o) => (
            <li key={o.text}>
              {o.text} <strong>{o.correct ? 'Right.' : 'Not quite.'}</strong> {o.feedback}
            </li>
          ))}
        </ul>
        {after && <p className="pc-ix__lesson">{after}</p>}
      </Frame>
    )

  const right = options.flatMap((o, k) => (o.correct ? [k] : []))
  const allRight = chosen.length === right.length && chosen.every((k) => options[k].correct)
  const someRight = chosen.some((k) => options[k].correct)
  const verdict = allRight ? 'Correct' : someRight && multiple ? 'Partly right' : 'Not quite'
  const toggle = (k: number) => {
    if (checked) return
    setChosen((c) => (multiple ? (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]) : [k]))
  }
  const check = () => {
    setChecked(true)
    if (allRight) setSolved(true)
  }
  return (
    <Frame kind="check" label="Quick check" className="pc-check">
      <fieldset className="pc-check__set">
        <legend className="pc-check__q">{question}</legend>
        {options.map((o, k) => {
          const on = chosen.includes(k)
          const state = checked && on ? (o.correct ? 'right' : 'wrong') : undefined
          return (
            <div key={o.text} className="pc-check__option" data-state={state}>
              <label>
                <input
                  type={multiple ? 'checkbox' : 'radio'}
                  name={name}
                  checked={on}
                  disabled={checked}
                  onChange={() => toggle(k)}
                />
                <span>{o.text}</span>
              </label>
              {state && (
                <p className="pc-check__feedback">
                  <Mark right={state === 'right'} />
                  <strong>{state === 'right' ? 'Right.' : 'Not quite.'}</strong> {o.feedback}
                </p>
              )}
            </div>
          )
        })}
      </fieldset>
      <div aria-live="polite">
        {checked && (
          <p className="pc-check__verdict" data-right={allRight}>
            {verdict}
          </p>
        )}
      </div>
      <div className="pc-actions">
        {!checked ? (
          <button
            type="button"
            className="pc-button pc-button--primary"
            disabled={!chosen.length}
            onClick={check}
          >
            Check
          </button>
        ) : (
          !allRight && (
            <button
              type="button"
              className="pc-button"
              onClick={() => {
                setChosen([])
                setChecked(false)
              }}
            >
              Try again
            </button>
          )
        )}
      </div>
      {solved && after && <p className="pc-ix__lesson">{after}</p>}
    </Frame>
  )
}

/** Right and wrong, as an icon beside the word (never colour alone). */
export function Mark({ right }: { right: boolean }) {
  return (
    <svg className="pc-mark" data-right={right} viewBox="0 0 20 20" aria-hidden>
      <circle cx="10" cy="10" r="10" />
      {right ? <path d="M6 10.4l2.6 2.6L14 7.4" /> : <path d="M7 7l6 6M13 7l-6 6" />}
    </svg>
  )
}
