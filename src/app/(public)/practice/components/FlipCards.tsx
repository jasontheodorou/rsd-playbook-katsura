'use client'

import { ThemeIcon } from '@mantine/core'
import '@mantine/core/styles/ThemeIcon.css'
import {
  ArrowsClockwise,
  Eye,
  GlobeHemisphereWest,
  UserFocus,
  UsersThree,
  type Icon,
} from '@phosphor-icons/react'
import { useState } from 'react'

import { useHydrated } from '../progress'
import { Frame } from './Frame'

export type FlipProps = {
  label: string
  cards: { front: string; icon?: string; back: { cid?: string; text: string; example: string } }[]
}

/** The icons a card's data can name for its front (Phosphor, MIT licence). */
const ICONS: Record<string, Icon> = {
  UserFocus,
  UsersThree,
  Eye,
  GlobeHemisphereWest,
  ArrowsClockwise,
}

/** Flip cards: pressing a card turns it to its back (the manual's text, then what it looks like); pressing again turns it back. */
export function FlipCards({ label, cards }: FlipProps) {
  const hydrated = useHydrated()
  const [turned, setTurned] = useState<Set<number>>(new Set())
  if (!hydrated)
    return (
      <Frame kind="flip" label={label}>
        {cards.map((c) => (
          <div key={c.front} className="pc-flip__plain">
            <h4>{c.front}</h4>
            <p data-cid={c.back.cid}>{c.back.text}</p>
            <p>What it looks like: {c.back.example}</p>
          </div>
        ))}
      </Frame>
    )
  const flip = (k: number) =>
    setTurned((t) => {
      const n = new Set(t)
      if (n.has(k)) n.delete(k)
      else n.add(k)
      return n
    })
  return (
    <Frame kind="flip" label={label} className="pc-flip">
      <ul className="pc-flip__cards">
        {cards.map((c, k) => (
          <li key={c.front}>
            <button
              type="button"
              className="pc-flip__card"
              aria-pressed={turned.has(k)}
              onClick={() => flip(k)}
            >
              <span className="pc-flip__inner">
                <span className="pc-flip__face pc-flip__front" aria-hidden={turned.has(k)}>
                  {c.icon && ICONS[c.icon] && (
                    <ThemeIcon
                      className="pc-flip__icon"
                      size={72}
                      radius="xl"
                      variant="light"
                      aria-hidden
                    >
                      {(() => {
                        const I = ICONS[c.icon!]
                        return <I size={38} weight="duotone" />
                      })()}
                    </ThemeIcon>
                  )}
                  <span className="pc-flip__name">{c.front}</span>
                  <span className="pc-flip__hint">Turn over</span>
                </span>
                <span className="pc-flip__face pc-flip__back" aria-hidden={!turned.has(k)}>
                  <span className="pc-flip__name">{c.front}</span>
                  <span data-cid={c.back.cid}>{c.back.text}</span>
                  <span className="pc-flip__example">What it looks like: {c.back.example}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Frame>
  )
}
