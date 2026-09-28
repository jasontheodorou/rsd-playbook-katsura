import '../../accordions/accordions.css'
import '../textels.css'
import { FannedStack, MarginNotes, OneNote, Pair, ThreeQuestions } from './Notes'
import './notes.css'

export const metadata = { title: 'Sticky notes. The RSD Playbook' }

const OPTIONS = [
  {
    id: 'one',
    name: 'One note',
    rule: 'The pivot, lifted out of the flow onto one note. The version you picked, for comparison.',
    demo: <OneNote />,
  },
  {
    id: 'pair',
    name: 'A pair',
    rule: 'Two notes side by side, tilted opposite ways: what we focus on, and when we pivot. The second sits a little lower, as notes do on a wall.',
    demo: <Pair />,
  },
  {
    id: 'three',
    name: 'Three questions',
    rule: 'Desirability, feasibility and viability as a cluster of three square notes in three shades of the part’s tint, at slightly different heights and angles.',
    demo: <ThreeQuestions />,
  },
  {
    id: 'margin',
    name: 'Margin notes',
    rule: 'The text keeps its column, and two notes sit in the empty columns to its right, each beside the paragraph it belongs to. Below 1024px they fall back into the flow.',
    demo: <MarginNotes />,
  },
  {
    id: 'fan',
    name: 'Fanned stack',
    rule: 'The three questions as a neat stack of notes that fans out when you point at it or choose it, so each can be read.',
    demo: <FannedStack />,
  },
]

/** Sticky note arrangements for chapter 03's Hands part, from one note to three. */
export default function NotesPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">03</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Sticky notes</h1>
          <p className="accp-intro__lede">
            Five ways to arrange up to three sticky notes in the Hands part, each in the manual’s
            own words and the part’s colour.
          </p>
        </header>
        {OPTIONS.map((o, i) => (
          <section key={o.id} className="accp-design" aria-labelledby={`sn-${o.id}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={`sn-${o.id}`} className="accp-design__name">
                {o.name}
              </h2>
              <p className="accp-design__rule">{o.rule}</p>
            </div>
            <div
              className={`accp-design__demo tx-demo${o.id === 'margin' ? ' sn-demo--wide' : ''}`}
            >
              {o.demo}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
