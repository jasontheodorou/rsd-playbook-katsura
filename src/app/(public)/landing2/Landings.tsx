'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { fillSample, resetSample } from '../modular/shared'
import { Contents } from './Contents'
import { Courses } from './Courses'
import { CoursesRich } from './CoursesRich'
import { Decks } from './Decks'
import { EightDecks } from './EightDecks'
import { Preview } from './Preview'
import { TwoZonesLanding } from './TwoZonesLanding'

const OPTIONS = [
  { n: 1, name: 'Course', rule: 'Modular learning in the playbook design: a learning panel with a square per card, three equal course tiles joined in order, and how it works.' },
  { n: 2, name: 'Two zones', rule: 'The module view zoomed out, simpler: the opening, one photograph and where to pick up on the warm tint; the modules as a short list on white.' },
  { n: 3, name: 'Preview', rule: 'Each module a full-width band with a large faint number, showing its cards as the module view’s task rectangles.' },
  { n: 4, name: 'Decks', rule: 'Built from the content: each module a deck of cards on one warm band, thinning as you read. Few words.' },
  { n: 5, name: 'Eight decks', rule: 'Option 4 for the eight chapters, each named in three words or fewer, in two rows of four. Card counts and drawings are stand-ins.' },
  { n: 6, name: 'Courses', rule: 'Five required courses as a list, each a row with a status mark, its length, a simple progress bar and one action. The eight chapters are grouped into five (a proposal); progress is a stand-in.' },
  { n: 7, name: 'Courses, richer', rule: 'Option 6 with Mantine UI patterns in the playbook style: a quiet Mantine progress bar under the opening, and each course with its own quiet ambience, an Up next badge, chips, a progress ring and one action.' },
] as const

/** Shape your practice's landing page: three options (?o=1 to 3). */
export function Landings() {
  const n = Math.min(7, Math.max(1, Number(useSearchParams().get('o')) || 7))
  return (
    <div className="l2">
      <nav className="p2-switch" aria-label="Options">
        <span className="p2-switch__links">
          {OPTIONS.map((o) => (
            <Link key={o.n} href={`/landing2?o=${o.n}`} aria-current={o.n === n ? 'page' : undefined}>
              {o.n}. {o.name}
            </Link>
          ))}
        </span>
        <span className="p2-switch__tools">
          <button type="button" onClick={fillSample}>
            Show with some progress
          </button>
          <button type="button" onClick={resetSample}>
            Reset
          </button>
        </span>
        <span className="p2-switch__rule">{OPTIONS[n - 1].rule}</span>
      </nav>
      {n === 1 && <Contents />}
      {n === 2 && <TwoZonesLanding />}
      {n === 3 && <Preview />}
      {n === 4 && <Decks />}
      {n === 5 && <EightDecks />}
      {n === 6 && <Courses />}
      {n === 7 && <CoursesRich />}
    </div>
  )
}
