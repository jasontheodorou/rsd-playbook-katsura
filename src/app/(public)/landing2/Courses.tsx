'use client'

import Link from 'next/link'

/*
 * Landing option 6, Courses (2 October 2026). Shape your practice as five required courses, listed
 * the way a learning platform lists them: one row each, in the module view's white rectangles on the
 * warm tint, with a status mark, the course's name and one line about it, its length, a simple
 * progress bar and the one action. Jason's eight chapters are grouped into five here (a proposal).
 * Progress is a stand-in: one course complete, one under way.
 */
type Course = { title: string; about: string; from: string; minutes: number; done: number; cards: number }

const COURSES: Course[] = [
  { title: 'Our RSD manifesto', about: 'What we believe about research and design, and why it matters.', from: 'Our RSD Manifesto', minutes: 20, done: 5, cards: 5 },
  { title: 'Our practice standards', about: 'The standards every piece of our work is held to.', from: 'The Standards of Our Practice', minutes: 30, done: 3, cards: 7 },
  { title: 'Know your account', about: 'The client, the services and the policies behind your work.', from: 'Get to know your account', minutes: 20, done: 0, cards: 4 },
  { title: 'Ways of working', about: 'How we work together, the methods and tools we use, and best practice for your discipline.', from: 'Ways of Working; Methods & Tools; Methods for your discipline', minutes: 60, done: 0, cards: 14 },
  { title: 'Impact and showcase', about: 'How we measure the difference we make, with examples of work at its best.', from: 'Measuring Impact; Showcase & Examples', minutes: 35, done: 0, cards: 8 },
]

export function Courses() {
  const complete = COURSES.filter((c) => c.done === c.cards).length
  const next = COURSES.find((c) => c.done < c.cards)
  return (
    <div className="cs">
      <header className="cs-hero">
        <p className="eyebrow">Pathway two</p>
        <h1 className="cs-title">
          Shape your practice<span className="ml-stop" aria-hidden />
        </h1>
        <p className="cs-statement">
          <span>Five short courses every designer at Transform takes.</span> Work through them in order, at your own pace.
        </p>
      </header>

      <section className="cs-panel" aria-labelledby="cs-courses">
        <div className="cs-panel__head">
          <h2 id="cs-courses" className="cs-label">
            Your courses
          </h2>
          <p className="cs-overall">
            <span>
              <strong>{complete}</strong> of {COURSES.length} complete
            </span>
            <span className="cs-overall__bar" aria-hidden>
              {COURSES.map((c) => (
                <span key={c.title} data-state={c.done === c.cards ? 'done' : c.done > 0 ? 'part' : 'none'} />
              ))}
            </span>
          </p>
        </div>

        <ol className="cs-list">
          {COURSES.map((c, i) => {
            const pct = Math.round((c.done / c.cards) * 100)
            const state = pct === 100 ? 'done' : pct > 0 ? 'part' : 'none'
            const isNext = next === c
            return (
              <li key={c.title}>
                <Link href="/modular?o=1" className="cs-course" data-state={state} data-next={isNext} title={`From: ${c.from}`}>
                  <span className="cs-status" aria-hidden>
                    {state === 'done' ? '✓' : String(i + 1)}
                  </span>
                  <span className="cs-course__text">
                    <span className="cs-course__title">{c.title}</span>
                    <span className="cs-course__about">{c.about}</span>
                  </span>
                  <span className="cs-course__length">{c.minutes} min</span>
                  <span className="cs-course__progress" aria-label={`${pct}% complete`}>
                    <span className="cs-bar" aria-hidden>
                      <span style={{ width: `${pct}%` }} />
                    </span>
                    <span className="cs-course__pct">{state === 'done' ? 'Complete' : `${pct}%`}</span>
                  </span>
                  <span className="cs-course__cta">
                    {state === 'done' ? 'Review' : state === 'part' ? 'Continue' : 'Start'}
                    <span aria-hidden>{' →'}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
