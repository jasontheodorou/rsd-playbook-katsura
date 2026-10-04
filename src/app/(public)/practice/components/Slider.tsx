'use client'

import { useId, useState } from 'react'

import { useHydrated } from '../progress'
import { Frame } from './Frame'

type Stop = { label: string; state: string; value?: number; valueLabel?: string }
export type SliderProps = {
  label: string
  ends: [string, string]
  stops: Stop[]
  lesson: string
  picture?: 'crowd' | 'letter'
}

/**
 * Slider: one position per stop. Moving it shows the stop's label and state, updates the picture
 * and the value, and the lesson appears once the last stop is reached. The picture is chosen from
 * the data: values out of 100 draw a crowd, values per 1,000 letters draw a letter and a counter.
 */
export function Slider(props: SliderProps) {
  const { label, ends, stops, lesson } = props
  const hydrated = useHydrated()
  const [i, setI] = useState(0)
  const [reached, setReached] = useState(false)
  const id = useId()
  const picture = props.picture ?? (stops.some((s) => (s.value ?? 0) > 100) ? 'letter' : 'crowd')

  if (!hydrated)
    return (
      <Frame kind="slider" label={label} note="Illustrative figures.">
        <ol className="pc-plain">
          {stops.map((s) => (
            <li key={s.label}>
              <strong>{s.label}.</strong> {s.state} {s.valueLabel && <em>{s.valueLabel}.</em>}
            </li>
          ))}
        </ol>
        <p className="pc-ix__lesson">{lesson}</p>
      </Frame>
    )

  const stop = stops[i]
  const move = (n: number) => {
    setI(n)
    if (n === stops.length - 1) setReached(true)
  }
  return (
    <Frame kind="slider" label={label} note="Illustrative figures." className="pc-slider">
      <div className="pc-slider__picture" aria-hidden>
        {picture === 'crowd' ? (
          <Crowd step={i} value={stop.value ?? 0} stops={stops} />
        ) : (
          <Letter step={i} stops={stops} />
        )}
      </div>
      <div className="pc-slider__control">
        <input
          id={id}
          type="range"
          min={0}
          max={stops.length - 1}
          step={1}
          value={i}
          onChange={(e) => move(Number(e.target.value))}
          aria-label={label}
          aria-valuetext={stop.label}
          style={{ ['--pct' as string]: `${(i / (stops.length - 1)) * 100}%` }}
        />
        <div className="pc-slider__ends" aria-hidden>
          <span>{ends[0]}</span>
          <span>{ends[1]}</span>
        </div>
      </div>
      <div className="pc-slider__state" aria-live="polite">
        <p className="pc-slider__stop">
          <strong>{stop.label}</strong>
          {stop.valueLabel && <span className="pc-slider__value">{stop.valueLabel}</span>}
        </p>
        <p>{stop.state}</p>
      </div>
      {reached && <p className="pc-ix__lesson">{lesson}</p>}
    </Frame>
  )
}

/* The crowd: 100 small figures, the served ones filled. The people the first stop leaves out are
   read from its state ("… cannot use it: a wheelchair user, someone who …"), placed at the crowd's
   edges and labelled in the key; each fills at the first stop whose state mentions them. */
const AT = [0, 19, 40, 80, 99, 59, 20, 39, 60, 79]
function edgesFrom(stops: Stop[]) {
  const list = stops[0].state.split(/cannot use it:\s*/)[1]?.replace(/\.$/, '') ?? ''
  const names = list
    .split(/,\s*(?:and\s+)?|\s+and\s+/)
    .map((x) => x.trim())
    .filter(Boolean)
  return names.map((name, k) => {
    const keys = name
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((w) => w.length >= 5 && w !== 'someone')
    const from = stops.findIndex(
      (st, j) => j > 0 && keys.some((w) => st.state.toLowerCase().includes(w)),
    )
    const label = name.replace(/^(a|an)\s+/i, '')
    return {
      at: AT[k],
      name: label.charAt(0).toUpperCase() + label.slice(1),
      from: from < 0 ? stops.length : from,
    }
  })
}
function Crowd({ step, value, stops }: { step: number; value: number; stops: Stop[] }) {
  const EDGE = edgesFrom(stops)
  const edge = new Map(EDGE.map((e, k) => [e.at, { ...e, k: k + 1 }]))
  // Fill the middle of the crowd first, then outwards: everyone served who is not an edge figure.
  const servedEdges = EDGE.filter((e) => step >= e.from).length
  let middle = value - servedEdges
  const dist = (n: number) => Math.abs((n % 20) - 9.5) + Math.abs(Math.floor(n / 20) - 2)
  const order = Array.from({ length: 100 }, (_, n) => n)
    .filter((n) => !edge.has(n))
    .sort((x, y) => dist(x) - dist(y))
  const filled = new Set<number>()
  for (const n of order) if (middle-- > 0) filled.add(n)
  return (
    <div className="pc-crowd">
      <div className="pc-crowd__grid">
        {Array.from({ length: 100 }, (_, n) => {
          const e = edge.get(n)
          const on = e ? step >= e.from : filled.has(n)
          return (
            <span key={n} className="pc-person" data-on={on} data-edge={Boolean(e)}>
              <svg viewBox="0 0 10 14">
                <circle cx="5" cy="3" r="2.6" />
                <path d="M1 14v-4.2a4 4 0 0 1 8 0V14z" />
              </svg>
              {e && <b>{e.k}</b>}
            </span>
          )
        })}
      </div>
      <ol className="pc-crowd__key">
        {EDGE.map((e, k) => (
          <li key={e.name} data-on={step >= e.from}>
            <b>{k + 1}</b> {e.name}
          </li>
        ))}
      </ol>
    </div>
  )
}

/* The letter: a sheet that gets clearer at each stop, beside a helpline counter. Its first line is
   the words the stop quotes (the subject line, or the new wording), taken from the stop's state. */
const quoted = (state: string) => {
  const subject = state.match(/Subject: '([^']+)'/)
  if (subject) return subject[1]
  const all = [...state.matchAll(/'([^']+)'/g)]
  return all.at(-1)?.[1]
}
function Letter({ step, stops }: { step: number; stops: Stop[] }) {
  const stop = stops[step]
  const clutter = stops.length - 1 - step
  const first =
    stops
      .slice(0, step + 1)
      .map((s) => quoted(s.state))
      .filter(Boolean)
      .at(-1) ?? stop.label
  return (
    <div className="pc-letter">
      <div className="pc-letter__sheet">
        <p className="pc-letter__subject">{first}</p>
        {Array.from({ length: 3 + clutter * 2 }, (_, k) => (
          <span key={k} className="pc-letter__line" style={{ width: `${92 - ((k * 13) % 30)}%` }} />
        ))}
        {step === stops.length - 1 && <span className="pc-letter__button" />}
      </div>
      <div className="pc-letter__calls">
        <span className="pc-letter__count">{stop.value}</span>
        <span>{stop.valueLabel?.replace(/^\d[\d,]*\s*/, '')}</span>
      </div>
    </div>
  )
}
