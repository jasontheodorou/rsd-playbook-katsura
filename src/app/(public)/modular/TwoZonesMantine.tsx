'use client'

import { Accordion, Breadcrumbs, MantineProvider, RingProgress } from '@mantine/core'
import '@mantine/core/styles/default-css-variables.css'
import '@mantine/core/styles/Accordion.css'
import '@mantine/core/styles/Breadcrumbs.css'
import '@mantine/core/styles/RingProgress.css'
import '@mantine/core/styles/UnstyledButton.css'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { SpacingOverlay, type Space } from '../foundations/[chapter]/components/SpacingOverlay'

import { Words, usePathway } from './shared'

/*
 * Approach 4, Two zones with Mantine (2 October 2026, rebuilt from scratch). A course page: the
 * breadcrumbs back to the landing page and the course's name as a plain subheading (not the
 * playbook's display title, which competed with the layout). Below, one hairline box in two zones:
 * on the tint, the landing page's progress bar and the course's parts as a Mantine Accordion, only
 * the open part unfolded, its tasks as plain rows with round markers that turn green once done; on
 * white, the card, kept in view while the list scrolls.
 */
/** Every named gap on the page, for the Foundations spacing overlay (Spacing button, bottom right). */
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
    label: 'Your progress to the first part',
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
    to: '.cp-words > :first-child',
    toEdge: 'top',
  },
  {
    id: 'V7',
    label: 'Paragraph to paragraph',
    from: '.cp-words > p:nth-of-type(1)',
    fromEdge: 'bottom',
    to: '.cp-words > p:nth-of-type(1) + p',
    toEdge: 'top',
  },
  {
    id: 'V8',
    label: 'Words to the button',
    from: '.cp-words > :last-child',
    fromEdge: 'bottom',
    to: '.cp-card__end .tz-done',
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

export function TwoZonesMantine() {
  const root = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const p = usePathway()
  const { current } = p
  // The card last scrolled to, so the scroll runs only when a different card opens (not on
  // load, and not twice when React re-runs effects in development).
  const shown = useRef(current.c.id)
  const pct = p.total ? Math.round((p.count / p.total) * 100) : 0
  const minsLeft = p.all.filter((e) => !p.isDone(e.c.id)).reduce((t, e) => t + e.c.minutes, 0)

  // Opening a card starts you at its top: if the box (or, when the zones stack, the card) has
  // scrolled up out of view, bring its top back under the top bar, then move focus to the title.
  useEffect(() => {
    if (shown.current === current.c.id) return
    shown.current = current.c.id
    const stacked = window.matchMedia('(max-width: 63.9375rem)').matches
    const target = stacked ? title.current?.closest('.cp-side') : box.current
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
    title.current?.focus({ preventScroll: true })
  }, [current.c.id])

  // The part you are in stays open unless you close it; any other opens when you ask.
  const ids = p.modules.map((m) => m.id)
  const [asked, setAsked] = useState<string[]>([])
  const [closed, setClosed] = useState<string[]>([])
  const open = ids.filter(
    (id) => asked.includes(id) || (id === current.m.id && !closed.includes(id)),
  )
  const onChange = (next: string[]) => {
    setAsked(next)
    setClosed(ids.filter((id) => !next.includes(id)))
  }

  return (
    <MantineProvider>
      <div className="cp" ref={root}>
        <SpacingOverlay root={root} spaces={SPACES} />
        <header className="cp-head">
          <Breadcrumbs className="cp-crumbs" separator="›" separatorMargin={10}>
            <Link href="/landing2">Shape your practice</Link>
            <span aria-current="page">{current.m.title}</span>
          </Breadcrumbs>
          <h1 className="cp-course">{current.m.title}</h1>
        </header>

        <div className="cp-box" ref={box}>
          <div className="cp-zone">
            <nav className="cp-nav" aria-label="Your course">
              {/* Your progress: Mantine's RingProgress, a soft green ring with the percentage inside, and a
                short summary beside it (in place of a flat bar). */}
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
                    {p.count} of {p.total} cards done
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
                {p.modules.map((m) => {
                  return (
                    <Accordion.Item key={m.id} value={m.id}>
                      <Accordion.Control>
                        <span className="cp-part__name">{m.title}</span>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <ol className="cp-tasks">
                          {m.cards.map((c) => {
                            const done = p.isDone(c.id)
                            return (
                              <li key={c.id}>
                                <button
                                  type="button"
                                  className="cp-task"
                                  data-done={done}
                                  aria-current={c.id === current.c.id}
                                  onClick={() => p.open(c.id)}
                                >
                                  <Marker done={done} />
                                  <span className="cp-task__title">
                                    {c.title}
                                    {done && <span className="cp-hidden"> (complete)</span>}
                                  </span>
                                  <span className="cp-task__min">{c.minutes} min</span>
                                </button>
                              </li>
                            )
                          })}
                        </ol>
                      </Accordion.Panel>
                    </Accordion.Item>
                  )
                })}
              </Accordion>
            </nav>
          </div>

          <div className="cp-side">
            <article className="cp-card" key={current.c.id}>
              <h2 className="cp-card__title" ref={title} tabIndex={-1}>
                {current.c.title}
              </h2>
              <Words item={current.c} className="tz-words cp-words" />
              <footer className="cp-card__end">
                <button
                  type="button"
                  className="tz-done"
                  data-done={p.isDone(current.c.id)}
                  onClick={() => p.toggle()}
                >
                  <span className="tz-done__mark" aria-hidden />
                  {p.isDone(current.c.id) ? 'Completed' : 'Mark as complete'}
                </button>
              </footer>
            </article>
          </div>
        </div>
      </div>
    </MantineProvider>
  )
}

/** A task's marker: an outline to read, a green disc with a white tick once done. */
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
