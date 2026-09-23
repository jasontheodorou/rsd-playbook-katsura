import Link from 'next/link'

import { currentCompleted, currentLearnerId } from '@/learning/reader'

import { chapterPageId, chapters } from './chapters'

import type { ReactNode } from 'react'

export const dynamic = 'force-dynamic'

/**
 * The Foundations grid is the section's layout, so it stays mounted while a chapter route renders
 * in a frame over it. Opening a chapter grows the frame out of its card; closing shrinks it back.
 */
export default async function FoundationsLayout({ children }: { children: ReactNode }) {
  const completed = await currentCompleted('foundations/')
  const hasLearner = (await currentLearnerId()) !== null
  const readCount = chapters.filter((c) => completed.has(chapterPageId(c.slug))).length

  return (
    <>
      <div className="landing">
        <div className="landing__intro">
          <p className="eyebrow">Pathway one</p>
          <h1 className="landing__title">
            Explore the{' '}
            <span className="accent-underline accent-underline--thick">foundations</span>
          </h1>
          <p className="landing__blurb">
            Six short chapters on how we research and design at Transform, and why it matters.
          </p>
          <p
            className="progress-line"
            aria-label={`${readCount} of ${chapters.length} chapters read`}
          >
            <span className="progress-line__dots" aria-hidden>
              {chapters.map((c) => (
                <span
                  key={c.slug}
                  className="progress-line__dot"
                  data-state={completed.has(chapterPageId(c.slug)) ? 'read' : 'unread'}
                />
              ))}
            </span>
            <span className="progress-line__text">
              {readCount} of {chapters.length} read
            </span>
          </p>
        </div>

        <ul className="mark-grid" aria-label="Chapters">
          {chapters.map(({ slug, title, Mark }, i) => {
            const read = completed.has(chapterPageId(slug))
            return (
              <li key={slug}>
                {/* Client navigation: the chapter is intercepted into a layer over this grid and grows out of this card. */}
                <Link
                  href={`/foundations/${slug}`}
                  scroll={false}
                  className="mark-card"
                  data-state={read ? 'read' : 'unread'}
                  data-chapter={slug}
                  aria-label={`${title}${read ? ', read' : ''}`}
                >
                  <span className="mark-card__title">{title}</span>
                  <span className="mark-card__number" aria-hidden>
                    {read ? 'Read' : String(i + 1).padStart(2, '0')}
                  </span>
                  <Mark
                    className="mark-card__mark"
                    style={{ viewTransitionName: `mark-${slug}` }}
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        {hasLearner && (
          <form method="post" action="/progress/forget" className="privacy-line">
            <input type="hidden" name="returnTo" value="/foundations" />
            <span>We remember which chapters you have finished on this device.</span>{' '}
            <button type="submit" className="link-button">
              Forget my progress
            </button>
          </form>
        )}
      </div>

      {/* A chapter route renders here, in a frame over the grid. */}
      {children}
    </>
  )
}
