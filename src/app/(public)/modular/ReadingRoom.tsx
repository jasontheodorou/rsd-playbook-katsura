'use client'

import { Words, usePathway } from './shared'

/*
 * Approach 2, Reading room. The Foundations chapter page, with no box: the rail's progress track
 * runs beside a quiet, sticky task list on page columns 1 to 3, and the card reads like a chapter
 * on columns 5 to 11, in the chapter's body text, under a display title with the page's one orange
 * full stop. It ends in a mark that blooms from outline to pastel when the card is complete.
 */
export function ReadingRoom() {
  const p = usePathway()
  const { current } = p
  const done = p.isDone(current.c.id)
  return (
    <div className="rr">
      <nav className="rr-nav" aria-label="Your pathway">
        <span className="rr-track" aria-hidden>
          <span style={{ transform: `scaleY(${p.total ? p.count / p.total : 0})` }} />
        </span>
        <div className="rr-list">
          <p className="rr-count">
            {p.count} of {p.total} read
          </p>
          {p.modules.map((m) => (
            <section key={m.id} className="rr-module">
              <h2>{m.title}</h2>
              <ol>
                {m.cards.map((c) => (
                  <li key={c.id}>
                    <button type="button" className="rr-task" data-done={p.isDone(c.id)} aria-current={c.id === current.c.id} onClick={() => p.open(c.id)}>
                      {c.title}
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </nav>

      <article className="rr-page" key={current.c.id}>
        <p className="rr-eyebrow">
          {current.m.title} · {current.i + 1} of {current.m.cards.length} · {current.c.minutes} min
        </p>
        <h1 className="rr-title">
          {current.c.title}
          <span className="rr-stop" aria-hidden />
        </h1>
        <Words item={current.c} className="rr-words" />

        <footer className="rr-end" data-done={done}>
          <button type="button" className="rr-mark" onClick={() => p.toggle(false)} aria-label={done ? `${current.c.title}, read. Mark as unread` : `Mark ${current.c.title} as read`}>
            <svg viewBox="0 0 120 120" aria-hidden>
              <circle className="rr-mark__disc" cx="60" cy="60" r="57" />
              <circle className="rr-mark__bloom" cx="60" cy="60" r="57" />
              <path className="rr-mark__tick" d="M40 61l14 14 27-29" />
            </svg>
          </button>
          <div className="rr-after">
            <p className="rr-status" aria-live="polite">
              {done ? 'Card read.' : 'Select the mark when you have read this card.'}
            </p>
            {done && p.nextUp && (
              <button type="button" className="rr-next" onClick={() => p.open(p.nextUp!.id)}>
                Next: {p.nextUp.title}
              </button>
            )}
          </div>
        </footer>
      </article>
    </div>
  )
}
