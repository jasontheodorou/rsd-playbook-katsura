'use client'

import { MantineProvider, Progress, RingProgress } from '@mantine/core'
import '@mantine/core/styles/default-css-variables.css'
import '@mantine/core/styles/Progress.css'
import '@mantine/core/styles/RingProgress.css'
import Link from 'next/link'
import { useRef } from 'react'

import { SpacingOverlay, type Space } from '../foundations/[chapter]/components/SpacingOverlay'
import { useDoneMap } from '../practice/progress'

/*
 * Landing option 7, Courses, richer (2 October 2026). Option 6 with patterns from Mantine UI,
 * rebuilt in the playbook's own style: a stats-ring card for your progress beside the opening, and
 * each course row with its own quiet ambience on a soft tile (two muted washes and a faint grain), an "Up next" badge, its cards
 * and minutes as small chips, a ring with its percentage (ring progress), and one clear action.
 * Grouping, wording and progress are stand-ins, as in option 6.
 */
/** Each course's ambience: a pale base and two muted washes, and where the washes sit. */
export type Wash = { base: string; a: string; b: string; at: string }
export type Course = {
  /** Set for a course that is built: its address and its cards in order. */
  slug?: string
  ns?: number[]
  title: string
  about: string
  minutes: number
  done: number
  cards: number
  wash: Wash
}

// Titles from Jason (2 October 2026). The one-line descriptions are new wording, awaiting sign-off.
// Card counts, minutes and progress are stand-ins.
export const BASE: Course[] = [
  {
    title: 'Guiding principles',
    about: 'What we believe about research and design, and the principles behind how we work.',
    minutes: 25,
    done: 6,
    cards: 6,
    wash: { base: '#eef2f3', a: '#9fb7c4', b: '#d9cfc0', at: '28% 30%, 78% 76%' },
  },
  {
    title: 'Working to the standards',
    about: 'The standards our work is held to, and how to meet them on every project.',
    minutes: 25,
    done: 2,
    cards: 5,
    wash: { base: '#f6f1e6', a: '#e2c98f', b: '#c9b8a6', at: '72% 28%, 24% 78%' },
  },
  {
    title: 'Getting to know your account',
    about: 'The client, their services and the policies that shape your work.',
    minutes: 20,
    done: 0,
    cards: 5,
    wash: { base: '#f5ece6', a: '#d9a58c', b: '#e6d3b8', at: '30% 74%, 74% 26%' },
  },
  {
    title: 'Running a project from start to finish',
    about: 'How we plan, run and close a piece of work, together with the people involved.',
    minutes: 40,
    done: 0,
    cards: 8,
    wash: { base: '#f0eef3', a: '#b3a9c4', b: '#c8d2d6', at: '70% 72%, 26% 30%' },
  },
  {
    title: 'Gathering the evidence',
    about: 'How we plan and run research, and turn what we find into insight.',
    minutes: 35,
    done: 0,
    cards: 7,
    wash: { base: '#eef1ec', a: '#a9bba4', b: '#dccfb2', at: '24% 26%, 80% 70%' },
  },
  {
    title: 'Designing and testing ideas',
    about: 'How we shape ideas, make them real enough to test, and learn from what happens.',
    minutes: 35,
    done: 0,
    cards: 7,
    wash: { base: '#eef0f4', a: '#a7b4cc', b: '#e3d6c4', at: '76% 70%, 26% 28%' },
  },
  {
    title: 'Best practice in your discipline',
    about: 'What good looks like in your own discipline, and how to keep growing.',
    minutes: 30,
    done: 0,
    cards: 6,
    wash: { base: '#f4efe8', a: '#d4b48e', b: '#b9c7c0', at: '30% 28%, 76% 74%' },
  },
  {
    title: 'Measuring and showing your impact',
    about: 'How we measure the difference we make, and share examples of work at its best.',
    minutes: 30,
    done: 0,
    cards: 6,
    wash: { base: '#f3eeea', a: '#c4a99a', b: '#a9b8bf', at: '76% 30%, 28% 74%' },
  },
]

/** A course's progress: Mantine's RingProgress, a soft green ring on a pale green track, as on the module page. */
function Ring({ value, label }: { value: number; label: string }) {
  return (
    <RingProgress
      className="cr-ring"
      size={64}
      thickness={6}
      roundCaps
      rootColor="#e4f2ea"
      sections={value ? [{ value: value * 100, color: '#3f9a6b' }] : []}
      transitionDuration={800}
      label={<span className="cr-ring__pct">{label}</span>}
    />
  )
}

/** Every named gap on the page, for the Foundations spacing overlay (Spacing button, bottom right). */
const SPACES: Space[] = [
  {
    id: 'V1',
    label: 'Eyebrow to title',
    from: '.cr-hero .eyebrow',
    fromEdge: 'bottom',
    to: '.cs-title',
    toEdge: 'top',
  },
  {
    id: 'V2',
    label: 'Title to statement',
    from: '.cs-title',
    fromEdge: 'bottom',
    to: '.cs-statement',
    toEdge: 'top',
  },
  {
    id: 'V3',
    label: 'Statement to progress bar',
    from: '.cs-statement',
    fromEdge: 'bottom',
    to: '.cr-progress__root',
    toEdge: 'top',
  },
  {
    id: 'V4',
    label: 'Progress bar to its line',
    from: '.cr-progress__root',
    fromEdge: 'bottom',
    to: '.cr-progress__text',
    toEdge: 'top',
  },
  {
    id: 'V5',
    label: 'Progress line to the first course',
    from: '.cr-progress__text',
    fromEdge: 'bottom',
    to: '.cr-list > li:nth-child(1) .cr-course',
    toEdge: 'top',
  },
  {
    id: 'V6',
    label: 'Course to course',
    from: '.cr-list > li:nth-child(1) .cr-course',
    fromEdge: 'bottom',
    to: '.cr-list > li:nth-child(2) .cr-course',
    toEdge: 'top',
  },
  {
    id: 'V7',
    label: 'Row edge to its tile',
    from: '.cr-list > li:nth-child(2) .cr-course',
    fromEdge: 'top',
    to: '.cr-list > li:nth-child(2) .cr-art',
    toEdge: 'top',
  },
  {
    id: 'V8',
    label: 'Course label, or its badge, to course name',
    from: '.cr-list > li:nth-child(2) .cr-course__top',
    fromEdge: 'bottom',
    to: '.cr-list > li:nth-child(2) .cr-course__title',
    toEdge: 'top',
  },
  {
    id: 'V9',
    label: 'Course name to description',
    from: '.cr-list > li:nth-child(2) .cr-course__title',
    fromEdge: 'bottom',
    to: '.cr-list > li:nth-child(2) .cr-course__about',
    toEdge: 'top',
  },
  {
    id: 'V10',
    label: 'Description to chips',
    from: '.cr-list > li:nth-child(2) .cr-course__about',
    fromEdge: 'bottom',
    to: '.cr-list > li:nth-child(2) .cr-chips',
    toEdge: 'top',
  },
  {
    id: 'H1',
    label: 'Row edge to its tile',
    from: '.cr-list > li:nth-child(2) .cr-course',
    fromEdge: 'left',
    to: '.cr-list > li:nth-child(2) .cr-art',
    toEdge: 'left',
  },
  {
    id: 'H2',
    label: 'Tile to text',
    from: '.cr-list > li:nth-child(2) .cr-art',
    fromEdge: 'right',
    to: '.cr-list > li:nth-child(2) .cr-course__text',
    toEdge: 'left',
  },
  {
    id: 'H3',
    label: 'Action to row edge',
    from: '.cr-list > li:nth-child(2) .cr-cta',
    fromEdge: 'right',
    to: '.cr-list > li:nth-child(2) .cr-course',
    toEdge: 'right',
  },
]

/** A built course, as the /practice page passes it in: real cards, minutes and summary. */
export type LiveCourse = {
  slug: string
  title: string
  summary: string
  ns: number[]
  minutes: number
}

export function CoursesRich({ live }: { live?: LiveCourse[] } = {}) {
  const doneMap = useDoneMap(live?.map((l) => l.slug) ?? [])
  // Built courses replace their stand-ins, with progress from this browser. On /practice the
  // courses not built yet have no link.
  const COURSES: Course[] = BASE.map((c) => {
    const l = live?.find((x) => x.title === c.title)
    if (!l) return live ? { ...c, done: 0 } : c
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
    if (!c.slug || !c.ns) return live ? undefined : '/modular?o=4'
    const d = doneMap[c.slug] ?? new Set<number>()
    return `/practice/${c.slug}/${c.ns.find((n) => !d.has(n)) ?? c.ns[0]}`
  }
  const root = useRef<HTMLDivElement>(null)
  const cards = COURSES.reduce((t, c) => t + c.cards, 0)
  const read = COURSES.reduce((t, c) => t + c.done, 0)
  const complete = COURSES.filter((c) => c.done === c.cards).length
  const left = COURSES.reduce((t, c) => t + c.minutes * (1 - c.done / c.cards), 0)
  const next = COURSES.find((c) => c.done < c.cards)
  return (
    <MantineProvider>
      <div className="cr" ref={root}>
        <SpacingOverlay root={root} spaces={SPACES} />
        <header className="cr-hero">
          <div className="cr-hero__text">
            <p className="eyebrow">Pathway two</p>
            <h1 className="cs-title">
              Shape your <span className="accent-underline accent-underline--thick">practice</span>
            </h1>
            <p className="cs-statement">
              <span>Eight short courses every designer at Transform takes.</span>
              <br />
              Work through them in order, at your own pace.
            </p>
            {/* Your progress, directly under the opening and quiet: Mantine's Progress, in the playbook's slate. */}
            <div className="cr-progress">
              <Progress
                value={(read / cards) * 100}
                size={4}
                radius="xl"
                color="#34566b"
                aria-label={`${Math.round((read / cards) * 100)}% of your courses complete`}
                classNames={{ root: 'cr-progress__root' }}
                transitionDuration={600}
              />
              <p className="cr-progress__text">
                <strong>{Math.round((read / cards) * 100)}% complete</strong> · {complete} of{' '}
                {COURSES.length} courses · about {Math.round((left / 60) * 2) / 2} hours to go
              </p>
            </div>
          </div>
        </header>

        <ol className="cr-list" aria-label="Your courses">
          {COURSES.map((c, i) => {
            const pct = Math.round((c.done / c.cards) * 100)
            const state = pct === 100 ? 'done' : pct > 0 ? 'part' : 'none'
            const isNext = next === c
            return (
              <li key={c.title}>
                <Row href={hrefOf(c)} className="cr-course" data-state={state} data-next={isNext}>
                  <span
                    className="cr-art"
                    aria-hidden
                    style={{
                      ['--base' as string]: c.wash.base,
                      ['--a' as string]: c.wash.a,
                      ['--b' as string]: c.wash.b,
                      ['--at-a' as string]: c.wash.at.split(', ')[0],
                      ['--at-b' as string]: c.wash.at.split(', ')[1],
                    }}
                  />
                  <span className="cr-course__text">
                    <span className="cr-course__top">
                      <span className="cr-course__n">Course {i + 1}</span>
                      {isNext && <span className="cr-badge">Up next</span>}
                      {state === 'done' && (
                        <span className="cr-badge cr-badge--done">Complete</span>
                      )}
                    </span>
                    <span className="cr-course__title">{c.title}</span>
                    <span className="cr-course__about">{c.about}</span>
                    <span className="cr-chips">
                      <span>{c.cards} cards</span>
                      <span>{c.minutes} min</span>
                    </span>
                  </span>
                  {state === 'done' ? (
                    // A finished course: a soft green disc with a drawn tick, in place of the full ring
                    <span className="cr-done" aria-hidden>
                      <svg viewBox="0 0 24 24">
                        <path d="M7 12.5l3.2 3.2L17 8.8" />
                      </svg>
                    </span>
                  ) : (
                    <Ring value={c.done / c.cards} label={`${pct}%`} />
                  )}
                  {hrefOf(c) && (
                    <span className={isNext ? 'cr-cta cr-cta--primary' : 'cr-cta'}>
                      {state === 'done' ? 'Review' : state === 'part' ? 'Continue' : 'Start'}
                    </span>
                  )}
                </Row>
              </li>
            )
          })}
        </ol>
      </div>
    </MantineProvider>
  )
}

/** A course row: a link when the course can be opened, a plain row when it is not built yet. */
function Row({
  href,
  children,
  ...rest
}: {
  href?: string
  children: React.ReactNode
  className: string
  'data-state': string
  'data-next': boolean
}) {
  return href ? (
    <Link href={href} {...rest}>
      {children}
    </Link>
  ) : (
    <div {...rest} data-soon>
      {children}
    </div>
  )
}
