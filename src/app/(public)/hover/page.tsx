import '../accordions/accordions.css'
import '../landscape/landscape-page.css'
import { Landscape3D } from '../foundations/[chapter]/components/landscape-3d/Landscape3D'
import { LAYERS } from '../foundations/[chapter]/content/how-we-think'
import * as C from './Cues'
import './hover.css'

export const metadata = { title: 'Hover. The RSD Playbook' }

const OPTIONS: { id: string; name: string; rule: string; cue: React.ReactNode }[] = [
  {
    id: 'float',
    name: 'Float',
    rule: 'An orange speech bubble with its tail pointing at the map, rising and falling 5px every few seconds.',
    cue: <C.Float />,
  },
  {
    id: 'beacon',
    name: 'Beacon',
    rule: 'A navy card with a small light at its start that sends out a soft ring every two seconds.',
    cue: <C.Beacon />,
  },
  {
    id: 'roll',
    name: 'Roll call',
    rule: 'A teal pill that names each of the five layers in turn, each name rolling up to the next: Explore the Individual, Explore the Service and so on.',
    cue: <C.RollCall />,
  },
  {
    id: 'note',
    name: 'Sticky note',
    rule: 'A yellow note, slightly tilted and gently swaying, with a hand-drawn arrow that draws itself down to the map.',
    cue: <C.StickyNote />,
  },
  {
    id: 'tap',
    name: 'Tap',
    rule: 'A purple pill with a pointer that presses and sends out a ripple, as if clicking.',
    cue: <C.Tap />,
  },
]

/** Five animated message boxes over chapter 04's Design Landscape, asking the reader to choose a region. */
export default function HoverPage() {
  return (
    <div className="lp">
      <header className="accp-intro">
        <h1 className="accp-intro__title">Hover</h1>
        <p className="accp-intro__lede">
          Five message boxes for the Design Landscape on How we think, each in a Transform colour.
          Each one floats above the map until you choose a region, then fades away. Each one keeps
          still for people who ask for less motion.
        </p>
      </header>
      {OPTIONS.map((o, i) => (
        <section key={o.id} className="accp-design" aria-labelledby={`h-${o.id}`}>
          <div className="accp-design__head">
            <span className="accp-design__id">{String(i + 1).padStart(2, '0')}</span>
            <h2 id={`h-${o.id}`} className="accp-design__name">
              {o.name}
            </h2>
            <p className="accp-design__rule">{o.rule}</p>
          </div>
          <div className="accp-design__demo lp-demo">
            <Landscape3D
              label="The five layers of the Design Landscape"
              restTitle="Five layers that shape decisions"
              restBody="The Design Landscape spans the Individual, Service, Organisation, Community and Environment."
              prompt="Select a region to explore the ecosystem"
              layers={LAYERS}
              cue={o.cue}
            />
          </div>
        </section>
      ))}
    </div>
  )
}
