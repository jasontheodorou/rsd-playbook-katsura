import type { ReactNode } from 'react'

import '../accordions/accordions.css'
import { BENEFITS } from './data'
import { Bento, ExpandingColumns, FlipCards, ProgressTiles, TilesPanel } from './DiscoveryGrids'
import './grid.css'

export const metadata = { title: 'Discovery grid options. The RSD Playbook' }

/**
 * Five versions of the discovery grid (five benefits the reader uncovers), in the Who we are frame
 * and on the gold standard's grid. Each keeps every passage in the page without JavaScript.
 */

type Version = { id: string; name: string; rule: string; demo: ReactNode }

const VERSIONS: Version[] = [
  {
    id: '1',
    name: 'Tiles and panel',
    rule: 'Five equal tiles in soft tints across columns 2 to 12. Choosing one deepens its tint and shows its passage in a matching panel below; a quiet count keeps track.',
    demo: <TilesPanel items={BENEFITS} />,
  },
  {
    id: '2',
    name: 'Bento',
    rule: 'A large tile beside four small ones. The chosen benefit fills the large tile with its lead-in and passage, so the reading happens in place.',
    demo: <Bento items={BENEFITS} />,
  },
  {
    id: '3',
    name: 'Flip cards',
    rule: 'Each tile turns over to show its passage on the back, and stays turned, so the grid records what has been read.',
    demo: <FlipCards items={BENEFITS} />,
  },
  {
    id: '4',
    name: 'Progress count',
    rule: 'Numbered tiles under a slim progress bar that fills as each benefit is found. A found tile gains a small tick; the passage appears below.',
    demo: <ProgressTiles items={BENEFITS} />,
  },
  {
    id: '5',
    name: 'Expanding columns',
    rule: 'Five tall columns. The chosen column widens to show its passage while the others narrow to their lead-in, like the head, heart and hands panels.',
    demo: <ExpandingColumns items={BENEFITS} />,
  },
]

export default function GridPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">02</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Discovery grid</h1>
          <p className="accp-intro__lede">
            Five ways to let readers uncover the benefits of good design, one at a time, on the
            Foundations grid.
          </p>
        </header>
        {VERSIONS.map((v) => (
          <section key={v.id} className="accp-design" aria-labelledby={`dg-${v.id}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{v.id.padStart(2, '0')}</span>
              <h2 id={`dg-${v.id}`} className="accp-design__name">
                {v.name}
              </h2>
              <p className="accp-design__rule">{v.rule}</p>
            </div>
            <div className="accp-design__demo">{v.demo}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
