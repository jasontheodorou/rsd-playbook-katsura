import type { ReactNode } from 'react'

import { Diagram, IconControl, IconTiles } from './BentoIcons'
import { BENEFITS } from './data'

type Version = { id: string; name: string; rule: string; demo: ReactNode }

const VERSIONS: Version[] = [
  {
    id: 'A',
    name: 'Icon tiles',
    rule: 'The bento with each small tile led by a line icon and an explicit “+ Open” cue. Unread tiles carry a small “New” marker. The large tile starts as a prompt, then draws the chosen icon in.',
    demo: <IconTiles items={BENEFITS} />,
  },
  {
    id: 'B',
    name: 'Interactive diagram',
    rule: 'The large tile becomes an SVG diagram: good design at the centre, five icon squares around it. Choosing a square draws its spoke from the centre and opens its passage beside the diagram.',
    demo: <Diagram items={BENEFITS} />,
  },
  {
    id: 'C',
    name: 'Icon control',
    rule: 'A large panel above a row of five icon buttons, each with a short label, and a slim line that fills as you explore. The fewest words until you choose.',
    demo: <IconControl items={BENEFITS} />,
  },
]

export function BentoIconsVersions() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">02</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Bento, with icons</h1>
          <p className="accp-intro__lede">
            Three versions of the bento discovery grid that lead with simple line icons and make it
            clear the reader should choose.
          </p>
        </header>
        {VERSIONS.map((v) => (
          <section key={v.id} className="accp-design" aria-labelledby={`bx-${v.id}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{v.id}</span>
              <h2 id={`bx-${v.id}`} className="accp-design__name">
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
