import '../accordions/accordions.css'
import {
  Curtain,
  DriftingPlane,
  MovingPhoto,
  PhotoPerParagraph,
  PhotoStack,
  Spotlight,
  Tiles,
} from './Options'
import './hhh2.css'

export const metadata = { title: 'Photos on Head, heart and hands. The RSD Playbook' }

const OPTIONS = [
  {
    id: 'curtain',
    name: 'Curtain',
    rule: 'The photo opens from a narrow slit to its full width as it scrolls up the screen, easing out of a slight zoom. Scroll back and it closes again.',
    demo: <Curtain />,
  },
  {
    id: 'drift',
    name: 'Drifting plane',
    rule: 'The photo and its coloured plane move at different speeds as you scroll, so the frame seems to float behind the photo. The quietest option.',
    demo: <DriftingPlane />,
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    rule: 'The photo rests in pencil grey, like the sketch, and a soft circle of colour follows the pointer. On first view the light sweeps across once, so readers know it is there.',
    demo: <Spotlight />,
  },
  {
    id: 'stack',
    name: 'Photo stack',
    rule: 'Three photos lie loosely stacked, like prints on a table. Choose the top one and it slides to the back, showing the next. Adds two photos to each part.',
    demo: <PhotoStack />,
  },
  {
    id: 'moving',
    name: 'Moving photo',
    rule: 'A short film in the photo’s place, on its plane: here, the original build’s sticky notes clip. It plays silently on a loop only while on screen.',
    demo: <MovingPhoto />,
  },
  {
    id: 'scrolly',
    name: 'Photo per paragraph',
    rule: 'The photo pins beside the text as you read and changes to match each paragraph. It breaks the one-column rule, so it is here as a comparison.',
    demo: <PhotoPerParagraph />,
  },
  {
    id: 'tiles',
    name: 'Assembling tiles',
    rule: 'The photo arrives as a grid of tiles that drift into place, a little like notes going up on a wall.',
    demo: <Tiles />,
  },
]

/**
 * Ways to use photos on chapter 03, Head, heart and hands, so it is less text, still photo, text.
 * Each option uses the same part (Head) so only the image treatment changes.
 */
export default function Hhh2Page() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">03</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Photos on Head, heart and hands</h1>
          <p className="accp-intro__lede">
            Seven ways to give the photos in each part more life. Every option shows the same part,
            Head, so only the photo changes.
          </p>
        </header>
        {OPTIONS.map((o, i) => (
          <section key={o.id} className="accp-design" aria-labelledby={`h2-${o.id}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={`h2-${o.id}`} className="accp-design__name">
                {o.name}
              </h2>
              <p className="accp-design__rule">{o.rule}</p>
            </div>
            <div className="accp-design__demo h2-demo">{o.demo}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
