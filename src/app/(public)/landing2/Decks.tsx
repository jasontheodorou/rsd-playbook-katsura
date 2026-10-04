'use client'

import Link from 'next/link'

import { usePathway } from '../modular/shared'

/** Each module's drawing: the playbook's own hand-drawn ink and orange (from the participation model), as stand-ins. */
const DRAWINGS = ['/illustrations/participation/involve-tile.png', '/illustrations/participation/collaborate-tile.png', '/illustrations/participation/grow-tile.png']

/*
 * Landing option 4, Decks (2 October 2026). The pathway is made of cards, so each module is shown
 * as a deck: a white card with its name, and the cards still to read as thin sheets behind it. The
 * deck thins as you read; a finished module is a single card with a slate tick. Pointing at a deck
 * lifts its top card and fans the rest a little. Three decks on one warm band; few words around them.
 */
export function Decks() {
  const p = usePathway()
  const next = p.all.find((e) => !p.isDone(e.c.id))
  return (
    <div className="dk">
      <header className="dk-hero">
        <p className="eyebrow">Pathway two</p>
        <h1 className="dk-title">
          Shape your practice<span className="ml-stop" aria-hidden />
        </h1>
        <p className="dk-statement">
          <span>{p.modules.length} decks of short cards on how we work.</span> Pick one up, read a card at a time.
        </p>
        {next && (
          <Link className="dk-resume" href={`/modular?o=1&m=${next.m.id}`}>
            {p.count > 0 ? 'Continue' : 'Start'} with <strong>{next.c.title}</strong>
            <span aria-hidden>{' →'}</span>
          </Link>
        )}
      </header>

      <ol className="dk-table" aria-label="The modules">
        {p.modules.map((m, i) => {
          const done = m.cards.filter((c) => p.isDone(c.id)).length
          const left = m.cards.length - done
          const complete = left === 0
          const mins = m.cards.reduce((t, c) => t + c.minutes, 0)
          return (
            <li key={m.id} className="dk-deck" data-complete={complete}>
              <Link href={`/modular?o=1&m=${m.id}`} className="dk-deck__link" aria-label={`${m.title}: ${complete ? 'complete' : `${done} of ${m.cards.length} read`}`}>
                <span className="dk-pile" aria-hidden>
                  {Array.from({ length: Math.min(Math.max(left - 1, 0), 8) }, (_, k) => (
                    <span key={k} className="dk-sheet" style={{ ['--k' as string]: k + 1 }} />
                  ))}
                  <span className="dk-card">
                    <span className="dk-card__n">{String(i + 1).padStart(2, '0')}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="dk-card__art" src={DRAWINGS[i % DRAWINGS.length]} alt="" />
                    <span className="dk-card__title">{m.title}</span>
                    <span className="dk-card__squares">
                      {m.cards.map((c) => (
                        <span key={c.id} data-done={p.isDone(c.id)} />
                      ))}
                    </span>
                    <span className="dk-card__meta">
                      {complete ? (
                        <span className="dk-card__done">✓ Complete</span>
                      ) : (
                        <>
                          {m.cards.length} cards · {mins} min
                        </>
                      )}
                    </span>
                  </span>
                </span>
                <span className="dk-deck__under">
                  <span className="dk-deck__status">{complete ? 'All read' : done > 0 ? `${left} left to read` : `${m.cards.length} to read`}</span>
                  <span className="dk-deck__cta">
                    {complete ? 'Look again' : done > 0 ? 'Continue' : 'Start'}
                    <span aria-hidden>{' →'}</span>
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
