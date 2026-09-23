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
  PhotoDuotone,
  PhotoEclipse,
  PhotoFade,
  PhotoHalo,
  PhotoHorizon,
  PhotoMono,
  PhotoOffEdge,
  PhotoOffsetRing,
  PhotoScreen,
  PhotoSmallOnDisc,
  PhotoSplit,
  PhotoTriad,
  ProgressRings,
  SplashBloom,
  SplashConfetti,
  SplashCorner,
  SplashGradient,
  SplashPools,
  SplashQuarter,
  SplashRipple,
  SplashWash,
  SplashAurora,
  SplashBand,
  SplashBlob,
  SplashBlock,
  SplashBrush,
  SplashStripes,
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

const photoVariations: Execution[] = [
  {
    n: '05a',
    title: 'Duotone',
    note: 'The photograph in navy and paper only, so it sits with the type rather than against it.',
    visual: <PhotoDuotone />,
  },
  {
    n: '05b',
    title: 'Three photographs',
    note: 'The mark\u2019s three orbs, each a photograph. Head, heart and hands, literally, drifting very slowly.',
    visual: <PhotoTriad />,
  },
  {
    n: '05c',
    title: 'Fade',
    note: 'The photograph inside the circle, dissolving into the paper towards its edge. No ring, no outline.',
    visual: <PhotoFade />,
  },
  {
    n: '05d',
    title: 'Off the edge',
    note: 'One very large circle, mostly beyond the page, with only a slice of photograph showing. The home page\u2019s orange circle, made of people.',
    visual: <PhotoOffEdge />,
  },
  {
    n: '05e',
    title: 'Monochrome, one orange point',
    note: 'The photograph in grey and the brand\u2019s one allowed colour as a small circle beside it.',
    visual: <PhotoMono />,
  },
  {
    n: '05f',
    title: 'Split',
    note: 'Half photograph, half flat colour, one circle. An echo of the What we do mark on the grid.',
    visual: <PhotoSplit />,
  },
]

const photoVariations2: Execution[] = [
  {
    n: '05g',
    title: 'Offset ring',
    note: 'A modest photograph with one large hairline circle set behind and to the side. Two circles, one filled.',
    visual: <PhotoOffsetRing />,
  },
  {
    n: '05h',
    title: 'Eclipse',
    note: 'A flat teal circle passing in front of the photograph, leaving a crescent of it. Drifts very slowly.',
    visual: <PhotoEclipse />,
  },
  {
    n: '05i',
    title: 'Small, on a disc',
    note: 'A little photograph resting low on a large pale disc, with one orange point. Mostly paper.',
    visual: <PhotoSmallOnDisc />,
  },
  {
    n: '05j',
    title: 'Horizon',
    note: 'Only the lower half of the circle carries the photograph, under a hairline horizon. The upper half is an outline.',
    visual: <PhotoHorizon />,
  },
  {
    n: '05k',
    title: 'Halo',
    note: 'A sharp small photograph inside a large, softly blurred version of itself. Colour without detail around the edge.',
    visual: <PhotoHalo />,
  },
  {
    n: '05l',
    title: 'Screen',
    note: 'The photograph seen through a fine dot screen in grey, so it reads as print rather than as a photo.',
    visual: <PhotoScreen />,
  },
]

const splashes: Execution[] = [
  {
    n: 'S1',
    title: 'Corner bleed',
    note: 'One large circle in the chapter colour running off the top-right corner. The home page\u2019s device, in this chapter\u2019s colour.',
    visual: <SplashCorner />,
  },
  {
    n: 'S2',
    title: 'Ink pools',
    note: 'The three colours as large translucent circles overlapping like ink, deepening where they meet.',
    visual: <SplashPools />,
  },
  {
    n: 'S3',
    title: 'Gradient orb',
    note: 'One large circle with the chapter\u2019s colours blending across it, sitting slightly off the edge.',
    visual: <SplashGradient />,
  },
  {
    n: 'S4',
    title: 'Confetti',
    note: 'Many small circles in the palette, thick near the corner and thinning out. Celebratory, still all circles.',
    visual: <SplashConfetti />,
  },
  {
    n: 'S5',
    title: 'Wash',
    note: 'Colour as atmosphere: a soft radial wash across the whole column with one solid point inside it. No hard edge anywhere.',
    visual: <SplashWash />,
  },
  {
    n: 'S6',
    title: 'Ripple',
    note: 'One colour in concentric steps of tint, spreading from a point like a drop landing. Breathes slowly.',
    visual: <SplashRipple />,
  },
  {
    n: 'S7',
    title: 'Bloom',
    note: 'The three colours at full strength, large, overlapping and running off the edge. The boldest of the set.',
    visual: <SplashBloom />,
  },
  {
    n: 'S8',
    title: 'Quarter',
    note: 'A quarter of a huge circle anchored in the corner in one colour, with the paper showing through a smaller circle.',
    visual: <SplashQuarter />,
  },
]

const splashesFree: Execution[] = [
  {
    n: 'S9',
    title: 'Brushstroke',
    note: 'One broad, loose stroke of orange across the column, like a swipe of paint. Hand-made against the geometry.',
    visual: <SplashBrush />,
  },
  {
    n: 'S10',
    title: 'Band',
    note: 'A broad angled band of colour crossing the corner, navy into teal. Direction and energy without a picture.',
    visual: <SplashBand />,
  },
  {
    n: 'S11',
    title: 'Blob',
    note: 'An organic shape with soft edges in a gradient of two chapter colours, breathing slowly.',
    visual: <SplashBlob />,
  },
  {
    n: 'S12',
    title: 'Block',
    note: 'A flat block of colour filling the right third of the hero, edge to edge. Editorial and blunt; the text sits against it.',
    visual: <SplashBlock />,
  },
  {
    n: 'S13',
    title: 'Stripes',
    note: 'Vertical bands of the whole palette, like a tapestry, fading out towards the text.',
    visual: <SplashStripes />,
  },
  {
    n: 'S14',
    title: 'Aurora',
    note: 'Several soft gradients layered and blurred in the corner. Colour with no shape at all.',
    visual: <SplashAurora />,
  },
]

type TypeExecution = { n: string; title: string; note: string; hero: ReactNode }

const marker = (
  <span className="pilot-marker">
    <span className="pilot-marker__num">04</span>
    <span className="pilot-marker__rule" aria-hidden="true" />
    <span>Our philosophy</span>
  </span>
)
const lede1 =
  'Our Head, Heart, Hands philosophy brings together clear thinking, genuine care and practical action.'
const lede2 =
  'It helps organisations build better cultures and create services that make a real difference to people\u2019s lives.'

const typeExecutions: TypeExecution[] = [
  {
    n: 'T1',
    title: 'Full width',
    note: 'The headline runs the whole width at display size. The opening text follows in two columns beneath. No picture; the words are the picture.',
    hero: (
      <div className="ty ty--full">
        {marker}
        <p className="ty__display">Head, heart and hands.</p>
        <div className="ty__cols">
          <p className="ph__lede">{lede1}</p>
          <p className="ph__lede">{lede2}</p>
        </div>
      </div>
    ),
  },
  {
    n: 'T2',
    title: 'Numeral behind',
    note: 'The chapter number at enormous size, very pale, with the headline set across it. Wayfinding and drama from one glyph pair.',
    hero: (
      <div className="ty ty--numeral">
        <span className="ty__ghost" aria-hidden>
          04
        </span>
        <div className="ty__over">
          {marker}
          <p className="ty__display ty__display--md">Head, heart and hands.</p>
          <p className="ph__lede">{lede1}</p>
        </div>
      </div>
    ),
  },
  {
    n: 'T3',
    title: 'Three words',
    note: 'Head, Heart and Hands each on their own line, huge, each in its colour from the mark. The three orbs, as type.',
    hero: (
      <div className="ty ty--stack">
        <div>
          {marker}
          <p className="ty__stackword" style={{ color: 'var(--navy)' }}>
            Head.
          </p>
          <p className="ty__stackword" style={{ color: 'var(--orange)' }}>
            Heart.
          </p>
          <p className="ty__stackword" style={{ color: 'var(--teal)' }}>
            Hands.
          </p>
        </div>
        <div className="ty__aside">
          <p className="ph__lede">{lede1}</p>
          <p className="ph__lede">{lede2}</p>
        </div>
      </div>
    ),
  },
  {
    n: 'T4',
    title: 'Outline',
    note: 'The headline in huge outlined letters with one word filled solid. The playbook\u2019s underlined accent word, taken further.',
    hero: (
      <div className="ty ty--full">
        {marker}
        <p className="ty__display ty__display--outline">
          Head, <span className="ty__solid">heart</span> and hands.
        </p>
        <p className="ph__lede ty__lede-wide">{lede1}</p>
      </div>
    ),
  },
  {
    n: 'T5',
    title: 'Headline and statement',
    note: 'The headline on the left, a hairline, and the chapter\u2019s one-line statement set large in grey on the right. Type on both sides, nothing else.',
    hero: (
      <div className="ty ty--split">
        <div>
          {marker}
          <p className="ty__display ty__display--md">Head, heart and hands.</p>
          <p className="ph__lede">{lede1}</p>
        </div>
        <p className="ty__statement">Think clearly, care deeply, deliver together.</p>
      </div>
    ),
  },
  {
    n: 'T6',
    title: 'Running line',
    note: 'The headline repeated as one very large, very pale line drifting slowly behind, with the real headline in front. Kinetic and quiet.',
    hero: (
      <div className="ty ty--marquee">
        <div className="ty__track" aria-hidden>
          <span>Head, heart and hands. Head, heart and hands. Head, heart and hands. </span>
          <span>Head, heart and hands. Head, heart and hands. Head, heart and hands. </span>
        </div>
        <div className="ty__over">
          {marker}
          <p className="ty__display ty__display--md">Head, heart and hands.</p>
          <p className="ph__lede">{lede1}</p>
        </div>
      </div>
    ),
  },
]

const titleOnly: TypeExecution[] = [
  {
    n: 'J1',
    title: 'Colossal',
    note: 'The title alone at its largest, running off the right edge so the letters are cut. You read it anyway.',
    hero: <p className="jt jt--colossal">Head, heart and hands.</p>,
  },
  {
    n: 'J2',
    title: 'Vertical',
    note: 'The title turned on its side and set along the right edge, reading upwards. The header becomes a spine.',
    hero: (
      <div className="jt jt--vertical">
        <p>Head, heart and hands.</p>
      </div>
    ),
  },
  {
    n: 'J3',
    title: 'Staircase',
    note: 'Three lines, each stepping in further than the last. The rhythm of the phrase made visible.',
    hero: (
      <p className="jt jt--stairs">
        <span>Head,</span>
        <span>heart and</span>
        <span>hands.</span>
      </p>
    ),
  },
  {
    n: 'J4',
    title: 'Justified',
    note: 'Three lines, each letter-spaced to exactly the same width, so the title becomes a block. Architectural.',
    hero: (
      <p className="jt jt--justified">
        <span>Head,</span>
        <span>heart and</span>
        <span>hands.</span>
      </p>
    ),
  },
  {
    n: 'J5',
    title: 'The orange full stop',
    note: 'The title at display size, and the final full stop is the playbook\u2019s orange circle. One brand mark, doing grammar.',
    hero: (
      <p className="jt jt--stop">
        Head, heart and hands
        <span className="jt__dot" aria-hidden />
      </p>
    ),
  },
  {
    n: 'J6',
    title: 'Knockout',
    note: 'A navy block across the whole header with the title cut out of it in paper. The only header that is dark.',
    hero: (
      <div className="jt jt--knockout">
        <p>Head, heart and hands.</p>
      </div>
    ),
  },
  {
    n: 'J7',
    title: 'The long underline',
    note: 'The title with the playbook\u2019s orange underline scaled up to a thick rule that runs off the right edge of the page.',
    hero: (
      <div className="jt jt--rule">
        <p>Head, heart and hands.</p>
        <span className="jt__rule" aria-hidden />
      </div>
    ),
  },
  {
    n: 'J8',
    title: 'Echo',
    note: 'The title once, solid, and again beneath it in outline, stepped down and to the right like a shadow that has not caught up.',
    hero: (
      <div className="jt jt--echo">
        <p className="jt__echo" aria-hidden>
          Head, heart and hands.
        </p>
        <p>Head, heart and hands.</p>
      </div>
    ),
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

      <header className="ph__intro ph__intro--sub">
        <p className="eyebrow">Variations on 05</p>
        <h2 className="ph__title ph__title--sub">A photograph in the circle, but quieter</h2>
        <p className="ph__blurb">
          Six subtler treatments of the same idea: the chapter&rsquo;s photographs held inside the
          brand&rsquo;s one shape. Less picture each time, or the picture held more lightly.
        </p>
      </header>

      {photoVariations.map((e) => (
        <Section key={e.n} e={e} />
      ))}

      <header className="ph__intro ph__intro--sub">
        <p className="eyebrow">Six more on 05</p>
        <h2 className="ph__title ph__title--sub">The photograph, held differently</h2>
      </header>

      {photoVariations2.map((e) => (
        <Section key={e.n} e={e} />
      ))}

      <header className="ph__intro ph__intro--sub">
        <p className="eyebrow">Colour splash</p>
        <h2 className="ph__title ph__title--sub">Colour as the visual</h2>
        <p className="ph__blurb">
          Eight ways to put a splash of colour in the space. Colour still lives in circles, the
          paper and type stay as they are, and each chapter would use its own mark&rsquo;s colours.
        </p>
      </header>

      {splashes.map((e) => (
        <Section key={e.n} e={e} />
      ))}

      <header className="ph__intro ph__intro--sub">
        <p className="eyebrow">Beyond circles</p>
        <h2 className="ph__title ph__title--sub">Colour let off the leash</h2>
        <p className="ph__blurb">
          Six more splashes that leave the circle behind: strokes, bands, blobs, blocks, stripes and
          light.
        </p>
      </header>

      {splashesFree.map((e) => (
        <Section key={e.n} e={e} />
      ))}

      <header className="ph__intro ph__intro--sub">
        <p className="eyebrow">Typography</p>
        <h2 className="ph__title ph__title--sub">Bigger titles, type as the visual</h2>
        <p className="ph__blurb">
          Six headers where the words do the work. All Open Sans, all on the same paper.
        </p>
      </header>

      <header className="ph__intro ph__intro--sub">
        <p className="eyebrow">Just the title</p>
        <h2 className="ph__title ph__title--sub">Nothing but the words</h2>
        <p className="ph__blurb">
          Eight headers made from the title alone. No marker, no opening text, no picture.
        </p>
      </header>

      {titleOnly.map((e) => (
        <section key={e.n} className="ph__execution" aria-labelledby={`ex-${e.n}`}>
          <div className="ph__label">
            <span className="ph__num">{e.n}</span>
            <h2 id={`ex-${e.n}`} className="ph__name">
              {e.title}
            </h2>
            <p className="ph__note">{e.note}</p>
          </div>
          <div className="ph__frame">
            <div className="ph__hero ph__hero--type ph__hero--title">{e.hero}</div>
          </div>
        </section>
      ))}

      {typeExecutions.map((e) => (
        <section key={e.n} className="ph__execution" aria-labelledby={`ex-${e.n}`}>
          <div className="ph__label">
            <span className="ph__num">{e.n}</span>
            <h2 id={`ex-${e.n}`} className="ph__name">
              {e.title}
            </h2>
            <p className="ph__note">{e.note}</p>
          </div>
          <div className="ph__frame">
            <div className="ph__hero ph__hero--type">{e.hero}</div>
          </div>
        </section>
      ))}
    </div>
  )
}
