import type { ReactNode } from 'react'

import { LibraryNav } from './LibraryNav'
import './patterns.css'

export const metadata = {
  title: 'Pattern library. The RSD Playbook',
  robots: { index: false, follow: false },
}

/** /patterns: the back room of the Playbook, holding every pattern it is built from, live. */
export default function PatternsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pl">
      <LibraryNav />
      {children}
    </div>
  )
}
