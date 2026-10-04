'use client'

import { useState } from 'react'

import { useHydrated } from '../progress'
import { Frame } from './Frame'

type Verdict = 'best' | 'risky' | 'wrong'
export type ChooseProps = {
  setup: string
  prompt: string
  options: { text: string; outcome: string; verdict: Verdict }[]
  lesson: string
}
const WORD: Record<Verdict, string> = { best: 'Best', risky: 'Risky', wrong: 'Wrong' }

/** Choose and see: each option plays out its outcome; once the best one has been seen, the lesson appears. */
export function ChooseSee({ setup, prompt, options, lesson }: ChooseProps) {
  const hydrated = useHydrated()
  const [open, setOpen] = useState<number | null>(null)
  const [seenBest, setSeenBest] = useState(false)
  if (!hydrated)
    return (
      <Frame kind="choose" label="What would you do?">
        <p>{setup}</p>
        <p className="pc-check__q">{prompt}</p>
        <ul className="pc-plain">
          {options.map((o) => (
            <li key={o.text}>
              {o.text} <strong>{WORD[o.verdict]}.</strong> {o.outcome}
            </li>
          ))}
        </ul>
        <p className="pc-ix__lesson">{lesson}</p>
      </Frame>
    )
  const choose = (k: number) => {
    setOpen(k)
    if (options[k].verdict === 'best') setSeenBest(true)
  }
  const o = open === null ? null : options[open]
  return (
    <Frame kind="choose" label="What would you do?" className="pc-choose">
      <p>{setup}</p>
      <p className="pc-check__q">{prompt}</p>
      <ul className="pc-choose__options">
        {options.map((x, k) => (
          <li key={x.text}>
            <button
              type="button"
              className="pc-choose__option"
              aria-pressed={open === k}
              onClick={() => choose(k)}
            >
              {x.text}
            </button>
          </li>
        ))}
      </ul>
      <div className="pc-choose__outcome" aria-live="polite">
        {o && (
          <p data-verdict={o.verdict}>
            <span className="pc-verdict">{WORD[o.verdict]}</span> {o.outcome}
          </p>
        )}
      </div>
      {seenBest && <p className="pc-ix__lesson">{lesson}</p>}
    </Frame>
  )
}
