// Ported from the-rsd-playbook src/pathway1/HeadHeartHandsPattern.tsx.
'use client'

import { useState } from 'react'

export type HeadHeartHandsKey = 'head' | 'heart' | 'hands'

type Panel = {
  key: HeadHeartHandsKey
  title: string
  image: string
  alt: string
  icon: string
}

export type HeadHeartHandsPatternProps = {
  initialActive?: HeadHeartHandsKey
  className?: string
}

const PANELS: Panel[] = [
  {
    key: 'head',
    title: 'Head',
    image: '/photos/head-flipchart.jpg',
    alt: 'Three colleagues sketching a diagram together at a flipchart — thinking made visible.',
    icon: '/photos/hhh/head-icon.png',
  },
  {
    key: 'heart',
    title: 'Heart',
    image: '/photos/journey-map-group.jpg',
    alt: 'A diverse group sharing a hand-drawn journey map — care and human-centredness.',
    icon: '/photos/hhh/heart-icon.png',
  },
  {
    key: 'hands',
    title: 'Hands',
    image: '/photos/lego-prototyping.jpg',
    alt: 'Hands assembling with Lego bricks — turning ideas into things.',
    icon: '/photos/hhh/hands-icon.png',
  },
]

/**
 * Head / Heart / Hands — three side-by-side panels in a fixed 16:9 frame.
 * One is active and expands to ~60% of the row, revealing its full-colour
 * photograph. The others show a deliberately minimal line drawing.
 * Clicking a dormant panel promotes it. Respects prefers-reduced-motion.
 */
export default function HeadHeartHandsPattern({
  initialActive = 'heart',
  className = '',
}: HeadHeartHandsPatternProps) {
  const [active, setActive] = useState<HeadHeartHandsKey>(initialActive)

  return (
    <section
      className={`hhh-pattern ${className}`.trim()}
      aria-label="Head, Heart and Hands interactive visual"
    >
      <div className="hhh-frame">
        {PANELS.map((panel) => {
          const isActive = active === panel.key
          return (
            <button
              key={panel.key}
              type="button"
              className={`hhh-panel hhh-panel--${panel.key}`}
              data-active={isActive ? 'true' : 'false'}
              aria-pressed={isActive}
              onClick={() => setActive(panel.key)}
            >
              <span className="hhh-panel__title">{panel.title}</span>
              <span className="hhh-panel__body">
                <span className="hhh-panel__drawing">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={panel.icon} alt="" loading="lazy" />
                </span>
                <span className="hhh-panel__photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={panel.image} alt={panel.alt} loading="lazy" />
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
