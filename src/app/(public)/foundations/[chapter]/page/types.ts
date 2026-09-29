import type { ReactNode } from 'react'

import type { AccordionSection } from '../components/Accordion'
import type { BalanceItem } from '../components/Balance'
import type { DiagramItem } from '../components/Diagram'
import type { TrioItem } from '../components/ImageTrio'
import type { FanNote } from '../components/NoteFan'
import type { LandscapeLayer } from '../components/DesignLandscape'
import type { Polaroid } from '../components/Polaroids'
import type { FrameworkPart } from '../components/FrameworkPill'
import type { JourneyStep } from '../components/Journey'
import type { Drift } from '../components/PartMedia'
import type { PlaneTone } from '../components/PartSection'
import type { StackCardItem } from '../components/StackCards'
import type { Role } from '../components/TShapedTabs'

/**
 * A Foundations chapter, as content. The page component (FoundationsChapter) turns this into a
 * page built to the gold standard: the grid, the spacing scale and the approved patterns. A new
 * chapter is only a new ChapterContent; it never sets its own layout or spacing.
 */
export type Block =
  /** Body text: paragraphs of reading copy on columns 2 to 9. Keep paragraphs short. An optional
      short list follows the paragraphs, with small grey square bullets. */
  | { kind: 'text'; paragraphs: ReactNode[]; list?: ReactNode[] }
  /** A landscape photograph with its offset plane, across columns 2 to 12. */
  | { kind: 'photo'; src: string; alt: string }
  /** The quiet outline accordion, across columns 2 to 12. */
  | { kind: 'accordion'; sections: AccordionSection[] }
  /** Three portrait photographs that fill with colour on hover, across columns 2 to 12. */
  | { kind: 'trio'; items: TrioItem[] }
  /** T-shaped tabs, for roles or options side by side, across columns 2 to 12. */
  | { kind: 'tabs'; roles: Role[] }
  /** A square photograph on a yellow plane that settles into a slight tilt, across columns 2 to 6. */
  | { kind: 'pinned'; src: string; alt: string; quote?: ReactNode }
  /** The refined diagram: a centre idea and five items to explore, with a reading panel, across columns 2 to 12. */
  | {
      kind: 'diagram'
      hub: string
      label: string
      emptyTitle: string
      emptyBody: string
      items: DiagramItem[]
      /** The two wash colours, in the chapter's own colour. Defaults to pale blue and sand. */
      washes?: [string, string]
      /** With a photo on each item, the diagram becomes the photo diagram; this is its resting photo. */
      /** A short instruction at the top left of the card, as the balance slider has. */
      title?: string
      restPhoto?: string
      restAlt?: string
    }
  /** Balance sliders, from a failure to good practice, revealing each passage; columns 2 to 11. */
  | { kind: 'balance'; prompt: string; items: BalanceItem[]; washes?: [string, string] }
  /** A boxout of points, across columns 2 to 9, like body text. */
  | { kind: 'boxout'; label?: string; items: string[]; accent?: string }
  /** A drawn illustration on the page's own paper (a transparent image trimmed to its drawing),
      across columns 2 to 12, with no frame. */
  | { kind: 'illustration'; src: string; alt: string }
  /** The head, heart and hands sketch as a wall that builds itself on scroll, its posters swinging
      when pointed at; at the illustration's size. */
  | { kind: 'hhhWall'; alt: string }
  /** Nested layers to explore (chapter 04's Design Landscape): one card, the layers on a tinted
      side and the chosen layer's text on white, across columns 2 to 11. Layers run outside in. */
  | {
      kind: 'landscape'
      title?: string
      label: string
      restTitle: string
      restBody: string
      layers: LandscapeLayer[]
      washes?: [string, string]
    }
  /** Up to three photographs as overlapping prints at slight angles, each with a short
      handwritten caption; pointing at one straightens and lifts it. Columns 2 to 9. */
  | { kind: 'polaroids'; prints: Polaroid[] }
  /** The Design Landscape as a map to explore (chapter 04's signature asset): the hand-drawn
      landscape with its people in orange, across columns 2 to 12. Choosing a region brings the
      rest of the drawing back, raises its line to its name and shows its text in a gold box
      below. Layers run outside in. */
  | {
      kind: 'landscapeMap'
      /** What to do, at the drawing's top left until a region is chosen. */
      prompt: string
      label: string
      restTitle: string
      restBody: string
      layers: LandscapeLayer[]
    }
  /** Short quotations from the people services are for, side by side in one tinted card,
      across columns 2 to 11 (chapter 05). Up to three. */
  | { kind: 'voices'; label?: string; quotes: string[]; tint?: string }
  /** A model of steps in a row on a tinted band, the chosen step's text on white below, across
      columns 2 to 11 (chapter 06's participation model). */
  | {
      kind: 'journey'
      title?: string
      label: string
      restTitle: string
      restBody: string
      steps: JourneyStep[]
    }
  /** Stacking cards that pin and fold over one another as the reader scrolls, across columns 2 to
      12. Each card: an eyebrow, a title and a photograph. */
  | { kind: 'stack'; cards: StackCardItem[] }
  /** A part of the chapter's idea written out: eyebrow, heading, a wide photograph, then body
      text with an optional list, on columns 2 to 9. */
  | {
      kind: 'part'
      eyebrow?: string
      heading: string
      photo?: string
      alt?: string
      paragraphs: ReactNode[]
      list?: ReactNode[]
      /** A boxout of points between the paragraphs, after paragraph number `after`. */
      boxout?: { after: number; items: string[]; accent?: string }
      /** Up to three short points as a fanned stack of sticky notes. */
      fan?: { label: string; notes: FanNote[]; tints?: string[] }
      /** A short list as a small accordion: each item's lead-in as its title. */
      items?: { title: string; body: ReactNode }[]
      plane?: PlaneTone
      side?: 'tl' | 'br' | 'bl'
      drift?: Drift
      accent?: string
      mark?: string
    }
  /** A yellow quote card, across columns 2 to 9, like body text. */
  | { kind: 'quote'; text: ReactNode; attribution?: string }

export type ChapterContent = {
  title: string
  /** The statement under the title: a first sentence in ink, the rest in grey, one weight. */
  statement?: { lead: ReactNode; rest?: ReactNode }
  /** Chapters 04 to 06: which part of Head, heart and hands this is. Shows the framework pill
      between the title and the statement. */
  framework?: FrameworkPart
  blocks: Block[]
}
