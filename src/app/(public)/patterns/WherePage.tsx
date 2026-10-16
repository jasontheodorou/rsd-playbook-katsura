'use client'

import Link from 'next/link'

import { chapters } from '../foundations/chapters'
import { COURSES } from '../practice/content'
import { PATTERNS } from './registry'
import type { LibraryPattern } from './types'

/** The patterns whose "where it's used" links into a page under `prefix`. */
const usedUnder = (prefix: string) =>
  PATTERNS.filter((p) => p.whereUsed.some((w) => w.href === prefix || w.href?.startsWith(`${prefix}/`)))

/**
 * Where the patterns are used: each Foundations chapter and each Shape your practice course, in
 * reading order, with the patterns that build it. Orientation before inventory.
 */
export function WherePage() {
  const unplaced = PATTERNS.filter((p) => p.status === 'built')
  return (
    <div className="pl-page">
      <header className="pl-head">
        <h1 className="pl-title">
          Where they are used
          <span className="pl-stop" aria-hidden="true" />
        </h1>
        <p className="pl-lede">
          Each page of the Playbook, in reading order, with the patterns that build it.
        </p>
      </header>

      <section className="pl-group" aria-labelledby="pl-where-f">
        <div className="pl-group__head">
          <h2 className="pl-group__title" id="pl-where-f">
            Foundations
          </h2>
        </div>
        <ol className="pl-where">
          {chapters.map((c, i) => (
            <Row
              key={c.slug}
              num={String(i + 1).padStart(2, '0')}
              name={c.title}
              href={`/foundations/${c.slug}`}
              patterns={usedUnder(`/foundations/${c.slug}`)}
            />
          ))}
        </ol>
      </section>

      <section className="pl-group" aria-labelledby="pl-where-p">
        <div className="pl-group__head">
          <h2 className="pl-group__title" id="pl-where-p">
            Shape your practice
          </h2>
        </div>
        <ol className="pl-where">
          {COURSES.map((c) => (
            <Row
              key={c.slug}
              num={String(c.n).padStart(2, '0')}
              name={c.title}
              href={`/practice/${c.slug}`}
              patterns={usedUnder(`/practice/${c.slug}`)}
            />
          ))}
        </ol>
      </section>

      {unplaced.length > 0 && (
        <section className="pl-group" aria-labelledby="pl-where-u">
          <div className="pl-group__head">
            <h2 className="pl-group__title" id="pl-where-u">
              Waiting for a page
            </h2>
            <p className="pl-group__note">Built and working, and not on any page above.</p>
          </div>
          <Pills patterns={unplaced} />
        </section>
      )}
    </div>
  )
}

function Row({
  num,
  name,
  href,
  patterns,
}: {
  num: string
  name: string
  href: string
  patterns: LibraryPattern[]
}) {
  return (
    <li className="pl-where__row">
      <span className="pl-where__num" aria-hidden="true">
        {num}
      </span>
      <div>
        <h3 className="pl-where__name">
          <Link className="pl-link" href={href}>
            {name}
          </Link>
        </h3>
        {patterns.length ? <Pills patterns={patterns} /> : <p className="pl-prose pl-prose--quiet">No patterns yet.</p>}
      </div>
    </li>
  )
}

function Pills({ patterns }: { patterns: LibraryPattern[] }) {
  return (
    <ul className="pl-pills">
      {patterns.map((p) => (
        <li key={p.id}>
          <Link className="pl-pill" href={`/patterns/${p.id}`}>
            {p.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
