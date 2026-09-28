import '../accordions/accordions.css'
import {
  Highlighter,
  InkAndGrey,
  LeadAndBody,
  ReadMore,
  StickyNote,
  ThreeQuestions,
  Together,
} from './Options'
import './textels.css'

export const metadata = { title: 'Breaking up text. The RSD Playbook' }

const OPTIONS = [
  {
    id: 'lead',
    name: 'Lead and body',
    rule: 'The first paragraph is set larger, in ink, like the statement under every title. The rest follows as body text. It gives each part a way in.',
    demo: <LeadAndBody />,
  },
  {
    id: 'ink',
    name: 'Ink and grey',
    rule: 'Each paragraph opens in ink and continues in grey, as the statement does. A reader can skim the ink alone and still follow the part.',
    demo: <InkAndGrey />,
  },
  {
    id: 'mark',
    name: 'Highlighter',
    rule: 'Two or three key phrases get a stroke of the part’s colour, drawn across them as they scroll into view, like marker on a printout.',
    demo: <Highlighter />,
  },
  {
    id: 'more',
    name: 'Read more',
    rule: 'The first two paragraphs show, and the rest wait behind a quiet disclosure. This is the “hide to include” rule applied to prose.',
    demo: <ReadMore />,
  },
  {
    id: 'qs',
    name: 'Three questions',
    rule: 'The closing paragraph’s three questions become three small cards in the manual’s own words, so the part ends on something to look at.',
    demo: <ThreeQuestions />,
  },
  {
    id: 'note',
    name: 'Sticky note',
    rule: 'One aside paragraph, the pivot, is lifted onto a sticky note in the part’s tint, slightly tilted, like the notes on the sketch.',
    demo: <StickyNote />,
  },
  {
    id: 'together',
    name: 'Together',
    rule: 'A lead paragraph, the pivot on a sticky note and the three questions as cards. The combination I would use for Hands.',
    demo: <Together />,
  },
]

/**
 * Ways to break up long runs of body text on chapter 03 without breaking the page's design logic.
 * Every option uses the Hands part, so only the text treatment changes.
 */
export default function TextelsPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">03</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Breaking up text</h1>
          <p className="accp-intro__lede">
            Seven ways to make the long passages on Head, heart and hands easier to read, each built
            from patterns the other pages already use. Every option shows the same part, Hands.
          </p>
        </header>
        {OPTIONS.map((o, i) => (
          <section key={o.id} className="accp-design" aria-labelledby={`tx-${o.id}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={`tx-${o.id}`} className="accp-design__name">
                {o.name}
              </h2>
              <p className="accp-design__rule">{o.rule}</p>
            </div>
            <div className="accp-design__demo tx-demo">{o.demo}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
