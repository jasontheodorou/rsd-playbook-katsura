import '../accordions/accordions.css'
import { LAYERS } from '../foundations/[chapter]/content/how-we-think'
import {
  Landscape,
  type Variant,
} from '../foundations/[chapter]/components/landscape-map/Landscape'
import './landscape-page.css'

export const metadata = { title: 'Landscape. The RSD Playbook' }

const OPTIONS: { id: Variant; name: string; rule: string }[] = [
  {
    id: 'wash',
    name: 'Wash',
    rule: 'Point at a part of the landscape and it takes a pale wash. Choose it and its name comes up at the top of its line, with the manual’s words below.',
  },
  {
    id: 'draw',
    name: 'Draw the line',
    rule: 'The five lines wait in pale grey. Choose a part and its line draws itself up from the ground to its name.',
  },
  {
    id: 'focus',
    name: 'Focus',
    rule: 'Choose a part and the rest of the landscape steps back, leaving that layer’s edges, buildings and people in full ink.',
  },
  {
    id: 'build',
    name: 'Build',
    rule: 'As it comes into view the landscape assembles from the centre out: the edges, then the buildings, then the people. Then it works as 01 does.',
  },
  {
    id: 'ripple',
    name: 'Ripple',
    rule: 'Choosing a part sends one soft ripple out from where you clicked, across that layer only, and its people rise a little as it passes.',
  },
]

/** Five ways to bring chapter 04's Design Landscape drawing to life. */
export default function LandscapePage() {
  return (
    <div className="lp">
      <header className="accp-intro">
        <h1 className="accp-intro__title">Landscape</h1>
        <p className="accp-intro__lede">
          Five treatments of the Design Landscape drawing for How we think. Each uses the same
          drawing, with its people in orange, the same five parts to choose and the manual’s words
          for each.
        </p>
      </header>
      {OPTIONS.map((o, i) => (
        <section key={o.id} className="accp-design" aria-labelledby={`l-${o.id}`}>
          <div className="accp-design__head">
            <span className="accp-design__id">{String(i + 1).padStart(2, '0')}</span>
            <h2 id={`l-${o.id}`} className="accp-design__name">
              {o.name}
            </h2>
            <p className="accp-design__rule">{o.rule}</p>
          </div>
          <div className="accp-design__demo lp-demo">
            <Landscape
              variant={o.id}
              label="The five layers of the Design Landscape"
              restTitle="Five layers that shape decisions"
              restBody="The Design Landscape spans the Individual, Service, Organisation, Community and Environment."
              prompt="Select a region to explore the ecosystem"
              layers={LAYERS}
            />
          </div>
        </section>
      ))}
    </div>
  )
}
