import type { ReactNode } from 'react'

import {
  Contents,
  Exploded,
  ExplodedGlow,
  ExplodedGreyOrange,
  ExplodedHalftone,
  ExplodedOutlines,
  ExplodedRings,
  ExplodedTints,
  Journey,
  MarkLarge,
  Numeral,
  PhotoCircle,
  ProgressRings,
} from './visuals'
import './pageheaders.css'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Page header executions. The RSD Playbook' }

type Execution = { n: string; title: string; note: string; visual: ReactNode }

const executions: Execution[] = [
  {
    n: '01',
    title: 'The mark, large',
    note: 'The circle that grew out of the card simply stays, at full size. One object from grid to page, nothing new to learn.',
    visual: <MarkLarge />,
  },
  {
    n: '02',
    title: 'The journey',
    note: 'All six chapter marks in outline along an arc, this one solid. The header says where you are in the six.',
    visual: <Journey />,
  },
  {
    n: '03',
    title: 'The numeral',
    note: 'The chapter number as very large, very light type, with the mark\u2019s colour as a disc behind it. Editorial, quiet.',
    visual: <Numeral n="04" />,
  },
  {
    n: '04',
    title: 'The mark, taken apart',
    note: 'The three orbs of the mark enlarged and overlapping, drifting almost imperceptibly. Each chapter\u2019s mark would come apart in its own way.',
    visual: <Exploded />,
  },
  {
    n: '05',
    title: 'A photograph in the circle',
    note: 'The chapter\u2019s photograph masked round, with a hairline ring and a single orange point. Real people, inside the brand\u2019s one shape.',
    visual: <PhotoCircle />,
  },
  {
    n: '06',
    title: 'Progress rings',
    note: 'The mark at the centre, and an outer ring that fills as you read down the page. The header does a job as well as filling the space.',
    visual: <ProgressRings />,
  },
  {
    n: '07',
    title: 'Contents as a path',
    note: 'The chapter\u2019s sections as stops on a vertical line under the mark. A map of what is coming, and each stop can be a link.',
    visual: <Contents />,
  },
]

const variations: Execution[] = [
  {
    n: '04a',
    title: 'Outlines',
    note: 'The same three orbs as hairlines in their own colours. Where they cross is left to the eye.',
    visual: <ExplodedOutlines />,
  },
  {
    n: '04b',
    title: 'Tints',
    note: 'The orbs at about a sixth of their strength. Where they overlap the colour deepens, like layered tissue.',
    visual: <ExplodedTints />,
  },
  {
    n: '04c',
    title: 'Glow',
    note: 'Soft discs that fade to nothing at the edge. Light rather than paint; the calmest of the set.',
    visual: <ExplodedGlow />,
  },
  {
    n: '04d',
    title: 'Halftone',
    note: 'The orbs as fields of tiny dots that thin out towards the edge. A texture more than a shape.',
    visual: <ExplodedHalftone />,
  },
  {
    n: '04e',
    title: 'Rings',
    note: 'Each orb as three thin concentric rings, breathing very slowly. Structure without any fill.',
    visual: <ExplodedRings />,
  },
  {
    n: '04f',
    title: 'Grey, with one orange',
    note: 'Two orbs in the paper\u2019s own greys and the smallest in orange. The brand\u2019s rule kept to the letter.',
    visual: <ExplodedGreyOrange />,
  },
]

function Section({ e }: { e: Execution }) {
  return (
    <section className="ph__execution" aria-labelledby={`ex-${e.n}`}>
      <div className="ph__label">
        <span className="ph__num">{e.n}</span>
        <h2 id={`ex-${e.n}`} className="ph__name">
          {e.title}
        </h2>
        <p className="ph__note">{e.note}</p>
      </div>
      <div className="ph__frame">
        <div className="ph__hero">
          <div className="ph__text">
            <span className="pilot-marker">
              <span className="pilot-marker__num">04</span>
              <span className="pilot-marker__rule" aria-hidden="true" />
              <span>Our philosophy</span>
            </span>
            <p className="ph__headline">Head, heart and hands.</p>
            <p className="ph__lede">
              Our Head, Heart, Hands philosophy brings together clear thinking, genuine care and
              practical action.
            </p>
            <p className="ph__lede">
              It helps organisations build better cultures and create services that make a real
              difference to people&rsquo;s lives.
            </p>
          </div>
          <div className="ph__art">{e.visual}</div>
        </div>
      </div>
    </section>
  )
}

/** Candidates for the space beside a chapter heading, each shown in place. */
export default function PageHeadersPage() {
  return (
    <div className="ph">
      <header className="ph__intro">
        <p className="eyebrow">Design options</p>
        <h1 className="ph__title">Page header executions</h1>
        <p className="ph__blurb">
          Seven ways to fill the space beside a chapter heading once the illustration goes. Each is
          shown in place with the real heading and opening text. Motion is slow and switches off
          under reduced motion.
        </p>
      </header>

      {executions.map((e) => (
        <Section key={e.n} e={e} />
      ))}

      <header className="ph__intro ph__intro--sub">
        <p className="eyebrow">Variations on 04</p>
        <h2 className="ph__title ph__title--sub">The mark, taken apart, but quieter</h2>
        <p className="ph__blurb">
          Six subtler treatments of the same idea: three orbs from the chapter mark, enlarged and
          overlapping. Less ink each time.
        </p>
      </header>

      {variations.map((e) => (
        <Section key={e.n} e={e} />
      ))}
    </div>
  )
}
