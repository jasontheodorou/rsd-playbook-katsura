import Link from 'next/link'

type TopBarProps = {
  /** Optional trail after the wordmark, for example "Explore the foundations". */
  trail?: string
}

/**
 * Sticky top bar, carried over from the reference build's TopBar: white surface, hairline
 * border, wordmark, optional trail. Identical on every page; nothing else may restyle it. Server-rendered, no JavaScript needed.
 * Sign-in controls return with the reader-access seam (build step 6).
 */
export function TopBar({ trail }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <Link href="/" className="topbar__wordmark">
          <span className="topbar__title">The RSD Playbook</span>
          {trail && (
            <span className="topbar__trail">
              <span className="topbar__slash" aria-hidden>
                /
              </span>
              <span className="topbar__trail-text">{trail}</span>
            </span>
          )}
        </Link>
        <div className="topbar__actions">
          {/* Placeholder for the reader sign-in that arrives with the access seam (build step 6). */}
          <Link href="/admin" className="button-outline">
            Sign in
          </Link>
        </div>
      </div>
    </header>
  )
}
