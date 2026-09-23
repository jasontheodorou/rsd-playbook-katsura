import { notFound } from 'next/navigation'

import { currentCompleted } from '@/learning/reader'

import { chapterPageId, chapters, findChapter } from '../chapters'
import { ChapterEnd } from './ChapterEnd'
import { ChapterFrame } from './ChapterFrame'
import { HeadHeartHandsChapter } from './hhh/HeadHeartHandsChapter'

type Props = { slug: string }

/** Resolves a chapter and renders it inside the animated frame. */
export async function ChapterView({ slug }: Props) {
  const chapter = findChapter(slug)
  if (!chapter) notFound()

  const pageId = chapterPageId(slug)
  const completed = await currentCompleted(pageId)
  const index = chapters.findIndex((c) => c.slug === slug)
  const next = chapters[index + 1]
  const ported = slug === 'head-heart-and-hands'

  const end = (
    <ChapterEnd
      pageId={pageId}
      slug={slug}
      title={chapter.title}
      initiallyRead={completed.has(pageId)}
      returnTo={`/foundations/${slug}`}
      nextHref={next ? `/foundations/${next.slug}` : undefined}
      nextTitle={next?.title}
      showNav={!ported}
      morphMark={false}
    />
  )

  return (
    <ChapterFrame slug={slug}>
      {ported ? (
        <HeadHeartHandsChapter number={String(index + 1).padStart(2, '0')} end={end} />
      ) : (
        <article className="chapter chapter--framed">
          <p className="eyebrow">Chapter {String(index + 1).padStart(2, '0')}</p>
          <h1 className="chapter__title">{chapter.title}</h1>
          <p className="chapter__lede">
            Placeholder text. The real chapter arrives with the publisher. This copy exists only so
            the page is long enough to scroll to its end.
          </p>
          {Array.from({ length: 6 }, (_, i) => (
            <p key={i} className="chapter__body">
              Good research and design help us think clearly, act with empathy and create things
              people trust. They bridge people and institutions, making services feel built with
              people rather than done to them. The way we work can fail in two distinct ways:
              sometimes design is absent, and sometimes it is present but hollow. Both leave
              services that fail people.
            </p>
          ))}
          {end}
        </article>
      )}
    </ChapterFrame>
  )
}
