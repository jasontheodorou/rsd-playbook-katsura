'use client'

import { useEffect, useMemo, useState } from 'react'

import { useHydrated } from '../progress'
import { Frame } from './Frame'

type Item = { id: string; text: string }
export type MatchProps = {
  label: string
  left: Item[]
  right: Item[]
  pairs: { left: string; right: string; why: string }[]
  summary?: string
}

/** A fixed shuffle: the same order on every visit, worked out from the items' ids. */
function shuffled<T extends { id: string }>(xs: T[]) {
  let seed = [...xs.map((x) => x.id).join('')].reduce(
    (h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0,
    7,
  )
  const rand = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32
  const out = [...xs]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Match: choose an item on the left, then its partner on the right. A correct pair locks and shows
 * why; a wrong pair shakes once and clears. When all are matched, the summary line appears.
 */
export function Match({ label, left, right, pairs, summary }: MatchProps) {
  const hydrated = useHydrated()
  const rightOrder = useMemo(() => shuffled(right), [right])
  const [picked, setPicked] = useState<string | null>(null)
  const [made, setMade] = useState<string[]>([])
  const [wrong, setWrong] = useState<string | null>(null)
  const [said, setSaid] = useState('')

  useEffect(() => {
    if (!picked) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPicked(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [picked])

  const text = (xs: Item[], id: string) => xs.find((x) => x.id === id)?.text ?? ''

  if (!hydrated)
    return (
      <Frame kind="match" label={label}>
        <table className="pc-table">
          <thead>
            <tr>
              <th scope="col">Commitment</th>
              <th scope="col">Standard</th>
              <th scope="col">Why</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((p) => (
              <tr key={p.left}>
                <td>{text(left, p.left)}</td>
                <td>{text(right, p.right)}</td>
                <td>{p.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {summary && <p className="pc-ix__lesson">{summary}</p>}
      </Frame>
    )

  const isMade = (side: 'left' | 'right', id: string) =>
    made.some((l) => pairs.find((p) => p.left === l)?.[side] === id)
  const chooseRight = (id: string) => {
    if (!picked) return
    const pair = pairs.find((p) => p.left === picked)
    if (pair?.right === id) {
      setMade((m) => [...m, picked])
      setSaid(`Matched: ${text(left, picked)} with ${text(right, id)}. ${pair.why}`)
    } else {
      setWrong(id)
      setSaid(`Not a match: ${text(left, picked)} and ${text(right, id)}. Try another.`)
      window.setTimeout(() => setWrong(null), 450)
    }
    setPicked(null)
  }
  const all = made.length === pairs.length
  return (
    <Frame kind="match" label={label} className="pc-match">
      <p className="pc-ix__how">Choose a commitment, then the standard it becomes.</p>
      <div className="pc-match__cols">
        <ul className="pc-match__col" aria-label="Commitments">
          {left.map((x) => (
            <li key={x.id}>
              <button
                type="button"
                className="pc-match__item"
                aria-pressed={picked === x.id}
                data-made={isMade('left', x.id)}
                disabled={isMade('left', x.id)}
                onClick={() => setPicked(picked === x.id ? null : x.id)}
              >
                {x.text}
              </button>
            </li>
          ))}
        </ul>
        <ul className="pc-match__col" aria-label="Standards">
          {rightOrder.map((x) => (
            <li key={x.id}>
              <button
                type="button"
                className="pc-match__item"
                data-made={isMade('right', x.id)}
                data-wrong={wrong === x.id}
                disabled={isMade('right', x.id) || !picked}
                onClick={() => chooseRight(x.id)}
              >
                {x.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="pc-hidden" aria-live="polite">
        {said}
      </p>
      {made.length > 0 && (
        <ol className="pc-match__made">
          {made.map((l) => {
            const p = pairs.find((x) => x.left === l)!
            return (
              <li key={l}>
                <strong>
                  {text(left, p.left)} → {text(right, p.right)}
                </strong>
                <span>{p.why}</span>
              </li>
            )
          })}
        </ol>
      )}
      {all && summary && <p className="pc-ix__lesson">{summary}</p>}
    </Frame>
  )
}
