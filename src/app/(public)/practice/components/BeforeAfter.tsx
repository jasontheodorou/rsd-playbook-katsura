'use client'

import { useId, useState } from 'react'

import { useHydrated } from '../progress'
import { Frame } from './Frame'

type Side = { title: string; content: string }
export type BeforeProps = { label: string; before: Side; after: Side; notes: string[] }

/**
 * Before and after: a two-option radio group swaps the example; the notes stay put. The examples
 * are real form fields (a date of birth with its year missing), so screen readers hear the actual
 * messages. The field and message are read from each side's description.
 */
export function BeforeAfter({ label, before, after, notes }: BeforeProps) {
  const hydrated = useHydrated()
  const [side, setSide] = useState<'before' | 'after'>('before')
  const name = useId()
  const notesList = (
    <>
      <p className="pc-before__notes-label">What changed</p>
      <ul className="pc-before__notes">
        {notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </>
  )
  if (!hydrated)
    return (
      <Frame kind="before" label={label}>
        <h4>{before.title}</h4>
        <p>{before.content}</p>
        <DateExample which="before" side={before} />
        <h4>{after.title}</h4>
        <p>{after.content}</p>
        <DateExample which="after" side={after} />
        {notesList}
      </Frame>
    )
  const s = side === 'before' ? before : after
  return (
    <Frame kind="before" label={label} className="pc-before">
      <div className="pc-toggle" role="radiogroup" aria-label="Show the example">
        {(['before', 'after'] as const).map((k) => (
          <label key={k} className="pc-toggle__option" data-on={side === k}>
            <input type="radio" name={name} checked={side === k} onChange={() => setSide(k)} />
            {(k === 'before' ? before : after).title}
          </label>
        ))}
      </div>
      <div className="pc-before__example">
        <p className="pc-before__desc">{s.content}</p>
        <DateExample which={side} side={s} />
      </div>
      {notesList}
    </Frame>
  )
}

/* The example field itself: the message is the quoted text in the description ('Invalid input.'
   or 'Date of birth must include a year.'), shown under the field before and above it after. */
function DateExample({ which, side }: { which: 'before' | 'after'; side: Side }) {
  const id = useId()
  const message = side.content.match(/'([^']+)'/)?.[1] ?? ''
  const msg = (
    <p id={`${id}-msg`} className={`pc-date__msg pc-date__msg--${which}`}>
      {which === 'after' && <span className="pc-hidden">Error: </span>}
      {message}
    </p>
  )
  return (
    <div
      className="pc-date"
      data-which={which}
      role="group"
      aria-label={`Example ${which === 'before' ? 'before' : 'after'} the change`}
    >
      <p className="pc-date__legend">Date of birth</p>
      {which === 'after' && msg}
      <div className="pc-date__fields">
        {[
          ['Day', '14'],
          ['Month', '3'],
          ['Year', ''],
        ].map(([l, v]) => (
          <label key={l}>
            <span>{l}</span>
            <input
              readOnly
              value={v}
              aria-describedby={`${id}-msg`}
              aria-invalid={l === 'Year'}
              data-bad={l === 'Year'}
            />
          </label>
        ))}
      </div>
      {which === 'before' && msg}
    </div>
  )
}
