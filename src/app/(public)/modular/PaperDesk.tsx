'use client'

import { Words, usePathway } from './shared'

/** Each module's plane, from the page's own plane tones (pale blue, yellow, terracotta). */
const PLANES = ['#cbd9da', '#f3e2a4', '#e6cbbd', '#d9d4ce']

/*
 * Approach 3, Paper desk. The photograph-with-plane and the role drawings on paper: the card is a
 * sheet of paper on its module's coloured plane, set one grid gap behind; the module's unread cards
 * lie as a stack beneath it, so the pile thins as you go. The tasks sit in the quiet accordion's
 * tinted rows, with its grey square markers, which turn ink once done.
 */
export function PaperDesk() {
  const p = usePathway()
  const { current } = p
  const mi = p.modules.findIndex((m) => m.id === current.m.id)
  const done = p.isDone(current.c.id)
  const left = current.m.cards.filter((c) => !p.isDone(c.id) && c.id !== current.c.id).length
  return (
    <div className="pd">
      <nav className="pd-nav" aria-label="Your pathway">
        <p className="pd-total" aria-label={`${p.count} of ${p.total} complete`}>
          <span className="pd-squares" aria-hidden>
            {p.all.map((e) => (
              <span key={e.c.id} data-done={p.isDone(e.c.id)} />
            ))}
          </span>
          <span>
            {p.count} of {p.total}
          </span>
        </p>
        {p.modules.map((m, i) => (
          <section key={m.id} className="pd-module" style={{ ['--plane' as string]: PLANES[i % PLANES.length] }}>
            <h2>
              <span className="pd-module__swatch" aria-hidden />
              {m.title}
            </h2>
            <ol>
              {m.cards.map((c) => (
                <li key={c.id}>
                  <button type="button" className="pd-task" data-done={p.isDone(c.id)} aria-current={c.id === current.c.id} onClick={() => p.open(c.id)}>
                    <span className="pd-task__mark" aria-hidden />
                    <span>{c.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </nav>

      <div className="pd-desk" style={{ ['--plane' as string]: PLANES[mi % PLANES.length] }}>
        <p className="pd-desk__note">
          {current.m.title} · {left === 0 ? 'last card in this module' : `${left} more ${left === 1 ? 'card' : 'cards'} in this pile`}
        </p>
        <div className="pd-stack">
          <span className="pd-plane" aria-hidden />
          {Array.from({ length: Math.min(left, 4) }, (_, k) => (
            <span key={k} className="pd-sheet" style={{ ['--k' as string]: k + 1 }} aria-hidden />
          ))}
          <article className="pd-card" key={current.c.id} data-done={done}>
            <p className="pd-card__eyebrow">
              {current.i + 1} of {current.m.cards.length} · {current.c.minutes} min
            </p>
            <h1 className="pd-card__title">{current.c.title}</h1>
            <Words item={current.c} className="pd-words" />
            <footer className="pd-card__end">
              <button type="button" className="pd-done" onClick={() => p.toggle()} data-done={done}>
                <span className="pd-done__box" aria-hidden />
                {done ? 'Completed' : 'Mark as complete'}
              </button>
            </footer>
          </article>
        </div>
      </div>
    </div>
  )
}
