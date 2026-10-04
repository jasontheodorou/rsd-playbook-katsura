'use client'

import { Accordion, Breadcrumbs, MantineProvider, RingProgress } from '@mantine/core'
import '@mantine/core/styles/default-css-variables.css'
import '@mantine/core/styles/Accordion.css'
import '@mantine/core/styles/Breadcrumbs.css'
import '@mantine/core/styles/RingProgress.css'
import '@mantine/core/styles/UnstyledButton.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'

import { SpacingOverlay, type Space } from '../foundations/[chapter]/components/SpacingOverlay'
import { setDone, useDone } from './progress'

/** What the shell needs to know about a course: no card text, which the server renders. */
export type ShellCourse = {
  slug: string
  title: string
  lessons: { name: string; cards: { n: number; title: string }[] }[]
  minutes: Record<number, number>
}

const SPACES: Space[] = [
  {
    id: 'V1',
    label: 'Breadcrumbs to course name',
    from: '.cp-crumbs a',
    fromEdge: 'bottom',
    to: '.cp-course',
    toEdge: 'top',
  },
  {
    id: 'V2',
    label: 'Course name to the box',
    from: '.cp-course',
    fromEdge: 'bottom',
    to: '.cp-box',
    toEdge: 'top',
  },
  {
    id: 'V3',
    label: 'Box edge to your progress',
    from: '.cp-nav',
    fromEdge: 'top',
    to: '.cp-ring',
    toEdge: 'top',
    span: '.cp-ring',
  },
  {
    id: 'V4',
    label: 'Your progress to the first lesson',
    from: '.cp-ring',
    fromEdge: 'bottom',
    to: '.cp-part__name',
    toEdge: 'top',
  },
  {
    id: 'V5',
    label: 'Box edge to the card',
    from: '.cp-side',
    fromEdge: 'top',
    to: '.cp-card__title',
    toEdge: 'top',
    span: '.cp-card__title',
  },
  {
    id: 'V6',
    label: 'Card title to words',
    from: '.cp-card__title',
    fromEdge: 'bottom',
    to: '.pc-words > :first-child',
    toEdge: 'top',
  },
  {
    id: 'V7',
    label: 'Words to the foot of the card',
    from: '.pc-words > :last-child',
    fromEdge: 'bottom',
    to: '.cp-card__end',
    toEdge: 'top',
  },
  {
    id: 'H1',
    label: 'Box edge to the list',
    from: '.cp-nav',
    fromEdge: 'left',
    to: '.cp-ring',
    toEdge: 'left',
    span: '.cp-ring',
  },
  {
    id: 'H2',
    label: 'Box edge to the card',
    from: '.cp-side',
    fromEdge: 'left',
    to: '.cp-card__title',
    toEdge: 'left',
    span: '.cp-card__title',
  },
]

/**
 * A Shape your practice course page, built on the gold standard course page template
 * (docs/DESIGN-RULES.md, "Shape your practice standard"): breadcrumbs and the course name, then one
 * box in two zones. The tint holds your progress ring and the course's lessons as folding parts,
 * each card a link; the white zone holds the card, rendered on the server and passed in as
 * children, with Mark as complete and Previous and Next at its foot.
 */
/**
 * The card last shown. Each card has its own address, so the shell is rebuilt when a card opens;
 * kept outside it, this survives, and the scroll to the card's top runs only when a different card
 * opens in the same visit.
 */
let lastShown: string | null = null

export function CourseShell({
  course,
  n,
  title,
  children,
}: {
  course: ShellCourse
  n: number
  title: string
  children: ReactNode
}) {
  const root = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const router = useRouter()
  const done = useDone(course.slug)
  const cards = course.lessons.flatMap((l) => l.cards)
  const i = cards.findIndex((c) => c.n === n)
  const prev = cards[i - 1]
  const next = cards[i + 1]
  const count = cards.filter((c) => done.has(c.n)).length
  const pct = cards.length ? Math.round((count / cards.length) * 100) : 0
  const minsLeft = cards
    .filter((c) => !done.has(c.n))
    .reduce((t, c) => t + (course.minutes[c.n] ?? 0), 0)
  const href = (k: number) => `/practice/${course.slug}/${k}`
  const isDone = done.has(n)

  // Opening a card starts you at its top (the template's behaviour), with focus on its title.
  useEffect(() => {
    const here = `${course.slug}/${n}`
    const before = lastShown
    lastShown = here
    // Not on first load, and not twice for the same card (React re-runs effects in development).
    if (!before || before === here) return
    const stacked = window.matchMedia('(max-width: 63.9375rem)').matches
    const target = stacked ? heading.current?.closest('.cp-side') : box.current
    const bar = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
    if (target) {
      const top = target.getBoundingClientRect().top
      if (top < bar || stacked) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({
          top: window.scrollY + top - bar - 24,
          behavior: reduce ? 'auto' : 'smooth',
        })
      }
    }
    heading.current?.focus({ preventScroll: true })
  }, [course.slug, n])

  // The lesson you are in stays open unless you close it; any other opens when you ask.
  const lessonOf = course.lessons.find((l) => l.cards.some((c) => c.n === n))?.name
  const names = course.lessons.map((l) => l.name)
  const [asked, setAsked] = useState<string[]>([])
  const [closed, setClosed] = useState<string[]>([])
  const open = names.filter((x) => asked.includes(x) || (x === lessonOf && !closed.includes(x)))
  const onChange = (v: string[]) => {
    setAsked(v)
    setClosed(names.filter((x) => !v.includes(x)))
  }

  // Completing a card moves on to the next unfinished one in the course, after this one first.
  const complete = () => {
    if (isDone) {
      setDone(course.slug, n, false)
      return
    }
    setDone(course.slug, n, true)
    const later = [...cards.slice(i + 1), ...cards.slice(0, i)].find(
      (c) => !done.has(c.n) && c.n !== n,
    )
    if (later) window.setTimeout(() => router.push(href(later.n), { scroll: false }), 450)
  }

  return (
    <MantineProvider>
      <div className="cp" ref={root}>
        <SpacingOverlay root={root} spaces={SPACES} />
        <header className="cp-head">
          <Breadcrumbs className="cp-crumbs" separator="›" separatorMargin={10}>
            <Link href="/practice">Shape your practice</Link>
            <span aria-current="page">{course.title}</span>
          </Breadcrumbs>
          <h1 className="cp-course">{course.title}</h1>
        </header>

        <div className="cp-box" ref={box}>
          <div className="cp-zone">
            <nav className="cp-nav" aria-label="This course">
              <div className="cp-ring">
                <RingProgress
                  className="cp-ring__dial"
                  size={88}
                  thickness={8}
                  roundCaps
                  rootColor="#e4f2ea"
                  sections={pct ? [{ value: pct, color: '#3f9a6b' }] : []}
                  transitionDuration={800}
                  label={<span className="cp-ring__pct">{pct}%</span>}
                  aria-label={`${pct}% complete`}
                />
                <p className="cp-ring__text">
                  <strong>
                    {count} of {cards.length} cards done
                  </strong>
                  <span>About {minsLeft} min to go</span>
                </p>
              </div>

              <Accordion
                multiple
                unstyled
                value={open}
                onChange={onChange}
                chevron={<Chevron />}
                chevronPosition="right"
                classNames={{
                  item: 'cp-part',
                  control: 'cp-part__control',
                  label: 'cp-part__label',
                  chevron: 'cp-part__chevron',
                  panel: 'cp-part__panel',
                }}
              >
                {course.lessons.map((l) => (
                  <Accordion.Item key={l.name} value={l.name}>
                    <Accordion.Control>
                      <span className="cp-part__name">{l.name}</span>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <ol className="cp-tasks">
                        {l.cards.map((c) => {
                          const d = done.has(c.n)
                          return (
                            <li key={c.n}>
                              <Link
                                href={href(c.n)}
                                scroll={false}
                                className="cp-task"
                                data-done={d}
                                aria-current={c.n === n ? 'page' : undefined}
                              >
                                <Marker done={d} />
                                <span className="cp-task__title">
                                  {c.title}
                                  {d && <span className="cp-hidden"> (complete)</span>}
                                </span>
                                <span className="cp-task__min">{course.minutes[c.n]} min</span>
                              </Link>
                            </li>
                          )
                        })}
                      </ol>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            </nav>
          </div>

          <div className="cp-side">
            <article className="cp-card" key={n}>
              <h2 className="cp-card__title" ref={heading} tabIndex={-1}>
                {title}
              </h2>
              {children}
              <footer className="cp-card__end pc-end">
                <button type="button" className="tz-done" data-done={isDone} onClick={complete}>
                  <span className="tz-done__mark" aria-hidden />
                  {isDone ? 'Completed' : 'Mark as complete'}
                </button>
                <nav className="pc-pager" aria-label="Cards">
                  {prev && (
                    <Link href={href(prev.n)} scroll={false} rel="prev">
                      <span aria-hidden>← </span>Previous
                    </Link>
                  )}
                  {next && (
                    <Link href={href(next.n)} scroll={false} rel="next">
                      Next<span aria-hidden> →</span>
                    </Link>
                  )}
                </nav>
              </footer>
            </article>
          </div>
        </div>
      </div>
    </MantineProvider>
  )
}

function Marker({ done }: { done: boolean }) {
  return (
    <span className="cp-task__mark" aria-hidden>
      {done && (
        <svg viewBox="0 0 20 20">
          <path d="M6 10.4l2.6 2.6L14 7.4" />
        </svg>
      )}
    </span>
  )
}

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
      <path
        d="M4 6l4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
