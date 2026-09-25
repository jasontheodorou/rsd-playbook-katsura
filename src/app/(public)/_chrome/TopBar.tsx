import Link from 'next/link'

import { AccountMenu } from './AccountMenu'
import { TopBarTrail } from './TopBarTrail'

type TopBarProps = {
  /** Optional trail after the wordmark, for example "Explore the foundations". */
  trail?: string
}

/**
 * Sticky top bar, carried over from the reference build's TopBar: white surface, hairline
 * border, wordmark, optional trail. Identical on every page; nothing else may restyle it. Server-rendered, no JavaScript needed.
 * The account control holds a placeholder until reader accounts arrive (build step 6).
 */
export function TopBar({ trail }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <span className="topbar__wordmark">
          <Link href="/" className="topbar__title">
            The RSD Playbook
          </Link>
          {trail ? (
            <span className="topbar__trail">
              <span className="topbar__slash" aria-hidden>
                /
              </span>
              <span className="topbar__trail-text">{trail}</span>
            </span>
          ) : (
            <TopBarTrail />
          )}
        </span>
        <div className="topbar__actions">
          <AccountMenu />
        </div>
      </div>
    </header>
  )
}
