import Link from 'next/link'
import type { ComponentType } from 'react'

import {
  HeadHeartHandsMark,
  OurDifferenceMark,
  OurMethodsMark,
  OurValuesMark,
  WhatWeDoMark,
  WhyWeDoItMark,
} from './marks'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Explore the foundations. The RSD Playbook',
}

type Chapter = {
  slug: string
  title: string
  Mark: ComponentType<{ className?: string }>
}

/** The six Foundations themes, in reading order. Static until the read model carries sections (build step 2). */
const chapters: Chapter[] = [
  { slug: 'what-we-do', title: 'What we do', Mark: WhatWeDoMark },
  { slug: 'why-we-do-it', title: 'Why we do it', Mark: WhyWeDoItMark },
  { slug: 'our-difference', title: 'Our difference', Mark: OurDifferenceMark },
  { slug: 'head-heart-and-hands', title: 'Head, heart and hands', Mark: HeadHeartHandsMark },
  { slug: 'our-methods', title: 'Our methods', Mark: OurMethodsMark },
  { slug: 'our-values', title: 'Our values', Mark: OurValuesMark },
]

export default function FoundationsPage() {
  return (
    <div className="landing">
      <div className="landing__intro">
        <p className="eyebrow">Pathway one</p>
        <h1 className="landing__title">
          Explore the <span className="accent-underline accent-underline--thick">foundations</span>
        </h1>
        <p className="landing__blurb">
          Six short chapters on how we research and design at Transform, and why it matters.
        </p>
      </div>

      <ul className="mark-grid" aria-label="Chapters">
        {chapters.map(({ slug, title, Mark }, i) => (
          <li key={slug}>
            <Link href={`/foundations/${slug}`} className="mark-card">
              <span className="mark-card__title">{title}</span>
              <span className="mark-card__number" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <Mark className="mark-card__mark" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
