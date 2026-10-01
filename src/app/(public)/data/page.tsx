import '../accordions/accordions.css'
import '../different/different.css'
import * as C from './Charts'
import './data.css'

export const metadata = { title: 'Data. The RSD Playbook' }

type Idea = { id: string; name: string; rule: string; demo: React.ReactNode }

const IDEAS: Idea[] = [
  {
    id: 'steps',
    name: 'One chart in three steps',
    rule: 'The three things understanding data includes become three steps of one chart. Raw monthly results, then the baseline drawn through them, then a sketched range of where the service could go.',
    demo: <C.ThreeSteps />,
  },
  {
    id: 'two-ways',
    name: 'Same data, two ways',
    rule: 'A dense table of monthly figures turns into a chart of the same numbers, so the story behind the data shows in a second.',
    demo: <C.TwoWays />,
  },
  {
    id: 'start',
    name: 'Measure from the start',
    rule: 'The baseline draws itself first. As you scroll, each month after the change arrives above it, and the gain against the baseline is counted.',
    demo: <C.FromTheStart />,
  },
]

/** Three ways to bring "Data-driven decision-making" on How we think to life. */
export default function DataPage() {
  return (
    <div className="accp dd">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">04</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Data</h1>
          <p className="accp-intro__lede">
            Three ways to show data-driven decision-making on How we think with data, not just
            words. Every figure is example data for one made-up service measure: the share of online
            applications completed.
          </p>
        </header>
        {IDEAS.map((o, i) => (
          <section key={o.id} className="accp-design" aria-labelledby={`dd-${o.id}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={`dd-${o.id}`} className="accp-design__name">
                {o.name}
              </h2>
              <p className="accp-design__rule">{o.rule}</p>
            </div>
            <div className="accp-design__demo d-demo">{o.demo}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
