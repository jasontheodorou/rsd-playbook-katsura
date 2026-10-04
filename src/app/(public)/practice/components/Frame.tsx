import {
  ArrowsLeftRight,
  Cards,
  ChatCircleDots,
  CheckSquareOffset,
  Graph,
  MagnifyingGlass,
  Shuffle,
  SlidersHorizontal,
  Stairs,
  type Icon,
} from '@phosphor-icons/react'
import type { ReactNode } from 'react'

/** Each kind of interactive has its own icon, so a reader can tell at a glance what it asks of them. */
const ICONS: Record<string, Icon> = {
  slider: SlidersHorizontal,
  step: Stairs,
  flip: Cards,
  match: ArrowsLeftRight,
  spot: MagnifyingGlass,
  before: Shuffle,
  map: Graph,
  check: CheckSquareOffset,
  choose: ChatCircleDots,
}

/** The frame every interactive sits in: the course's tint, and a heading led by a ThemeIcon-style icon. */
export function Frame({
  label,
  kind,
  children,
  note,
  className = '',
}: {
  label: string
  kind: string
  children: ReactNode
  note?: string
  className?: string
}) {
  const I = ICONS[kind]
  return (
    <section className={`pc-ix ${className}`} aria-label={label}>
      <div className="pc-ix__head">
        {I && (
          <span className="pc-ix__icon" aria-hidden>
            <I size={22} weight="duotone" />
          </span>
        )}
        <h3 className="pc-ix__label">{label}</h3>
      </div>
      {children}
      {note && <p className="pc-ix__note">{note}</p>}
    </section>
  )
}
