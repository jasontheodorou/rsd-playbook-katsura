'use client'

import { useState } from 'react'

import { useHydrated } from '../progress'
import { Frame } from './Frame'

export type StepProps = {
  label: string
  start: string
  steps: { button: string; text: string }[]
  end: string
}

/** Step through: each press adds the next step under the last, so the chain builds; Previous removes the last. */
export function StepThrough({ label, start, steps, end }: StepProps) {
  const hydrated = useHydrated()
  const [shown, setShown] = useState(0)
  if (!hydrated)
    return (
      <Frame kind="step" label={label}>
        <p className="pc-step__start">{start}</p>
        <ol className="pc-plain">
          {steps.map((s, k) => (
            <li key={k}>{s.text}</li>
          ))}
        </ol>
        <p className="pc-ix__lesson">{end}</p>
      </Frame>
    )
  const done = shown === steps.length
  return (
    <Frame kind="step" label={label} className="pc-step">
      <ol className="pc-step__chain">
        <li className="pc-step__link" data-start>
          {start}
        </li>
        {steps.slice(0, shown).map((s, k) => (
          <li key={k} className="pc-step__link">
            <span className="pc-step__why">{s.button}</span>
            {s.text}
          </li>
        ))}
      </ol>
      <p className="pc-hidden" aria-live="polite">
        {shown > 0 ? steps[shown - 1].text : ''}
      </p>
      <div className="pc-actions">
        {!done && (
          <button
            type="button"
            className="pc-button pc-button--primary"
            onClick={() => setShown(shown + 1)}
          >
            {steps[shown].button}
          </button>
        )}
        {shown > 0 && (
          <button type="button" className="pc-button" onClick={() => setShown(shown - 1)}>
            Previous
          </button>
        )}
        <span className="pc-actions__count">
          {shown} of {steps.length}
        </span>
      </div>
      {done && <p className="pc-ix__lesson">{end}</p>}
    </Frame>
  )
}
