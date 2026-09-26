import type { ReactNode } from 'react'

import type { AccordionSection } from '../components/Accordion'
import type { DiagramItem } from '../components/Diagram'
import type { TrioItem } from '../components/ImageTrio'
import type { Role } from '../components/TShapedTabs'

/**
 * A Foundations chapter, as content. The page component (FoundationsChapter) turns this into a
 * page built to the gold standard: the grid, the spacing scale and the approved patterns. A new
 * chapter is only a new ChapterContent; it never sets its own layout or spacing.
 */
export type Block =
  /** Body text: paragraphs of reading copy on columns 2 to 9. Keep paragraphs short. */
  | { kind: 'text'; paragraphs: ReactNode[] }
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
    }
  /** A boxout of points, across columns 2 to 9, like body text. */
  | { kind: 'boxout'; label?: string; items: string[]; accent?: string }
  /** A yellow quote card, across columns 2 to 9, like body text. */
  | { kind: 'quote'; text: ReactNode; attribution?: string }

export type ChapterContent = {
  title: string
  /** The statement under the title: a first sentence in ink, the rest in grey, one weight. */
  statement?: { lead: ReactNode; rest?: ReactNode }
  blocks: Block[]
}
