import { currentCompleted, currentLearnerId } from '@/learning/reader'

import { chapterPageId, chapters } from './chapters'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Explore the foundations. The RSD Playbook',
}

export default async function FoundationsPage() {
  const completed = await currentCompleted('foundations/')
  const hasLearner = (await currentLearnerId()) !== null
  const readCount = chapters.filter((c) => completed.has(chapterPageId(c.slug))).length

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
        <p className="progress-line" aria-label={`${readCount} of ${chapters.length} chapters read`}>
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
              {/* A plain link (full navigation) so the page-level crossfade runs and the chapter can choreograph its own entrance. */}
              <a
                href={`/foundations/${slug}`}
                className="mark-card"
                data-state={read ? 'read' : 'unread'}
                aria-label={`${title}${read ? ', read' : ''}`}
              >
                <span className="mark-card__title">{title}</span>
                <span className="mark-card__number" aria-hidden>
                  {read ? 'Read' : String(i + 1).padStart(2, '0')}
                </span>
                <Mark className="mark-card__mark" style={{ viewTransitionName: `mark-${slug}` }} />
              </a>
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
  )
}
