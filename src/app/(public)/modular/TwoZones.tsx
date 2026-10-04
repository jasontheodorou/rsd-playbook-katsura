'use client'

import { Words, usePathway } from './shared'

/*
 * Approach 1, Two zones. The benefits card's and data path's rule: separate the control from its
 * result by surface, not by space. One hairline card with 4px corners split on a grid line: the
 * tasks on the warm tint, the card on white, one inset from the card's edge on both. The only
 * accent is the refined standard's slate, for a finished task and the progress line.
 */
export function TwoZones() {
  const p = usePathway()
  const { current } = p
  const done = p.isDone(current.c.id)
  const pct = p.total ? p.count / p.total : 0
  return (
    <div className="tz">
      <aside className="tz-nav" aria-label="Your pathway">
        <p className="tz-count">
          <span>{String(p.count).padStart(2, '0')}</span> of {p.total} complete
        </p>
        <span className="tz-progress" aria-hidden>
          <span style={{ width: `${pct * 100}%` }} />
        </span>
        {p.modules.map((m) => {
          const n = m.cards.filter((c) => p.isDone(c.id)).length
          return (
            <section key={m.id} className="tz-module">
              <h2 className="tz-module__name">
                {m.title}
                <span>
                  {n}/{m.cards.length}
                </span>
              </h2>
              <ol>
                {m.cards.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className="tz-task"
                      data-done={p.isDone(c.id)}
                      aria-current={c.id === current.c.id}
                      onClick={() => p.open(c.id)}
                    >
                      <span className="tz-task__mark" aria-hidden />
                      <span className="tz-task__title">{c.title}</span>
                      <span className="tz-task__min">{c.minutes}m</span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          )
        })}
      </aside>

      <article className="tz-card" key={current.c.id}>
        <p className="tz-card__count">
          {current.m.title} · {String(current.i + 1).padStart(2, '0')} of {String(current.m.cards.length).padStart(2, '0')}
        </p>
        <h1 className="tz-card__title">{current.c.title}</h1>
        <Words item={current.c} className="tz-words" />
        <footer className="tz-card__end">
          <button type="button" className="tz-done" data-done={done} onClick={() => p.toggle()}>
            <span className="tz-done__mark" aria-hidden />
            {done ? 'Completed' : 'Mark as complete'}
          </button>
          <span className="tz-card__min">{current.c.minutes} minute read</span>
        </footer>
      </article>
    </div>
  )
}
