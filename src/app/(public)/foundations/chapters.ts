import type { ComponentType } from 'react'

import {
  HeadHeartHandsMark,
  OurDifferenceMark,
  OurMethodsMark,
  OurValuesMark,
  WhatWeDoMark,
  WhyWeDoItMark,
} from './marks'

export type Chapter = {
  slug: string
  title: string
  Mark: ComponentType<{ className?: string; style?: React.CSSProperties }>
}

/** The six Foundations chapters, in reading order, as in the manual explorer's plan. Static until the read model carries sections. */
export const chapters: Chapter[] = [
  { slug: 'who-we-are', title: 'Who we are', Mark: WhatWeDoMark },
  { slug: 'why-design-matters', title: 'Why design matters', Mark: WhyWeDoItMark },
  { slug: 'head-heart-and-hands', title: 'Head, heart and hands', Mark: HeadHeartHandsMark },
  // Marks keep their original names; each went to the chapter it suits best.
  { slug: 'how-we-think', title: 'How we think', Mark: OurDifferenceMark },
  { slug: 'what-we-care-about', title: 'What we care about', Mark: OurValuesMark },
  { slug: 'how-we-deliver', title: 'How we deliver', Mark: OurMethodsMark },
]

/** Stable content identity for progress. Survives the move to the read model as long as slugs do. */
export const chapterPageId = (slug: string): string => `foundations/${slug}`

export const findChapter = (slug: string): Chapter | undefined =>
  chapters.find((c) => c.slug === slug)
