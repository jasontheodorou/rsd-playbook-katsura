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

/** The six Foundations themes, in reading order. Static until the read model carries sections. */
export const chapters: Chapter[] = [
  { slug: 'who-we-are', title: 'Who we are', Mark: WhatWeDoMark },
  { slug: 'why-we-do-it', title: 'Why we do it', Mark: WhyWeDoItMark },
  { slug: 'our-difference', title: 'Our difference', Mark: OurDifferenceMark },
  { slug: 'head-heart-and-hands', title: 'Head, heart and hands', Mark: HeadHeartHandsMark },
  { slug: 'our-methods', title: 'Our methods', Mark: OurMethodsMark },
  { slug: 'our-values', title: 'Our values', Mark: OurValuesMark },
]

/** Stable content identity for progress. Survives the move to the read model as long as slugs do. */
export const chapterPageId = (slug: string): string => `foundations/${slug}`

export const findChapter = (slug: string): Chapter | undefined => chapters.find((c) => c.slug === slug)
