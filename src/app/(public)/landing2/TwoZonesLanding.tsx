'use client'

import Link from 'next/link'

import { usePathway } from '../modular/shared'

/*
 * Landing option 2, Two zones. The module view zoomed out: one hairline card in the same two
 * surfaces. On the warm tint, the title, the statement, your progress and the way back in; on white,
 * the three modules as a quiet list, each with its progress line.
 */
export function TwoZonesLanding() {
  const p = usePathway()
  const minutes = p.all.reduce((t, e) => t + e.c.minutes, 0)
  const next = p.all.find((e) => !p.isDone(e.c.id))
  return (
    <div className="lz">
      <section className="lz-intro">
        <p className="eyebrow">Pathway two</p>
        <h1 className="lz-title">
          Shape your practice<span className="ml-stop" aria-hidden />
        </h1>
        <p className="lz-statement">
          <span>The methods and habits behind good work at Transform.</span> {p.modules.length} short modules, about{' '}
          {Math.round(minutes / 60)} hours in all.
        </p>
        {/* One photograph of the work, from the playbook's own photos, in the space a list would have filled. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="lz-photo" src="/photos/workshop-teaching.jpg" alt="A designer leading a workshop at a whiteboard." />
        {next && (
          <Link className="lz-go" href={`/modular?o=1&m=${next.m.id}`}>
            <span className="lz-go__label">{p.count > 0 ? 'Continue where you left off' : 'Start here'}</span>
            <span className="lz-go__title">{next.c.title}</span>
            <span className="lz-go__meta">
              {p.count} of {p.total} cards complete
            </span>
          </Link>
        )}
      </section>

      <ol className="lz-modules" aria-label="The modules">
        {p.modules.map((m, i) => {
          const done = m.cards.filter((c) => p.isDone(c.id)).length
          const mins = m.cards.reduce((t, c) => t + c.minutes, 0)
          return (
            <li key={m.id}>
              <Link className="lz-module" href={`/modular?o=1&m=${m.id}`} data-complete={done === m.cards.length}>
                <span className="lz-module__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="lz-module__body">
                  <span className="lz-module__title">
                    {m.title}
                    <span className="lz-module__arrow" aria-hidden>
                      →
                    </span>
                  </span>
                  <span className="lz-module__desc">{m.description}</span>
                </span>
                <span className="lz-module__count">{done === m.cards.length ? 'Done' : done > 0 ? `${done} of ${m.cards.length}` : `${mins} min`}</span>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
