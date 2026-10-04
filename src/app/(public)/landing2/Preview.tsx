'use client'

import Link from 'next/link'

import { usePathway } from '../modular/shared'

/*
 * Landing option 3, Preview. A short opening, then each module as a full-width band: a large faint
 * number, its title and description, and its cards laid out as the module view's small task
 * rectangles, square markers and all, so you see what is inside and what you have already done.
 */
export function Preview() {
  const p = usePathway()
  return (
    <div className="lp">
      <header className="lp-hero">
        <p className="eyebrow">Pathway two</p>
        <h1 className="lp-title">
          Shape your practice<span className="ml-stop" aria-hidden />
        </h1>
        <p className="lp-statement">
          {p.modules.length} modules. {p.total} short cards. <span>Read one, mark it complete, and come back whenever you like.</span>
        </p>
      </header>

      <ol className="lp-modules" aria-label="The modules">
        {p.modules.map((m, i) => {
          const done = m.cards.filter((c) => p.isDone(c.id)).length
          const mins = m.cards.reduce((t, c) => t + c.minutes, 0)
          const started = done > 0
          return (
            <li key={m.id} className="lp-module">
              <span className="lp-module__n" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="lp-module__text">
                <h2 className="lp-module__title">{m.title}</h2>
                <p className="lp-module__desc">{m.description}</p>
                <p className="lp-module__meta">
                  {done === m.cards.length ? 'Complete' : `${done} of ${m.cards.length} done`} · {mins} min
                </p>
                <Link className="lp-module__go" href={`/modular?o=1&m=${m.id}`}>
                  {done === m.cards.length ? 'Look again' : started ? 'Continue' : 'Start'} →
                </Link>
              </div>
              <ul className="lp-cards" aria-label={`${m.title}: cards`}>
                {m.cards.map((c) => (
                  <li key={c.id} data-done={p.isDone(c.id)}>
                    <span className="lp-cards__mark" aria-hidden />
                    {c.title}
                    <span className="lp-sr">{p.isDone(c.id) ? ', complete' : ''}</span>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
