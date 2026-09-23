import type { ReactNode } from 'react'

import {
  Bookmark,
  CornerRing,
  DotsColumn,
  EdgeGlow,
  EditorialStrip,
  FloatingPill,
  InsetRail,
  MarginContents,
  RailRefined,
  PillWithFoot,
  ThreadBead,
} from './options'
import './sidenav.css'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Side navigation options. The RSD Playbook' }

type Option = { n: string; title: string; note: string; nav: ReactNode }

const options: Option[] = [
  {
    n: '01',
    title: 'The rail, refined',
    note: 'The original 48px column kept, with a thinner ribbon and the back control moved to the foot so it sits where you finish.',
    nav: <RailRefined />,
  },
  {
    n: '02',
    title: 'Thread and bead',
    note: 'A hairline thread down the edge with a bead travelling along it as you read. At the bottom the bead is the way back.',
    nav: <ThreadBead />,
  },
  {
    n: '03',
    title: 'Floating pill',
    note: 'A soft vertical pill set in from the edge: the chapter number at the top, the fill inside, the way back at the foot.',
    nav: <FloatingPill />,
  },
  {
    n: '04',
    title: 'Dots column',
    note: 'The six chapters as dots down the edge. This one is ringed and the ring fills as you read; the top dot is home.',
    nav: <DotsColumn />,
  },
  {
    n: '05',
    title: 'Margin contents',
    note: 'The chapter\u2019s sections as small labels down the edge, joined by a thread that fills. \u201cFoundations\u201d at the top is the way back.',
    nav: <MarginContents />,
  },
  {
    n: '06',
    title: 'Corner ring',
    note: 'A small progress ring in the bottom-left corner with the chapter mark inside. When it is full, it is the way back.',
    nav: <CornerRing />,
  },
  {
    n: '07',
    title: 'Edge glow',
    note: 'No line at all. A soft terracotta light along the edge that deepens as you read. The way back is the top bar trail.',
    nav: <EdgeGlow />,
  },
  {
    n: '08',
    title: 'Editorial strip',
    note: 'A slim strip with \u201cChapter 04\u201d set vertically at the top, the ribbon beneath, and a small arrow at the foot.',
    nav: <EditorialStrip />,
  },
  {
    n: '09',
    title: 'Bookmark',
    note: 'A terracotta ribbon hanging from the top edge whose length is your progress. Its tail is the way back.',
    nav: <Bookmark />,
  },
  {
    n: '10',
    title: 'Inset rail',
    note: 'The original idea with its hard edges gone: a rounded rail floated in from the edge, and a round back button at its foot.',
    nav: <InsetRail />,
  },
]

const feet: {
  n: string
  title: string
  note: string
  foot: Parameters<typeof PillWithFoot>[0]['foot']
}[] = [
  {
    n: 'F1',
    title: 'Bar',
    note: 'A short horizontal bar, the width of the pill. A full stop drawn as a line.',
    foot: 'bar',
  },
  {
    n: 'F2',
    title: 'Diamond',
    note: 'A small square turned 45 degrees. Sharper than the square, still tiny.',
    foot: 'diamond',
  },
  {
    n: 'F3',
    title: 'Word',
    note: 'The word \u201cBack\u201d set the same way as the number above. Type at both ends of the pill, no mark at all.',
    foot: 'word',
  },
  {
    n: 'F4',
    title: 'Tab',
    note: 'No separate mark. The last stretch of the pill itself is a deeper tab, and pressing it is the way back.',
    foot: 'tab',
  },
  {
    n: 'F5',
    title: 'Wedge',
    note: 'A small triangle pointing left, the direction of home. Filled, not drawn.',
    foot: 'wedge',
  },
  {
    n: 'F6',
    title: 'Cross',
    note: 'Two hairlines crossed. The universal mark for close, at hairline weight.',
    foot: 'cross',
  },
  {
    n: 'F7',
    title: 'Six ticks',
    note: 'The six chapters as tiny horizontal ticks, this one darker. The grid in miniature, without dots.',
    foot: 'ticks',
  },
  {
    n: 'F8',
    title: 'Two bars',
    note: 'The original hamburger\u2019s lines, reduced to two. Familiar, and it says \u201cmenu\u201d without saying it loudly.',
    foot: 'twobars',
  },
]

/** Ten side-navigation designs, each on a mock of the chapter page. Progress shown at about 55 per cent. */
export default function SideNavPage() {
  return (
    <div className="snp">
      <header className="snp__intro">
        <p className="eyebrow">Design options</p>
        <h1 className="snp__title">Side navigation</h1>
        <p className="snp__blurb">
          Ten ways to show reading progress down the page and offer a way back to the Foundations
          grid, all in the terracotta of the original rail. Progress is shown at about 55 per cent;
          some loop slowly to show the fill.
        </p>
      </header>

      {options.map((o) => (
        <section key={o.n} className="snp__option" aria-labelledby={`sn-${o.n}`}>
          <div className="snp__label">
            <span className="snp__num">{o.n}</span>
            <h2 id={`sn-${o.n}`} className="snp__name">
              {o.title}
            </h2>
            <p className="snp__note">{o.note}</p>
          </div>
          <div className="snp__frame">
            {o.nav}
            <div className="snp__page">
              <span className="snp__marker">
                <span className="snp__marker-num">04</span>
                <span className="snp__marker-rule" aria-hidden="true" />
                <span>Our philosophy</span>
              </span>
              <p className="snp__headline">
                Head, heart and hands
                <span className="snp__stop" aria-hidden="true" />
              </p>
              <p className="snp__lede">
                Our Head, Heart, Hands philosophy brings together clear thinking, genuine care and
                practical action.
              </p>
              <p className="snp__body">
                We are passionate about building services that truly transform lives and make the
                world a better place through design. That is captured in our research and design
                philosophy.
              </p>
            </div>
          </div>
        </section>
      ))}

      <header className="snp__intro snp__intro--sub">
        <p className="eyebrow">Option 3, the foot</p>
        <h2 className="snp__title snp__title--sub">
          Eight marks for the way back, none of them circles
        </h2>
        <p className="snp__blurb">
          The floating pill as chosen, with eight different marks at its foot.
        </p>
      </header>

      <div className="snp__feet">
        {feet.map((f) => (
          <section key={f.n} className="snp__foot-option" aria-labelledby={`sn-${f.n}`}>
            <div className="snp__frame snp__frame--short">
              <PillWithFoot foot={f.foot} />
              <div className="snp__page snp__page--faint">
                <p className="snp__headline snp__headline--sm">
                  Head, heart and hands
                  <span className="snp__stop" aria-hidden="true" />
                </p>
                <p className="snp__body">
                  We are passionate about building services that truly transform lives and make the
                  world a better place through design.
                </p>
              </div>
            </div>
            <div className="snp__label snp__label--tight">
              <span className="snp__num">{f.n}</span>
              <h3 id={`sn-${f.n}`} className="snp__name snp__name--sm">
                {f.title}
              </h3>
              <p className="snp__note">{f.note}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
