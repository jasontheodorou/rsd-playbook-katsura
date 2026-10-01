import '../accordions/accordions.css'
import '../foundations/[chapter]/page/foundations-chapter.css'
import { Balance } from '../foundations/[chapter]/components/Balance'
import { BenefitsCard } from '../foundations/[chapter]/components/BenefitsCard'
import { PhotoDiagram } from '../foundations/[chapter]/components/PhotoDiagram'
import { BENEFITS, WATCHOUTS } from '../foundations/[chapter]/content/why-design-matters'
import './refine.css'

export const metadata = { title: 'Refine. The RSD Playbook' }

const LOOKS: { id: string; name: string; rule: string }[] = [
  {
    id: 'rebuilt',
    name: 'Rebuilt from scratch',
    rule: 'Raised, with a prompt, rebuilt as its own component with clean dimensions: two equal halves, every size on the 8px scale, a regular pentagon placed so the drawing centres itself, connectors worked out from each surface’s real edge, and the photo in a rounded rectangle under the reading.',
  },
  {
    id: 'hairline',
    name: 'Hairline, the standard',
    rule: 'The chosen direction: a crisp white card with 4px corners, no washes, thin outlined rings, a small-capital centre and the photo running to the card’s edge.',
  },
  {
    id: 'hairline raised',
    name: 'Raised, with a prompt',
    rule: 'Hairline with the two problems fixed. The diagram’s side takes a quiet warm tint, so the card has two tones. The five circles are filled and lifted like buttons. The title becomes the Design Landscape’s grey speech bubble, pointing into the diagram, and each circle pulses in turn until something is chosen, on every visit.',
  },
  {
    id: 'hairline numbered',
    name: 'Numbered',
    rule: 'A small slate number beside each label, so the diagram and the reading’s “02 of 05” speak the same language.',
  },
  {
    id: 'hairline orbit',
    name: 'Orbit',
    rule: 'One faint ring through the five, in place of the curved lines, so the diagram reads as a whole.',
  },
  {
    id: 'hairline mono',
    name: 'Monochrome',
    rule: 'The photographs rest in greyscale and take their colour when an item is chosen, so the reader’s choice brings the card to life.',
  },
  {
    id: 'hairline caps',
    name: 'Small capitals',
    rule: 'The labels set in small, spaced capitals and the title a step quieter, as a printed diagram would be.',
  },
  {
    id: 'hairline grid',
    name: 'Dot grid',
    rule: 'A faint dot grid on the diagram’s side, like squared drawing paper, giving the white a quiet texture.',
  },
]

/** Hairline, the chosen look for the photo diagram, and five subtle elevations of it. */
export default function RefinePage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">02</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Refine</h1>
          <p className="accp-intro__lede">
            Hairline is the standard for the photo diagram on Why design matters. Below it, five
            versions each add one small thing to it. Each keeps the same content, photos and
            behaviour.
          </p>
        </header>
        <section className="accp-design" aria-labelledby="rf-balance">
          <div className="accp-design__head">
            <span className="accp-design__id">B1</span>
            <h2 id="rf-balance" className="accp-design__name">
              Balance, toned down
            </h2>
            <p className="accp-design__rule">
              The same sliders and behaviour in the benefits card’s toned-down style: a hairline
              card on the warm tint, white rows, white handles that turn ink past the middle, the
              prompt as the yellow speech bubble, and pulses on each handle in turn until the first
              move.
            </p>
          </div>
          <div className="accp-design__demo rf-demo">
            <div className="rf-wide">
              <Balance items={WATCHOUTS} look="quiet" />
            </div>
          </div>
        </section>
        <section className="accp-design" aria-labelledby="rf-balance-now">
          <div className="accp-design__head">
            <span className="accp-design__id">B0</span>
            <h2 id="rf-balance-now" className="accp-design__name">
              Balance, as it is now
            </h2>
            <p className="accp-design__rule">For comparison.</p>
          </div>
          <div className="accp-design__demo rf-demo">
            <div className="rf-wide">
              <Balance items={WATCHOUTS} />
            </div>
          </div>
        </section>
        {LOOKS.map((o, i) => (
          <section key={o.id} className="accp-design" aria-labelledby={`rf-${o.id}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{String(i).padStart(2, '0')}</span>
              <h2 id={`rf-${o.id}`} className="accp-design__name">
                {o.name}
              </h2>
              <p className="accp-design__rule">{o.rule}</p>
            </div>
            <div className="accp-design__demo rf-demo">
              {o.id === 'rebuilt' ? (
                <BenefitsCard
                  items={BENEFITS}
                  restPhoto="/photos/three-way-conversation.png"
                  restAlt="Three colleagues in conversation at a table, one of them explaining with her hands."
                />
              ) : (
                <PhotoDiagram
                  look={o.id}
                  cue={o.id === 'hairline raised' ? 'visit' : 'once'}
                  hub="Good design"
                  label="What good design does"
                  emptyTitle="Five things good design does"
                  emptyBody="Choose one on the diagram to find out how."
                  items={BENEFITS}
                  title="Explore the benefits of design"
                  restPhoto="/photos/three-way-conversation.png"
                  restAlt="Three colleagues in conversation at a table, one of them explaining with her hands."
                  washes={['#f1dc93', '#eadfcf']}
                />
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
