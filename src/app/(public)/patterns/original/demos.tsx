'use client'

import { Eye, Lightning, ArrowsClockwise, Scales, ShieldCheck, Target } from '@phosphor-icons/react'
import { useRef, type ReactNode } from 'react'

import HeadHeartHandsPattern from '../../foundations/[chapter]/hhh/HeadHeartHandsPattern'
import { Media } from '../../foundations/[chapter]/hhh/Media'
import { QuoteCard } from '../../foundations/[chapter]/hhh/QuoteCard'
import '../../foundations/[chapter]/hhh/pathway.css'
import { DiscoveryStar, type DiscoveryStarPoint } from './DiscoveryStar'
import { GoodDesignCollab } from './GoodDesignCollab'
import { ImageCoverRevealBoxed } from './ImageCoverRevealBoxed'
import { ImagesReveal } from './ImagesReveal'
import { KenBurnsImage } from './KenBurnsImage'
import { NorthStarPattern } from './NorthStarPattern'
import { ParticipationModel } from './ParticipationModel'
import { PinnedPhoto } from './PinnedPhoto'
import { RebuildTower } from './RebuildTower'
import { TShapedTabs } from './TShapedTabs'
import './original.css'

/**
 * The original build's demos (the-rsd-playbook, src/patterns-library/demos.tsx), mounted in
 * katsura. Each mounts the original component with the props the original library passed it.
 * Head, Heart and Hands, the quote card and the image planes use katsura's existing ports in
 * foundations/[chapter]/hhh; the rest are copies in this folder, their styles scoped under .plo.
 * The one change: head-flipchart is a .jpg in katsura, where it was a .png.
 */

/** The original library's 720px demo column. */
function Column({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return <div className={`plo pl-demo-column${wide ? ' pl-demo-column--wide' : ''}`}>{children}</div>
}

/* ── Collaborative sticky board ── */

export function StickyBoardDemo() {
  return (
    <Column>
      <GoodDesignCollab />
    </Column>
  )
}

/* ── Participation model ── */

export function ParticipationModelDemo() {
  return (
    <Column>
      <ParticipationModel />
    </Column>
  )
}

/* ── Head, Heart and Hands ── */

export function HeadHeartHandsDemo() {
  return (
    <Column>
      <HeadHeartHandsPattern initialActive="head" />
    </Column>
  )
}

/* ── Morphing pill tabs, and the two tab styles set aside ── */

export function PillTabsDemo() {
  return (
    <Column>
      <div className="p1v2__tabs">
        <span className="ly-panel__eyebrow">The specialists</span>
        <TShapedTabs variant="pill" />
      </div>
    </Column>
  )
}

export function UnderlineTabsDemo() {
  return (
    <Column>
      <TShapedTabs variant="underline" />
    </Column>
  )
}

export function WipeTabsDemo() {
  return (
    <Column>
      <TShapedTabs variant="wipe" />
    </Column>
  )
}

/* ── Image cover reveal ── */

/** The reveal is driven by scroll inside a box, so the demo gives it a box of its own to scroll. */
export function CoverRevealDemo() {
  const scrollRef = useRef<HTMLDivElement>(null)
  return (
    <Column>
      <p className="pl-demo-hint">Scroll inside the frame to run the reveal. It only plays once.</p>
      <div className="pl-scrollbox" ref={scrollRef}>
        <div className="pl-scrollbox__spacer" />
        <div className="p1v2__reveal">
          <ImageCoverRevealBoxed
            imageUrl="/photos/board-review.jpg"
            heading="Depth in one discipline, breadth across many."
            scrollContainer={scrollRef}
            height={420}
          />
        </div>
        <div className="pl-scrollbox__spacer" />
      </div>
    </Column>
  )
}

/** The reveal in its covered state, for the card: the cream-and-ink face is the recognisable part. */
export function CoverRevealCard() {
  return (
    <Column>
      <ImageCoverRevealBoxed
        imageUrl="/photos/board-review.jpg"
        heading="Depth in one discipline, breadth across many."
        height={340}
      />
    </Column>
  )
}

/* ── Staged image reveal ── */

export function ImagesRevealDemo() {
  return (
    <Column>
      <ImagesReveal
        images={[
          {
            src: '/photos/lego-raised.png',
            alt: 'A colleague holding up a completed Lego build for the room to see.',
          },
          {
            src: '/photos/three-way-conversation.png',
            alt: 'Three colleagues in an animated small-group conversation.',
          },
          {
            src: '/photos/team-meeting.png',
            alt: 'Five colleagues gathered at a bright meeting table with laptops.',
          },
          {
            src: '/photos/lego-show-and-tell.png',
            alt: 'Two colleagues sharing a small Lego build together.',
          },
          {
            src: '/photos/lego-trees.png',
            alt: 'Hands placing green Lego "trees" into a shared build.',
          },
        ]}
      />
    </Column>
  )
}

/* ── Ken Burns photograph ── */

export function KenBurnsDemo() {
  return (
    <Column>
      <div className="p1v2__media">
        <KenBurnsImage
          src="/photos/hands-many-lego.png"
          alt="Many hands reaching into a shared pile of Lego bricks."
          focal="center"
          duration={8}
        />
      </div>
    </Column>
  )
}

/* ── Pinned photograph ── */

export function PinnedPhotoDemo() {
  return (
    <Column>
      <div className="p1v2__paired">
        <PinnedPhoto src="/photos/eunice-tracey.jpg" alt="Eunice and Tracey, a moment from the practice." />
      </div>
    </Column>
  )
}

/* ── Offset plane media: the three shipped configurations, and two set aside ── */

export function OffsetPlaneDemo() {
  return (
    <Column>
      <p className="pl-demo-label">Pale blue, offset top-left: Head, Heart and Hands</p>
      <div className="p1v2__cinema">
        <div className="ly-layered ly-layered--tl ly-layered--paleblue">
          <span className="ly-layered__plane" aria-hidden="true" />
          <Media
            shape="21-9"
            src="/photos/head-flipchart.jpg"
            alt="Three colleagues sketching a diagram together at a flipchart."
          />
        </div>
      </div>
      <p className="pl-demo-label">Terracotta, offset bottom-right</p>
      <div className="p1v2__paired">
        <div className="ly-layered ly-layered--br ly-layered--terracotta">
          <span className="ly-layered__plane" aria-hidden="true" />
          <Media
            shape="16-9"
            src="/photos/journey-map-group.jpg"
            alt="A diverse group sharing a hand-drawn journey map."
          />
        </div>
      </div>
      <p className="pl-demo-label">Two planes: blue top-left, yellow bottom-right</p>
      <div className="p1v2__paired">
        <div className="ly-layered ly-layered--tl ly-layered--blue">
          <span className="ly-layered__plane" aria-hidden="true" />
          <span
            className="ly-layered__plane ly-layered__plane--yellow ly-layered__plane--br"
            aria-hidden="true"
          />
          <Media
            shape="landscape"
            src="/photos/lego-prototyping.jpg"
            alt="Hands sorting Lego bricks for physical prototyping."
          />
        </div>
      </div>
    </Column>
  )
}

/** One plane rather than all three, for the card. */
export function OffsetPlaneCard() {
  return (
    <Column>
      <div className="ly-layered ly-layered--tl ly-layered--paleblue">
        <span className="ly-layered__plane" aria-hidden="true" />
        <Media shape="16-9" src="/photos/head-flipchart.jpg" alt="" />
      </div>
    </Column>
  )
}

export function OffsetPlaneWarmGreyDemo() {
  return (
    <Column>
      <div className="p1v2__paired">
        <div className="ly-layered ly-layered--tl ly-layered--warmgrey">
          <span className="ly-layered__plane" aria-hidden="true" />
          <Media shape="16-9" src="/photos/team-meeting.png" alt="Warm grey plane variant." />
        </div>
      </div>
    </Column>
  )
}

export function OffsetPlaneTopRightDemo() {
  return (
    <Column>
      <div className="p1v2__paired">
        <div className="ly-layered ly-layered--tr ly-layered--paleblue">
          <span className="ly-layered__plane" aria-hidden="true" />
          <Media shape="16-9" src="/photos/team-meeting.png" alt="Top-right offset variant." />
        </div>
      </div>
    </Column>
  )
}

/* ── Tinted quote card, and the two tones set aside ── */

const NORTH_STAR = 'We turn uncertainty into clarity and possibility.'

export function QuoteCardDemo() {
  return (
    <Column>
      <QuoteCard text={NORTH_STAR} attribution="Our north star" tone="yellow" />
    </Column>
  )
}

export function QuoteCardTerracottaDemo() {
  return (
    <Column>
      <QuoteCard text={NORTH_STAR} attribution="Our north star" tone="terracotta" />
    </Column>
  )
}

export function QuoteCardPaleBlueDemo() {
  return (
    <Column>
      <QuoteCard text={NORTH_STAR} attribution="Our north star" tone="paleblue" />
    </Column>
  )
}

/* ── Built, never placed ── */

export function NorthStarDemo() {
  return (
    <Column>
      <NorthStarPattern />
    </Column>
  )
}

/* lucide-react is not in katsura, so the six icons are their Phosphor equivalents. */
const STAR_POINTS: [
  DiscoveryStarPoint,
  DiscoveryStarPoint,
  DiscoveryStarPoint,
  DiscoveryStarPoint,
  DiscoveryStarPoint,
  DiscoveryStarPoint,
] = [
  {
    id: 'real-problems',
    title: 'Real problems',
    body: 'Trust starts with services that solve what actually matters to people.',
    icon: <Target size={20} weight="bold" />,
  },
  {
    id: 'less-waste',
    title: 'Less waste',
    body: 'Every unnecessary step erodes belief. Simpler journeys build confidence.',
    icon: <Lightning size={20} weight="bold" />,
  },
  {
    id: 'confidence',
    title: 'Confidence',
    body: 'People must feel able to move forward without confusion or fear.',
    icon: <ShieldCheck size={20} weight="bold" />,
  },
  {
    id: 'learning',
    title: 'Learning',
    body: 'Services that keep learning keep earning trust over time.',
    icon: <ArrowsClockwise size={20} weight="bold" />,
  },
  {
    id: 'fairness',
    title: 'Fairness',
    body: 'Trust survives when everyone can use the service, not only those it was designed around.',
    icon: <Scales size={20} weight="bold" />,
  },
  {
    id: 'honesty',
    title: 'Honesty',
    body: 'Trust breaks the moment a service overclaims what it does or hides how it works.',
    icon: <Eye size={20} weight="bold" />,
  },
]

export function DiscoveryStarDemo() {
  return (
    <div className="plo pl-demo-column pl-centre">
      <DiscoveryStar className="rsd-trust-star" points={STAR_POINTS} completionMessage="We’re all in" />
    </div>
  )
}

export function RebuildTowerDemo() {
  return (
    <Column wide>
      <RebuildTower />
    </Column>
  )
}
