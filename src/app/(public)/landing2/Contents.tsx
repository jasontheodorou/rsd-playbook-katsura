'use client'

import Link from 'next/link'

import { usePathway } from '../modular/shared'

/*
 * Landing option 1, Course (2 October 2026). Shape your practice as modular learning, in the
 * playbook's own type, paper, hairlines and slate. Its signature is the module view's small square
 * marker: one square per card, filling slate as you go, on your learning panel and on each module.
 * The modules are three equal course tiles in the module view's hairline-card language, joined in
 * order; a short "how it works" closes the page.
 */
export function Contents() {
  const p = usePathway()
  const started = p.count > 0
  const minutes = p.all.reduce((t, e) => t + e.c.minutes, 0)
  const next = p.all.find((e) => !p.isDone(e.c.id))

  return (
    <div className="mc">
      <header className="mc-hero">
        <div className="mc-hero__text">
          <p className="eyebrow">Pathway two · Modular learning</p>
          <h1 className="mc-title">
            Shape your practice<span className="ml-stop" aria-hidden />
          </h1>
          <p className="mc-statement">
            <span>Short modules on the methods and habits behind good work at Transform.</span> Take them in order, a card at a
            time, and pick up wherever you left off.
          </p>
        </div>

        <aside className="mc-you" aria-label="Your learning">
          <p className="mc-label">Your learning</p>
          <span className="mc-squares mc-squares--all" aria-hidden>
            {p.all.map((e) => (
              <span key={e.c.id} data-done={p.isDone(e.c.id)} />
            ))}
          </span>
          <p className="mc-you__count">
            <strong>{p.count}</strong> of {p.total} cards · {p.modules.length} modules · about {Math.round(minutes / 60)} hours
          </p>
          {next && (
            <Link className="mc-you__go" href={`/modular?o=1&m=${next.m.id}`}>
              {started ? 'Continue' : 'Start'}: {next.c.title}
              <span aria-hidden>{' →'}</span>
            </Link>
          )}
        </aside>
      </header>

      <section aria-labelledby="mc-modules">
        <h2 id="mc-modules" className="mc-label">
          The modules
        </h2>
        <ol className="mc-modules">
          {p.modules.map((m, i) => {
            const done = m.cards.filter((c) => p.isDone(c.id)).length
            const complete = done === m.cards.length
            const mins = m.cards.reduce((t, c) => t + c.minutes, 0)
            return (
              <li key={m.id} className="mc-tile" data-complete={complete}>
                <Link href={`/modular?o=1&m=${m.id}`} className="mc-tile__link">
                  <span className="mc-tile__band">
                    <span>Module {String(i + 1).padStart(2, '0')}</span>
                    <span>
                      {m.cards.length} cards · {mins} min
                    </span>
                  </span>
                  <span className="mc-tile__body">
                    <span className="mc-tile__title">{m.title}</span>
                    <span className="mc-tile__desc">{m.description}</span>
                  </span>
                  <span className="mc-tile__foot">
                    <span className="mc-squares" aria-hidden>
                      {m.cards.map((c) => (
                        <span key={c.id} data-done={p.isDone(c.id)} />
                      ))}
                    </span>
                    <span className="mc-tile__count">{complete ? 'Complete' : `${done} of ${m.cards.length}`}</span>
                    <span className="mc-tile__cta">
                      {complete ? 'Look again' : done > 0 ? 'Continue' : 'Start'}
                      <span aria-hidden>{' →'}</span>
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

      <section className="mc-how" aria-labelledby="mc-how">
        <h2 id="mc-how" className="mc-label">
          How it works
        </h2>
        <ol>
          <li>
            <span>01</span>Choose a module, or carry on with the next.
          </li>
          <li>
            <span>02</span>Read one short card at a time, in a few minutes.
          </li>
          <li>
            <span>03</span>Mark it complete, and watch your squares fill.
          </li>
        </ol>
      </section>
    </div>
  )
}
