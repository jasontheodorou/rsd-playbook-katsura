import '../accordions/accordions.css'
import '../refine/refine.css'
import { TShapedTabs, type ArtLook, type Role } from '../foundations/[chapter]/components/TShapedTabs'
import { whoWeAre } from '../foundations/[chapter]/content/who-we-are'

export const metadata = { title: 'Role drawings. The RSD Playbook' }

/*
 * Five ways to give the role drawings Jason supplied on 1 October 2026 (RESEARCH, SERVICE,
 * INTERACTION and CONTENT, trimmed and split into ink and orange in public/illustrations/roles)
 * some life inside Who we are's T-shaped tabs, with the page's own roles.
 */

const ART: Record<string, string> = {
  researchers: '/illustrations/roles/research',
  'service-designers': '/illustrations/roles/service',
  'ux-designers': '/illustrations/roles/interaction',
  'content-designers': '/illustrations/roles/content',
}

const tabs = whoWeAre.blocks.find((b) => b.kind === 'tabs')
const ROLES: Role[] = tabs && tabs.kind === 'tabs' ? tabs.roles.map((r) => ({ ...r, art: ART[r.id] })) : []

const OPTIONS: { look: ArtLook; name: string; rule: string }[] = [
  {
    look: 'pen',
    name: 'Drawn in',
    rule: 'Choosing a role draws its picture in, like a pen moving across the tile: the black ink first, then the orange.',
  },
  {
    look: 'accent',
    name: 'Orange comes alive',
    rule: 'The black drawing is already there. A soft orange glow opens behind it and the orange parts spring into place.',
  },
  {
    look: 'paper',
    name: 'On paper',
    rule: 'Each drawing is on a small card of the watercolour paper, slightly tilted, which settles as it arrives.',
  },
  {
    look: 'sticker',
    name: 'Sticker on the photo',
    rule: 'The photograph stays. The drawing is a round white sticker that is pressed onto its lower corner.',
  },
  {
    look: 'plane',
    name: 'Coloured plane',
    rule: 'The drawing sits on a white tile with the page’s coloured plane behind it, a different colour for each role, sliding out as it arrives.',
  },
]

/** Five treatments for the role drawings in Who we are's tabs. */
export default function IconsPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">01</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Role drawings</h1>
          <p className="accp-intro__lede">
            Five ways to bring the four role drawings to life in Who we are’s tabs. Choose a tab to see
            each drawing arrive.
          </p>
        </header>
        {OPTIONS.map((o, i) => (
          <section key={o.look} className="accp-design" aria-labelledby={`ic-${o.look}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={`ic-${o.look}`} className="accp-design__name">
                {o.name}
              </h2>
              <p className="accp-design__rule">{o.rule}</p>
            </div>
            <div className="accp-design__demo rf-demo">
              <TShapedTabs roles={ROLES} look={o.look} />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
