'use client'

import Link from 'next/link'

/*
 * Landing option 5, Eight decks (2 October 2026). Option 4's decks for the eight chapters Jason
 * listed, each named in three words or fewer. The chapters have no cards yet, so card counts and
 * drawings are stand-ins: the drawings are the playbook's own (the participation model's and the
 * roles'), and every deck shows as unread. Each opens the stand-in module view for now.
 */
type Deck = { title: string; full: string; cards: number; art: string }

const DECKS: Deck[] = [
  { title: 'Our RSD manifesto', full: 'Our RSD Manifesto', cards: 5, art: '/illustrations/participation/engage-tile.png' },
  { title: 'Our practice standards', full: 'The Standards of Our Practice', cards: 7, art: '/illustrations/roles/research.svg' },
  { title: 'Know your account', full: 'Get to know your account', cards: 4, art: '/illustrations/roles/service.svg' },
  { title: 'Ways of working', full: 'Ways of Working', cards: 6, art: '/illustrations/participation/involve-tile.png' },
  { title: 'Methods and tools', full: 'Ways of Working, Methods & Tools', cards: 8, art: '/illustrations/participation/collaborate-tile.png' },
  { title: 'Your discipline’s methods', full: 'Methods and best practice for your discipline', cards: 8, art: '/illustrations/roles/interaction.svg' },
  { title: 'Measuring our impact', full: 'Measuring Impact', cards: 5, art: '/illustrations/participation/grow-tile.png' },
  { title: 'Showcase and examples', full: 'Showcase & Examples', cards: 6, art: '/illustrations/roles/content.svg' },
]

export function EightDecks() {
  const total = DECKS.reduce((t, d) => t + d.cards, 0)
  return (
    <div className="dk dk--eight">
      <header className="dk-hero">
        <p className="eyebrow">Pathway two</p>
        <h1 className="dk-title">
          Shape your practice<span className="ml-stop" aria-hidden />
        </h1>
        <p className="dk-statement">
          <span>{DECKS.length} decks of short cards on how we work.</span> Pick one up, read a card at a time.
        </p>
        <p className="dk-resume">
          {total} cards in all · Start with <strong>{DECKS[0].title}</strong>
          <span aria-hidden>{' →'}</span>
        </p>
      </header>

      <ol className="dk-table" aria-label="The modules">
        {DECKS.map((d, i) => (
          <li key={d.title} className="dk-deck">
            <Link href="/modular?o=1" className="dk-deck__link" aria-label={`${d.full}: ${d.cards} cards to read`}>
              <span className="dk-pile" aria-hidden>
                {Array.from({ length: Math.min(d.cards - 1, 8) }, (_, k) => (
                  <span key={k} className="dk-sheet" style={{ ['--k' as string]: k + 1 }} />
                ))}
                <span className="dk-card">
                  <span className="dk-card__n">{String(i + 1).padStart(2, '0')}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="dk-card__art" src={d.art} alt="" />
                  <span className="dk-card__title">{d.title}</span>
                  <span className="dk-card__squares">
                    {Array.from({ length: d.cards }, (_, k) => (
                      <span key={k} />
                    ))}
                  </span>
                  <span className="dk-card__meta">{d.cards} cards</span>
                </span>
              </span>
              <span className="dk-deck__under">
                <span className="dk-deck__status">{d.cards} to read</span>
                <span className="dk-deck__cta">
                  Start<span aria-hidden>{' →'}</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
