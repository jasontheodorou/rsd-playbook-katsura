import { ITEMS } from '../data'
import '../accordions.css'
import '../rail/rail.css'
import './warm.css'

export const metadata = { title: 'Warm and light, modern. The RSD Playbook' }

/**
 * Three more current takes on the progress rail's "Warm and light" version, in the Who we are
 * frame. Same palette and layout (thread on column 2, titles on 3); newer behaviour.
 */

type Variant = { id: string; name: string; rule: string }

const VARIANTS: Variant[] = [
  {
    id: '1',
    name: 'Focus',
    rule: 'Opening a section brings it forward: the other rows fade back, and the marker takes a warm gradient with a soft halo. The thread fades out at both ends.',
  },
  {
    id: '2',
    name: 'Reading thread',
    rule: 'The open section’s stretch of thread fills as you scroll through its text, and a small capsule rides the tip of the fill. The rail becomes a progress line for the section you are reading.',
  },
  {
    id: '3',
    name: 'Number chips',
    rule: 'Markers become small pill chips holding each number. The open chip warms and widens to say “Reading”, dividers fade out at their ends, and the text sharpens into focus as it appears.',
  },
]

export default function WarmVariantsPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">01</span>
        <span className="accp-rail__track" />
      </aside>

      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Warm and light, modern</h1>
          <p className="accp-intro__lede">
            Three newer takes on the warm and light rail. The same colours and grid, with the motion
            and detail of current product design.
          </p>
        </header>

        {VARIANTS.map((v) => (
          <section key={v.id} className="accp-design" aria-labelledby={`warm-${v.id}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{v.id.padStart(2, '0')}</span>
              <h2 id={`warm-${v.id}`} className="accp-design__name">
                {v.name}
              </h2>
              <p className="accp-design__rule">{v.rule}</p>
            </div>
            <div className="accp-design__demo">
              <div className={`acc-set srail warm warm--${v.id}`}>
                {ITEMS.map((it, i) => (
                  <details
                    key={it.id}
                    className="acc srail__row"
                    name={`warm-${v.id}`}
                    open={i === 1}
                  >
                    <summary className="acc__summary">
                      <span className="srail__node" aria-hidden="true">
                        {v.id === '3' && (
                          <>
                            <span className="warm__chip-n">{String(i + 1).padStart(2, '0')}</span>
                            <span className="warm__chip-label">Reading</span>
                          </>
                        )}
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
