'use client'

import { useSearchParams } from 'next/navigation'

import { PaperDesk } from './PaperDesk'
import { ReadingRoom } from './ReadingRoom'
import { Switcher } from './shared'
import { TwoZones } from './TwoZones'
import { TwoZonesMantine } from './TwoZonesMantine'

/** Pathway two, four approaches (?o=1 to 4), each a task list on the left and the card on the right. */
export function Approaches() {
  const n = Math.min(4, Math.max(1, Number(useSearchParams().get('o')) || 1))
  return (
    <div className="p2">
      <Switcher n={n} />
      {n !== 4 && (
        <header className="p2-head">
          <p className="eyebrow">Pathway two</p>
          <p className="p2-head__title">
            Shape your practice
            {/* The page's one orange full stop: on the card's title in the Reading room, here otherwise. */}
            {n !== 2 && <span className="p2-stop" aria-hidden />}
          </p>
        </header>
      )}
      {n === 1 && <TwoZones />}
      {n === 2 && <ReadingRoom />}
      {n === 3 && <PaperDesk />}
      {n === 4 && <TwoZonesMantine />}
    </div>
  )
}
