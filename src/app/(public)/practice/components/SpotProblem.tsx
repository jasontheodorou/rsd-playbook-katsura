'use client'

import { useState, type ReactNode } from 'react'

import { useHydrated } from '../progress'
import { Frame } from './Frame'

type Hotspot = {
  id: string
  label: string
  problem: string
  excludes: string
  fix: string
  ref?: string
}
export type SpotProps = { label: string; scene: string; hotspots: Hotspot[] }

/**
 * Spot the problem: a mock screen built in HTML with its faults really present. Each fault is a
 * button over its part of the screen; pressing one marks it found and opens its note under the
 * scene. "Found 2 of 6" counts them, and Show all reveals the rest at any point.
 */
export function SpotProblem({ label, scene, hotspots }: SpotProps) {
  const hydrated = useHydrated()
  const [found, setFound] = useState<string[]>([])
  const note = (h: Hotspot) => (
    <>
      <p>
        <strong>Problem:</strong> {h.problem}
      </p>
      <p>
        <strong>Who it excludes:</strong> {h.excludes}
      </p>
      <p>
        <strong>Fix:</strong> {h.fix}
      </p>
      {h.ref && <p className="pc-spot__ref">{h.ref}</p>}
    </>
  )
  if (!hydrated)
    return (
      <Frame kind="spot" label={label}>
        <p>{scene}</p>
        <ol className="pc-plain">
          {hotspots.map((h) => (
            <li key={h.id}>
              <strong>{h.label}.</strong>
              {note(h)}
            </li>
          ))}
        </ol>
      </Frame>
    )
  const hot = (id: string, children: ReactNode, wide = false) => {
    const h = hotspots.find((x) => x.id === id)
    if (!h) return children
    const isFound = found.includes(id)
    return (
      <div className="pc-spot__part" data-wide={wide}>
        {children}
        <button
          type="button"
          className="pc-spot__hot"
          data-found={isFound}
          aria-label={`Problem: ${h.label}`}
          aria-pressed={isFound}
          onClick={() => !isFound && setFound((f) => [...f, id])}
        >
          {isFound && <span className="pc-spot__badge">{hotspots.indexOf(h) + 1}</span>}
        </button>
      </div>
    )
  }
  const title = scene.match(/'([^']+)'/)?.[1] ?? label
  const q = (id: string) => hotspots.find((h) => h.id === id)
  // A fault's words on the mock screen: the label's own quote ('Enter your VRM'), else the quote in its problem.
  const quoted = (id: string) =>
    q(id)?.label.match(/'([^']+)'/)?.[1] ?? q(id)?.problem.match(/'([^']+)'/)?.[1] ?? ''
  return (
    <Frame kind="spot" label={label} className="pc-spot">
      <p className="pc-ix__how">
        This is an example of a form with problems. Find the barriers in it.
      </p>
      <div className="pc-spot__frame" role="group" aria-label="Example of a form with problems">
        <p className="pc-spot__frame-label" aria-hidden>
          Example of a form with problems
        </p>
        <div className="pc-mock">
          {hot('h5', <p className="pc-mock__timeout">{quoted('h5')}</p>, true)}
          <p className="pc-mock__title">{title}</p>
          <div className="pc-mock__field">
            {hot('h4', <p className="pc-mock__label">{quoted('h4')}</p>)}
            {hot('h3', <div className="pc-mock__input pc-mock__input--red" />)}
          </div>
          {hot(
            'h1',
            <div className="pc-mock__field">
              <div className="pc-mock__input">
                <span className="pc-mock__placeholder">Date you want the permit to start</span>
              </div>
            </div>,
          )}
          {hot('h2', <p className="pc-mock__pale">Check your answers before you continue.</p>)}
          {hot('h6', <p className="pc-mock__continue">Continue</p>)}
        </div>
      </div>
      <div className="pc-actions">
        <span className="pc-actions__count" aria-live="polite">
          Found {found.length} of {hotspots.length}
        </span>
        {found.length < hotspots.length && (
          <button
            type="button"
            className="pc-button"
            onClick={() => setFound(hotspots.map((h) => h.id))}
          >
            Show all
          </button>
        )}
      </div>
      {found.length > 0 && (
        <ol className="pc-spot__notes">
          {hotspots
            .filter((h) => found.includes(h.id))
            .map((h) => (
              <li key={h.id} value={hotspots.indexOf(h) + 1}>
                <p className="pc-spot__name">{h.label}</p>
                {note(h)}
              </li>
            ))}
        </ol>
      )}
    </Frame>
  )
}
