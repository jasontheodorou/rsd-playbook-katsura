import { ITEMS } from '../data'
import '../accordions.css'
import './rail.css'

export const metadata = { title: 'Progress rail, softened. The RSD Playbook' }

/**
 * Softer versions of accordion option 6, the progress rail, in the Who we are frame. Each keeps
 * the rail's idea (a line on column 2 with a marker per section) and eases its edges: warmer
 * colours, lighter lines, rounded markers and gentler open states.
 */

type Variant = { id: string; name: string; rule: string }

const VARIANTS: Variant[] = [
  {
    id: 'a',
    name: 'Warm and light',
    rule: 'The same layout with the hard edges taken off: a 1px warm grey line, small rounded-square markers in sand, and a soft orange fill for open sections instead of navy.',
  },
  {
    id: 'b',
    name: 'Stretching marker',
    rule: 'The marker is a small rounded bar. When a section opens, its bar grows down the length of the text, so the rail shows exactly how far that section runs.',
  },
  {
    id: 'c',
    name: 'Soft panel',
    rule: 'No hard line between sections. The open section sits on a rounded panel of warm paper, and its marker gains a pale ring. The rail is a faint thread behind.',
  },
  {
    id: 'd',
    name: 'Numbered markers',
    rule: 'Each marker is a soft rounded square holding its number. Open sections fill pale yellow, so the rail reads as a gentle, numbered contents list.',
  },
  {
    id: 'e',
    name: 'Filling thread',
    rule: 'The thread fills with a warm colour down to the section you have open, so the rail works as a quiet progress bar through the set.',
  },
]

export default function RailVariantsPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">01</span>
        <span className="accp-rail__track" />
      </aside>

      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Progress rail, softened</h1>
          <p className="accp-intro__lede">
            Five gentler versions of option 6. Each keeps a line on column 2 with a marker for every
            section, and softens how it looks and how it opens.
          </p>
        </header>

        {VARIANTS.map((v) => (
          <section key={v.id} className="accp-design" aria-labelledby={`rail-${v.id}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{v.id.toUpperCase()}</span>
              <h2 id={`rail-${v.id}`} className="accp-design__name">
                {v.name}
              </h2>
              <p className="accp-design__rule">{v.rule}</p>
            </div>
            <div className="accp-design__demo">
              <div className={`acc-set srail srail--${v.id}`}>
                {ITEMS.map((it, i) => (
                  <details
                    key={it.id}
                    className="acc srail__row"
                    name={`rail-${v.id}`}
                    open={i === 1}
                  >
                    <summary className="acc__summary">
                      <span className="srail__node" aria-hidden="true">
                        {v.id === 'd' ? String(i + 1).padStart(2, '0') : null}
                      </span>
                      <span className="acc__title">{it.title}</span>
                      <span className="acc__preview">{it.preview}</span>
                    </summary>
                    <div className="acc__body">
                      <div className="acc__copy">
                        {it.body.map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
