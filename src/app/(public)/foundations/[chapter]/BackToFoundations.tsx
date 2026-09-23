'use client'

import { useChapterFrame } from './ChapterFrame'

type Props = { total: number; current: number; completed: boolean[] }

/**
 * The way back, at the end of a chapter. The six chapter dots from the grid, this one ringed,
 * finished ones solid, and a plain label. Pressing it shrinks the chapter back into its card.
 */
export function BackToFoundations({ total, current, completed }: Props) {
  const { close } = useChapterFrame()
  return (
    <button type="button" className="back-home" onClick={close}>
      <span className="back-home__dots" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className="back-home__dot"
            data-current={i === current ? 'true' : undefined}
            data-state={completed[i] ? 'read' : 'unread'}
          />
        ))}
      </span>
      <span className="back-home__label">Back to the foundations</span>
    </button>
  )
}
