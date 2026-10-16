'use client'

import Link from 'next/link'
import { useState } from 'react'

import { CATEGORY_LABEL, PATTERNS, SOURCES } from './registry'
import { Tile } from './Tile'
import type { LibraryPattern, Source } from './types'

type Filter = Source | 'all'

const GROUPS: { status: LibraryPattern['status']; title: string; note: string }[] = [
  { status: 'live', title: 'In the Playbook', note: 'Rendering on a page now.' },
]

/**
 * The index: every pattern as a card with its live thumbnail, filtered by the part of the Playbook
 * it belongs to and grouped by where it stands.
 */
export function PatternsIndex() {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = filter === 'all' ? PATTERNS : PATTERNS.filter((p) => p.source === filter)
  const count = (f: Filter) => (f === 'all' ? PATTERNS.length : PATTERNS.filter((p) => p.source === f).length)
  const note = SOURCES.find((s) => s.id === filter)?.description

  return (
    <div className="pl-page">
      <header className="pl-head">
        <h1 className="pl-title">
          Patterns
          <span className="pl-stop" aria-hidden="true" />
        </h1>
        <p className="pl-lede">
          The graphical and interactive patterns the Playbook is built from. Each one is live, using the same
          component and the same words as its page.
        </p>
      </header>

      <div className="pl-filters" role="group" aria-label="Show patterns from">
        <Chip active={filter === 'all'} count={count('all')} onClick={() => setFilter('all')}>
          All
        </Chip>
        {SOURCES.map((s) => (
          <Chip key={s.id} active={filter === s.id} count={count(s.id)} onClick={() => setFilter(s.id)}>
            {s.label}
          </Chip>
        ))}
      </div>
      {note && <p className="pl-filters__note">{note}</p>}

      {GROUPS.map((g) => {
        const items = visible.filter((p) => p.status === g.status)
        if (!items.length) return null
        return (
          <section key={g.status} className="pl-group" aria-labelledby={`pl-group-${g.status}`}>
            <div className="pl-group__head">
              <h2 className="pl-group__title" id={`pl-group-${g.status}`}>
                {g.title}
              </h2>
              <p className="pl-group__note">
                {items.length} {items.length === 1 ? 'pattern' : 'patterns'}. {g.note}
              </p>
            </div>
            <ul className="pl-grid">
              {items.map((p) => (
                <li key={p.id}>
                  <Card pattern={p} />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function Card({ pattern }: { pattern: LibraryPattern }) {
  const source = SOURCES.find((s) => s.id === pattern.source)
  return (
    <article className="pl-card">
      <Tile pattern={pattern} />
      <div className="pl-card__caption">
        <p className="pl-card__meta">
          {source?.label} · {CATEGORY_LABEL[pattern.category]}
        </p>
        <h3 className="pl-card__heading">
          <Link className="pl-card__name" href={`/patterns/${pattern.id}`}>
            {pattern.name}
          </Link>
        </h3>
        <p className="pl-card__desc">{pattern.description}</p>
      </div>
    </article>
  )
}

function Chip({
  children,
  active,
  count,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  count: number
  onClick: () => void
}) {
  return (
    <button type="button" className="pl-chip" aria-pressed={active} onClick={onClick}>
      {children}
      <span className="pl-chip__count">{count}</span>
    </button>
  )
}
