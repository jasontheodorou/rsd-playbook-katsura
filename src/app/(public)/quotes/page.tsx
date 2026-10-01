import '../accordions/accordions.css'
import '../refine/refine.css'
import { VOICES } from './voices'
import { Voices as Voices3D, type Look } from '../foundations/[chapter]/components/Voices'
import { VoicesNew } from '../foundations/[chapter]/components/VoicesNew'

export const metadata = { title: 'Two voices. The RSD Playbook' }

/*
 * Two people's quotes, explored one at a time: five treatments of one card, the data path's size,
 * with the two sketches Jason supplied on 1 October 2026 (Transform_People_11 and 22, trimmed to
 * their drawn edges). The quotes are What we care about's two "In their words" quotes. Which
 * quote goes with which drawing is a guess, for sign-off.
 */

const OPTIONS: { look: Look; name: string; rule: string }[] = [
  {
    look: 'turntable',
    name: 'Turntable',
    rule: 'Both people stand on a shallow turning floor. Moving on turns it half way, so the other person comes round to the front and speaks.',
  },
  {
    look: 'cube',
    name: 'Turning cube',
    rule: 'Each person is a face of a white cube. Moving on turns the cube a quarter, so you see the corner pass between them.',
  },
  {
    look: 'shuffle',
    name: 'Shuffle',
    rule: 'The two sketches are prints in a stack. The front one swings out to the side and tucks in behind as the other comes forward.',
  },
  {
    look: 'facing',
    name: 'Face to face',
    rule: 'The two people sit either side of the quote. The one speaking turns in and steps forward, and the other steps back.',
  },
  {
    look: 'popup',
    name: 'Pop-up',
    rule: 'Like a pop-up card: the speaker stands up from the page, and folds flat again when the other person stands up.',
  },
]

/** Five versions of a component to explore two people's quotes. */
export default function QuotesPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">05</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Two voices</h1>
          <p className="accp-intro__lede">
            Five ways to explore two people’s quotes in one card, the data path’s size. The sketches
            stay ink on white, and a slight 3D move carries you from one person to the other. Select
            the drawing, or use the arrow keys.
          </p>
        </header>
        <section className="accp-design" aria-labelledby="qv-paper">
          <div className="accp-design__head">
            <span className="accp-design__id">New</span>
            <h2 id="qv-paper" className="accp-design__name">
              On paper
            </h2>
            <p className="accp-design__rule">
              The page’s card on watercolour paper. The speaker is black pen lines on a white fill; the person
              stepping back is lines only, on the paper.
            </p>
          </div>
          <div className="accp-design__demo rf-demo">
            <Voices3D look="turntable" flourish={['sketch', 'highlight']} paper voices={VOICES} memoryKey="voices-paper" />
          </div>
        </section>
        <section className="accp-design" aria-labelledby="qv-new">
          <div className="accp-design__head">
            <span className="accp-design__id">New</span>
            <h2 id="qv-new" className="accp-design__name">
              With ambience
            </h2>
            <p className="accp-design__rule">
              The page’s card, rebuilt. The people stand on the warm tint with its paper grain, on a soft floor in the chapter’s
              colour, and the quote stays on white. The turn, the pen, the highlighter and the prompt are unchanged.
            </p>
          </div>
          <div className="accp-design__demo rf-demo">
            <VoicesNew voices={VOICES} memoryKey="voices-new" />
          </div>
        </section>
        {OPTIONS.map((o, i) => (
          <section key={o.look} className="accp-design" aria-labelledby={`qv-${o.look}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={`qv-${o.look}`} className="accp-design__name">
                {o.name}
              </h2>
              <p className="accp-design__rule">{o.rule}</p>
            </div>
            <div className="accp-design__demo rf-demo">
              <Voices3D look={o.look} voices={VOICES} memoryKey={`voices-${o.look}`} />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
