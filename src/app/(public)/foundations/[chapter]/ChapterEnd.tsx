'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'

import { findChapter } from '../chapters'
import { useChapterFrame } from './ChapterFrame'

type Props = {
  pageId: string
  slug: string
  title: string
  initiallyRead: boolean
  returnTo: string
  nextHref?: string
  nextTitle?: string
  /** Show the back and next links beneath the mark. Off for chapters with their own navigation. */
  showNav?: boolean
  /** Give the mark a view-transition-name so it morphs into its card on return. Off when the whole page morphs. */
  morphMark?: boolean
  /** Rendered after the status line: the way back, or whatever the chapter wants to end with. */
  after?: ReactNode
}

const DWELL_MS = 900

/** The nearest ancestor that scrolls (a chapter scrolls inside its frame), or the page itself. */
function scrollParent(el: HTMLElement): HTMLElement {
  for (let n = el.parentElement; n; n = n.parentElement) {
    const { overflowY } = getComputedStyle(n)
    if ((overflowY === 'auto' || overflowY === 'scroll') && n.scrollHeight > n.clientHeight)
      return n
  }
  return document.scrollingElement as HTMLElement
}

const noop = () => () => {}
/** False during server render and hydration, true once JavaScript is running. */
const useEnhanced = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )

/**
 * The end of a chapter: its own mark, outlined. Server-rendered as a plain form so it works
 * without JavaScript ("Mark as read"). With JavaScript, reaching the mark and resting on it for
 * about a second records the completion in the background and fills the mark where it stands.
 * "Mark as unread" pauses that until the reader has scrolled at least halfway back up the page.
 */
export function ChapterEnd({
  pageId,
  slug,
  title,
  initiallyRead,
  returnTo,
  nextHref,
  nextTitle,
  showNav = true,
  morphMark = true,
  after,
}: Props) {
  const [read, setRead] = useState(initiallyRead)
  // After "Mark as unread", resting on the mark must not complete the chapter again straight away.
  // Completion re-arms once the reader has scrolled at least halfway back up the page.
  const [armed, setArmed] = useState(true)
  const enhanced = useEnhanced()
  const markRef = useRef<HTMLDivElement>(null)
  const chapter = findChapter(slug)
  const frame = useChapterFrame()

  useEffect(() => {
    if (armed || !markRef.current) return
    const scroller = scrollParent(markRef.current)
    const target: HTMLElement | Window = scroller === document.scrollingElement ? window : scroller
    const onScroll = () => {
      const max = scroller.scrollHeight - scroller.clientHeight
      if (scroller.scrollTop <= max / 2) setArmed(true)
    }
    target.addEventListener('scroll', onScroll, { passive: true })
    return () => target.removeEventListener('scroll', onScroll)
  }, [armed])

  useEffect(() => {
    if (read || !armed || !markRef.current || typeof IntersectionObserver === 'undefined') return
    let timer: ReturnType<typeof setTimeout> | undefined
    let done = false
    const complete = async () => {
      if (done) return
      done = true
      const ok = await post(pageId, 'complete')
      if (ok) setRead(true)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.9) {
          timer = setTimeout(complete, DWELL_MS)
        } else if (timer) {
          clearTimeout(timer)
          timer = undefined
        }
      },
      { threshold: [0, 0.9, 1] },
    )
    observer.observe(markRef.current)
    return () => {
      observer.disconnect()
      if (timer) clearTimeout(timer)
    }
  }, [read, armed, pageId])

  const undo = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!enhanced) return
    event.preventDefault()
    const ok = await post(pageId, 'uncomplete')
    if (ok) {
      setArmed(false)
      setRead(false)
    }
  }

  if (!chapter) return null
  const { Mark } = chapter

  return (
    <footer className="chapter-end" data-state={read ? 'read' : 'unread'} data-enhanced={enhanced}>
      <div className="chapter-end__mark" ref={markRef}>
        <form method="post" action="/progress/complete" className="chapter-end__form">
          <input type="hidden" name="pageId" value={pageId} />
          <input type="hidden" name="action" value="complete" />
          <input type="hidden" name="returnTo" value={returnTo} />
          <button
            type="submit"
            className="chapter-end__button"
            aria-label={read ? `${title}, read` : `Mark ${title} as read`}
            disabled={enhanced}
          >
            <Mark
              className="chapter-end__svg"
              style={morphMark ? { viewTransitionName: `mark-${slug}` } : undefined}
            />
          </button>
        </form>
      </div>
      <p className="chapter-end__status" aria-live="polite">
        {read ? 'Chapter read.' : enhanced ? 'You have reached the end.' : ''}
      </p>
      {read && (
        // One block of two equal buttons: back to the Foundations menu (filled), or mark unread.
        <div className="chapter-end__actions">
          <Link
            href="/foundations"
            scroll={false}
            className="chapter-end__action chapter-end__action--primary"
            onClick={(e) => {
              if (enhanced) {
                e.preventDefault()
                frame.close()
              }
            }}
          >
            Back to menu
          </Link>
          <form
            method="post"
            action="/progress/complete"
            onSubmit={undo}
            className="chapter-end__undo"
          >
            <input type="hidden" name="pageId" value={pageId} />
            <input type="hidden" name="action" value="uncomplete" />
            <input type="hidden" name="returnTo" value={returnTo} />
            <button type="submit" className="chapter-end__action chapter-end__action--secondary">
              Mark unread
            </button>
          </form>
        </div>
      )}
      {after}
      {showNav && (
        <nav className="chapter-end__nav" aria-label="Chapter navigation">
          <button
            type="button"
            className="button-outline"
            onClick={(e) => {
              if (enhanced) {
                e.preventDefault()
                frame.close()
              }
            }}
          >
            Back to the foundations
          </button>
          {nextHref && (
            <a href={nextHref} className="button-primary">
              Next: {nextTitle}
            </a>
          )}
        </nav>
      )}
    </footer>
  )
}

async function post(pageId: string, action: 'complete' | 'uncomplete'): Promise<boolean> {
  try {
    const response = await fetch('/progress/complete', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pageId, action }),
    })
    return response.ok
  } catch {
    return false
  }
}
