'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * The trail after the wordmark, as in the reference build: "/ Foundations" while in that section.
 * Inside a chapter it asks the chapter frame to close, so the page shrinks back into its card.
 */
export function TopBarTrail() {
  const pathname = usePathname() ?? ''
  if (!pathname.startsWith('/foundations')) return null
  const inChapter = pathname.length > '/foundations'.length
  return (
    <span className="topbar__trail">
      <span className="topbar__slash" aria-hidden>
        /
      </span>
      {inChapter ? (
        <button
          type="button"
          className="topbar__trail-text topbar__trail-link"
          onClick={() => window.dispatchEvent(new CustomEvent('katsura:close-chapter'))}
        >
          Foundations
        </button>
      ) : (
        <Link href="/foundations" className="topbar__trail-text">
          Foundations
        </Link>
      )}
    </span>
  )
}
