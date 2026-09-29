import '../accordions/accordions.css'
import { Landscape } from '../foundations/[chapter]/components/landscape-map/Landscape'
import { LAYERS } from '../foundations/[chapter]/content/how-we-think'
import '../landscape/landscape-page.css'

export const metadata = { title: 'Landscape fit. The RSD Playbook' }

const OPTIONS: { id: 'below' | 'corner' | 'legend'; name: string; rule: string }[] = [
  {
    id: 'below',
    name: 'As it is now',
    rule: 'The message above the drawing and the gold box below it, for comparison.',
  },
  {
    id: 'corner',
    name: 'Message in the band',
    rule: 'The message sits as plain text in the empty band above the table, left-aligned and centred in the band. It fades once the first region is chosen and the lines come in.',
  },
  {
    id: 'legend',
    name: 'Box as the map’s key',
    rule: 'The gold box moves into the empty corner, like the key on a map. It holds the message, then the chosen region’s name and text. The Individual line rises up behind it.',
  },
]

/** Ways to fill the empty corner the drawing's perspective leaves, in the chapter's columns. */
export default function LandscapeFitPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">04</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Landscape fit</h1>
          <p className="accp-intro__lede">
            The drawing is in perspective, so the table’s back edge starts well in from its front
            corner and leaves an empty corner at the top left. Each option below fills it
            differently, on the chapter’s own columns.
          </p>
        </header>
        {OPTIONS.map((o, i) => (
          <section key={o.id} className="accp-design" aria-labelledby={`f-${o.id}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={`f-${o.id}`} className="accp-design__name">
                {o.name}
              </h2>
              <p className="accp-design__rule">{o.rule}</p>
            </div>
            <div className="accp-design__demo lp-demo">
              <Landscape
                variant="focus"
                fit={o.id}
                prompt="Select a region to explore the ecosystem"
                label="The five layers of the Design Landscape"
                restTitle="Five layers that shape decisions"
                restBody="The Design Landscape spans the Individual, Service, Organisation, Community and Environment."
                layers={LAYERS}
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
