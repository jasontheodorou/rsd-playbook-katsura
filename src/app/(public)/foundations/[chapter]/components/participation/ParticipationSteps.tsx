'use client'

import { useRef, useState, type KeyboardEvent } from 'react'

import type { JourneyStep } from '../Journey'
import './participation.css'

/*
 * The participation model's explainer (2 October 2026): tabs in the T-shaped tabs' style, one step
 * at a time, further down the page than the model itself. Not linked to the model: linking them, so
 * a click on one set off the other, was tried and found too jarring. Every panel is in the page, in
 * one grid cell, so the box is as tall as the longest and nothing below it moves. Each panel has a
 * small reminder of its step's drawing on the right: the drawing on a white card with a soft yellow
 * plane set off behind it, like katsura's photographs with their coloured plane (chosen by Jason from
 * three, 2 October 2026: swapped colours, offset plane, line only).
 */
export function ParticipationSteps({ label, steps }: { label: string; steps: JourneyStep[] }) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const [active, setActive] = useState(0)
  const choose = (i: number, focus = false) => {
    setActive(i)
    if (focus) tabs.current[i]?.focus()
  }
  const onKey = (e: KeyboardEvent) => {
    const last = steps.length - 1
    if (e.key === 'ArrowRight') choose(active === last ? 0 : active + 1, true)
    else if (e.key === 'ArrowLeft') choose(active === 0 ? last : active - 1, true)
    else if (e.key === 'Home') choose(0, true)
    else if (e.key === 'End') choose(last, true)
    else return
    e.preventDefault()
  }
  return (
    <div className="pm-tabs">
      <div className="pm-tabs__bar" role="tablist" aria-label={label} onKeyDown={onKey}>
        {steps.map((st, i) => (
          <button
            key={st.id}
            ref={(el) => {
              tabs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`pm-tab-${st.id}`}
            aria-selected={i === active}
            aria-controls={`pm-panel-${st.id}`}
            tabIndex={i === active ? 0 : -1}
            className="pm-tabs__tab"
            onClick={() => choose(i)}
          >
            {st.name}
          </button>
        ))}
      </div>
      <div className="pm-tabs__stage">
        {steps.map((st, i) => (
          <div
            key={st.id}
            id={`pm-panel-${st.id}`}
            role="tabpanel"
            aria-labelledby={`pm-tab-${st.id}`}
            aria-hidden={i !== active}
            data-on={i === active}
            className="pm-tabs__panel"
          >
            <div className="pm-tabs__copy">
              <h3>{st.name}</h3>
              <p className="pm-tabs__lead">{st.lead}</p>
              <p>{st.text}</p>
            </div>
            {/* A small reminder of the step's drawing from the model, on a white card with a soft
                yellow plane set off behind it. */}
            <div className="pm-tabs__art" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/illustrations/participation/${st.id}-tile.png`} alt="" draggable={false} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
