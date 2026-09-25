import { ITEMS } from '../data'
import '../accordions.css'
import '../material/material.css'
import './tonal.css'

export const metadata = { title: 'Tonal icon button, restrained. The RSD Playbook' }

/**
 * Five restrained versions of the Material rail's tonal icon button (option 10), in the Who we are
 * frame. Each takes something away: colour, size, the preview line, the shape morph or the thread.
 */

type Variant = {
  id: string
  name: string
  rule: string
  preview: boolean
  icon: 'chevron' | 'plus'
  marker: boolean
}

const VARIANTS: Variant[] = [
  {
    id: '1',
    name: 'Quiet outline',
    rule: 'A smaller 32px button with only a hairline outline at rest. Opening fills it with soft sand and squares its corners. Markers stay grey; nothing turns orange.',
    preview: true,
    icon: 'chevron',
    marker: true,
  },
  {
    id: '2',
    name: 'Ink only',
    rule: 'No accent colour at all. The button is a pale tone at rest and turns solid ink when its section opens, with the marker to match.',
    preview: true,
    icon: 'chevron',
    marker: true,
  },
  {
    id: '3',
    name: 'Single accent',
    rule: 'The preview line goes, so each row is just a title and a button. The open button is the only warm colour in the set.',
    preview: false,
    icon: 'chevron',
    marker: true,
  },
  {
    id: '4',
    name: 'Plus and minus',
    rule: 'The button keeps one rounded-square shape and shows a plus or a minus. Only its tone changes when opened: the calmest motion of the five.',
    preview: true,
    icon: 'plus',
    marker: true,
  },
  {
    id: '5',
    name: 'Button only',
    rule: 'No markers and no thread: a title, a hairline between rows and a small tonal button. The rail appears only as a faint line beside the open section’s text.',
    preview: false,
    icon: 'chevron',
    marker: false,
  },
]

function Icon({ kind }: { kind: 'chevron' | 'plus' }) {
  return (
    <span className="md__trail" aria-hidden="true">
      {kind === 'chevron' ? (
        <svg viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5" />
        </svg>
      ) : (
        <span className="acc__plus tb__plus" />
      )}
    </span>
  )
}

export default function TonalPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">01</span>
        <span className="accp-rail__track" />
      </aside>

      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Tonal icon button, restrained</h1>
          <p className="accp-intro__lede">
            Five quieter versions of option 10. Each keeps the tonal button at the end of the row
            and takes something else away.
          </p>
        </header>

        {VARIANTS.map((v) => (
          <section key={v.id} className="accp-design" aria-labelledby={`tb-${v.id}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{v.id.padStart(2, '0')}</span>
              <h2 id={`tb-${v.id}`} className="accp-design__name">
                {v.name}
              </h2>
              <p className="accp-design__rule">{v.rule}</p>
            </div>
            <div className="accp-design__demo">
              <div className={`acc-set md md--10 tb tb--${v.id}`}>
                {ITEMS.map((it, i) => (
                  <details key={it.id} className="acc md__row" name={`tb-${v.id}`} open={i === 1}>
                    <summary className="acc__summary md__summary">
                      {v.marker && <span className="md__dot" aria-hidden="true" />}
                      <span className="md__text">
                        <span className="acc__title md__headline">{it.title}</span>
                      </span>
                      {v.preview && <span className="acc__preview md__preview">{it.preview}</span>}
                      <Icon kind={v.icon} />
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
