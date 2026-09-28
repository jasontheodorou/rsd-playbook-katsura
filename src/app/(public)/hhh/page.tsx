import '../accordions/accordions.css'
import { DepthAndColour, Flip, LiftAndRead, PinnedOnArrival } from './Concepts'
import './hhh.css'

export const metadata = { title: 'Head, heart and hands sketch. The RSD Playbook' }

const CONCEPTS = [
  {
    id: 'lift',
    name: 'Lift and read',
    rule: 'Point at a poster and it lifts off the wall and straightens, while the others step back and its sticky notes stir. Its one-line definition appears underneath.',
    demo: <LiftAndRead />,
  },
  {
    id: 'flip',
    name: 'Turn it over',
    rule: 'Choose a poster and it turns over, like a card, to show its definition written on the back in the colour of its scribble. Choose it again to turn it back.',
    demo: <Flip />,
  },
  {
    id: 'pinned',
    name: 'Pinned as you arrive',
    rule: 'The wall builds itself as it scrolls into view: each poster drops onto its pins in turn, then the sticky notes follow. Point at a poster and it swings gently from its pins.',
    demo: <PinnedOnArrival />,
  },
  {
    id: 'depth',
    name: 'Depth and colour',
    rule: 'The pieces float at different depths as the pointer moves, notes more than posters. The poster nearest the pointer, and its notes, keep their colour; the rest fade to pencil.',
    demo: <DepthAndColour />,
  },
]

/**
 * Ways to make the head, heart and hands sketch interactive, for chapter 03. The sketch is cut
 * into its three posters and seven sticky notes (public/illustrations/hhh), which rebuild it
 * exactly, so each piece can move on its own.
 */
export default function HhhPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">03</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Head, heart and hands sketch</h1>
          <p className="accp-intro__lede">
            Four ways to bring the posters in the sketch to life. Each uses the original drawing,
            cut into its pieces, and shows the manual&rsquo;s one-line definition of the part you
            choose.
          </p>
        </header>
        {CONCEPTS.map((c, i) => (
          <section key={c.id} className="accp-design" aria-labelledby={`hx-${c.id}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={`hx-${c.id}`} className="accp-design__name">
                {c.name}
              </h2>
              <p className="accp-design__rule">{c.rule}</p>
            </div>
            <div className="accp-design__demo">{c.demo}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
