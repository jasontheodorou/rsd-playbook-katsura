import '../accordions/accordions.css'
import '../refine/refine.css'
import { DataPath } from '../foundations/[chapter]/components/DataPath'
import { DATA_STOPS as DATA } from '../foundations/[chapter]/content/how-we-think'

export const metadata = { title: 'Data pattern. The RSD Playbook' }

/*
 * "Data-driven decision-making" (How we think) as a path: five stops along a rising line, from
 * understanding where a client is today to evaluating what changed. The stops are the section's
 * own (the three things understanding data includes and the two methods), in an order that tells
 * its story: understand, set the baseline, map the system, sketch the future, evaluate. The order,
 * the labels and the three list items' sentences (taken from the section's paragraphs) are for
 * sign-off.
 */

/** The benefits card's pattern for How we think's "Data-driven decision-making". */
export default function DataPatternPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">04</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Data pattern</h1>
          <p className="accp-intro__lede">
            An original pattern for data-driven decision-making on How we think, in the benefits
            card’s look and feel. The five stops are the section’s own: the three things
            understanding data includes and the two methods our designers use.
          </p>
        </header>
        <section className="accp-design" aria-labelledby="dp-new">
          <div className="accp-design__head">
            <span className="accp-design__id">01</span>
            <h2 id="dp-new" className="accp-design__name">
              The data path
            </h2>
            <p className="accp-design__rule">
              Rebuilt to line up: split on a page grid line, every stop on the dot grid and above
              its label, the labels on one line along the bottom, and the same top and bottom lines
              across both halves.
            </p>
          </div>
          <div className="accp-design__demo rf-demo">
            <DataPath
              prompt="Follow how we use data"
              label="How we use data"
              restTitle="From data to decisions"
              restBody="To make decisions about future change, we need to fully and honestly understand where our clients are today."
              items={DATA}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
