'use client'

import { MantineProvider, RingProgress } from '@mantine/core'
import '@mantine/core/styles/default-css-variables.css'
import '@mantine/core/styles/RingProgress.css'
import Link from 'next/link'
import { useRef } from 'react'

import { SpacingOverlay, type Space } from '../foundations/[chapter]/components/SpacingOverlay'
import { BASE, type Course, type LiveCourse } from '../landing2/CoursesRich'
import { useDoneMap } from './progress'

const SPACES: Space[] = [
  {
    id: 'V1',
    label: 'Eyebrow to title',
    from: '.landing__intro .eyebrow',
    fromEdge: 'bottom',
    to: '.landing__title',
    toEdge: 'top',
  },
  {
    id: 'V2',
    label: 'Title to blurb',
    from: '.landing__title',
    fromEdge: 'bottom',
    to: '.landing__blurb',
    toEdge: 'top',
  },
  {
    id: 'V3',
    label: 'Blurb to progress',
    from: '.landing__blurb',
    fromEdge: 'bottom',
    to: '.progress-line',
    toEdge: 'top',
  },
  {
    id: 'V4',
    label: 'Opening to the first course',
    from: '.progress-line',
    fromEdge: 'bottom',
    to: '.pl-list > li:nth-child(1) .pl-row',
    toEdge: 'top',
  },
  {
    id: 'V5',
    label: 'Course to course',
    from: '.pl-list > li:nth-child(1) .pl-row',
    fromEdge: 'bottom',
    to: '.pl-list > li:nth-child(2) .pl-row',
    toEdge: 'top',
  },
  {
    id: 'H1',
    label: 'Row edge to tile',
    from: '.pl-list > li:nth-child(2) .pl-row',
    fromEdge: 'left',
    to: '.pl-list > li:nth-child(2) .pl-art',
    toEdge: 'left',
  },
  {
    id: 'H2',
    label: 'Tile to name',
    from: '.pl-list > li:nth-child(2) .pl-art',
    fromEdge: 'right',
    to: '.pl-list > li:nth-child(2) .pl-text',
    toEdge: 'left',
  },
]

/**
 * Shape your practice's landing page, mirroring Explore the foundations (3 October 2026): the same
 * opening, using Foundations' own classes (eyebrow, title with the orange underline, a short blurb,
 * a row of dots with a count) and the same 1108px box as its chapter grid; then the eight courses
 * as compact rows (a small tile, the name, cards and minutes, a ring and one action), without the
 * longer description or the "Course n" label.
 */
export function PracticeLanding({ live }: { live: LiveCourse[] }) {
  const root = useRef<HTMLDivElement>(null)
  const doneMap = useDoneMap(live.map((l) => l.slug))
  const courses: Course[] = BASE.map((c) => {
    const l = live.find((x) => x.title === c.title)
    if (!l) return { ...c, done: 0 }
    const d = doneMap[l.slug] ?? new Set<number>()
    return {
      ...c,
      slug: l.slug,
      ns: l.ns,
      about: l.summary,
      cards: l.ns.length,
      minutes: l.minutes,
      done: l.ns.filter((n) => d.has(n)).length,
    }
  })
  const hrefOf = (c: Course) => {
    if (!c.slug || !c.ns) return undefined
    const d = doneMap[c.slug] ?? new Set<number>()
    return `/practice/${c.slug}/${c.ns.find((n) => !d.has(n)) ?? c.ns[0]}`
  }
  const complete = courses.filter((c) => c.done === c.cards).length
  const next = courses.find((c) => c.done < c.cards && hrefOf(c))

  return (
    <MantineProvider>
      <div className="landing pl" ref={root}>
        <SpacingOverlay root={root} spaces={SPACES} />
        <div className="landing__intro">
          <p className="eyebrow">Pathway two</p>
          <h1 className="landing__title">
            Shape your <span className="accent-underline accent-underline--thick">practice</span>
          </h1>
          <p className="landing__blurb">
            Eight short courses every designer at Transform takes, in order and at your own pace.
          </p>
          <p
            className="progress-line"
            aria-label={`${complete} of ${courses.length} courses complete`}
          >
            <span className="progress-line__dots" aria-hidden>
              {courses.map((c) => (
                <span
                  key={c.title}
                  className="progress-line__dot"
                  data-state={c.done === c.cards ? 'read' : 'unread'}
                />
              ))}
            </span>
            <span className="progress-line__text">
              {complete} of {courses.length} complete
            </span>
          </p>
        </div>

        <ol className="pl-list" aria-label="Your courses">
          {courses.map((c) => {
            const href = hrefOf(c)
            const pct = Math.round((c.done / c.cards) * 100)
            const state = pct === 100 ? 'done' : pct > 0 ? 'part' : 'none'
            const isNext = next === c
            const body = (
              <>
                <span
                  className="pl-art cr-art"
                  aria-hidden
                  style={{
                    ['--base' as string]: c.wash.base,
                    ['--a' as string]: c.wash.a,
                    ['--b' as string]: c.wash.b,
                    ['--at-a' as string]: c.wash.at.split(', ')[0],
                    ['--at-b' as string]: c.wash.at.split(', ')[1],
                  }}
                />
                <span className="pl-text">
                  <span className="pl-name">{c.title}</span>
                  <span className="pl-meta">
                    {c.cards} cards · {c.minutes} min
                    {isNext && <span className="cr-badge">Up next</span>}
                  </span>
                </span>
                {state === 'done' ? (
                  <span className="cr-done pl-done" aria-hidden>
                    <svg viewBox="0 0 24 24">
                      <path d="M7 12.5l3.2 3.2L17 8.8" />
                    </svg>
                  </span>
                ) : (
                  <RingProgress
                    className="pl-ring"
                    size={52}
                    thickness={5}
                    roundCaps
                    rootColor="#e4f2ea"
                    sections={c.done ? [{ value: pct, color: '#3f9a6b' }] : []}
                    label={<span className="pl-ring__pct">{pct}%</span>}
                  />
                )}
                {href ? (
                  <span className={isNext ? 'cr-cta cr-cta--primary' : 'cr-cta'}>
                    {state === 'done' ? 'Review' : state === 'part' ? 'Continue' : 'Start'}
                  </span>
                ) : (
                  <span className="pl-cta-space" />
                )}
              </>
            )
            return (
              <li key={c.title}>
                {href ? (
                  <Link href={href} className="pl-row" data-next={isNext}>
                    {body}
                  </Link>
                ) : (
                  <div className="pl-row" data-soon>
                    {body}
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </MantineProvider>
  )
}
