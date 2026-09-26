import '../../accordions/accordions.css'
import { Diagram } from '../../foundations/[chapter]/components/Diagram'
import { BENEFITS } from '../data'

export const metadata = { title: 'Benefits diagram. The RSD Playbook' }

/** The interactive benefits diagram, redesigned with Phosphor duotone icons, in the chapter frame. */
export default function DiagramPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">02</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Benefits diagram</h1>
          <p className="accp-intro__lede">
            The interactive diagram, redesigned: duotone icons, labelled tiles, curved connectors
            that draw in, and a panel that tells you what to do.
          </p>
        </header>
        <section className="accp-design" aria-labelledby="bd-ref">
          <div className="accp-design__head">
            <span className="accp-design__id">01</span>
            <h2 id="bd-ref" className="accp-design__name">
              Refined
            </h2>
            <p className="accp-design__rule">
              Minimal, but not flat: frosted surfaces over two soft, slowly drifting washes, a deep
              slate accent in place of orange and black, connectors that fade out from the centre,
              and a light that travels along the chosen line.
            </p>
          </div>
          <div className="accp-design__demo">
            <Diagram items={BENEFITS} look="refined" />
          </div>
        </section>
        <section className="accp-design" aria-labelledby="bd-min">
          <div className="accp-design__head">
            <span className="accp-design__id">02</span>
            <h2 id="bd-min" className="accp-design__name">
              Minimal
            </h2>
            <p className="accp-design__rule">
              Paper and ink only. The stage and panel lift off the page as white surfaces with a
              hairline and a soft shadow; benefit colours are gone and icons are light lines.
            </p>
          </div>
          <div className="accp-design__demo">
            <Diagram items={BENEFITS} look="minimal" />
          </div>
        </section>
        <section className="accp-design" aria-labelledby="bd-col">
          <div className="accp-design__head">
            <span className="accp-design__id">03</span>
            <h2 id="bd-col" className="accp-design__name">
              Colour
            </h2>
            <p className="accp-design__rule">The previous version, for comparison.</p>
          </div>
          <div className="accp-design__demo">
            <Diagram items={BENEFITS} />
          </div>
        </section>
      </div>
    </div>
  )
}
