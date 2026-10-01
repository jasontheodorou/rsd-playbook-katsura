import '../../accordions/accordions.css'
import '../../refine/refine.css'
import { VOICES } from '../voices'
import { Voices as Voices3D, type Flourish } from '../../foundations/[chapter]/components/Voices'

export const metadata = { title: 'Two voices: flourishes. The RSD Playbook' }

/*
 * Four quiet flourishes, each tried on the Turntable from /quotes (1 October 2026). Every one
 * moves only when the reader moves on to the other person. The highlighted words are a guess,
 * for sign-off.
 */

const OPTIONS: { flourish: Flourish | Flourish[]; name: string; rule: string }[] = [
  {
    flourish: 'highlight',
    name: 'Highlighter sweep',
    rule: 'A soft stroke of the quote card’s yellow sweeps once behind a few of the speaker’s words as the quote arrives.',
  },
  {
    flourish: 'plane',
    name: 'Plane behind the speaker',
    rule: 'The pale blue plane from the photographs, as a disc behind the speaker’s head, one grid gap down and to the right. It moves with them and fades as they step back.',
  },
  {
    flourish: 'shadow',
    name: 'Pencil shadow',
    rule: 'A few hatch lines in the drawings’ own ink lie on the floor in front of the speaker, drawn one after another as they arrive.',
  },
  {
    flourish: 'sketch',
    name: 'Sketched in',
    rule: 'As the speaker comes to the front, their lines are drawn in across the drawing, like a pen going over a faint copy.',
  },
  {
    flourish: ['sketch', 'highlight'],
    name: 'Sketched in, then highlighted',
    rule: 'Sketched in and Highlighter sweep together. The pen draws the speaker in first, and once the drawing is finished the yellow sweeps behind their words.',
  },
]

/** Four flourishes for the two voices card. */
export default function QuotesFlourishPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">05</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Two voices: flourishes</h1>
          <p className="accp-intro__lede">
            Four quiet flourishes, each on the Turntable, and a fifth that combines two of them. Each one plays only when you move on to
            the other person, so select the drawing to see it.
          </p>
        </header>
        {OPTIONS.map((o, i) => (
          <section key={String(o.flourish)} className="accp-design" aria-labelledby={`qf-${String(o.flourish).replace(',', '-')}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={`qf-${String(o.flourish).replace(',', '-')}`} className="accp-design__name">
                {o.name}
              </h2>
              <p className="accp-design__rule">{o.rule}</p>
            </div>
            <div className="accp-design__demo rf-demo">
              <Voices3D look="turntable" flourish={o.flourish} voices={VOICES} memoryKey={`voices-${String(o.flourish)}`} />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
