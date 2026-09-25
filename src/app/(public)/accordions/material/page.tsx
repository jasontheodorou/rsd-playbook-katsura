import type { ReactNode } from 'react'

import { ITEMS, type Item } from '../data'
import '../accordions.css'
import { RippleSet } from './Ripple'
import './material.css'

export const metadata = { title: 'Material rails. The RSD Playbook' }

/**
 * Ten Material Design 3 (expressive) takes on the warm and light rail, in the Who we are frame.
 * Warm tonal surfaces, state layers, elevation, shape morphing and spring motion. Titles and text
 * stay on page column 3; only leading markers and trailing controls sit inside a card's padding.
 */

type Variant = {
  id: string
  name: string
  rule: string
  leading: 'number' | 'dot' | 'none'
  supporting?: boolean
}

const VARIANTS: Variant[] = [
  {
    id: '1',
    name: 'Tonal list',
    leading: 'number',
    rule: 'Flat rows with a tonal number container. Hover shows a soft state layer; the open row fills with warm secondary-container tone.',
  },
  {
    id: '2',
    name: 'Outlined cards',
    leading: 'number',
    rule: 'Each section is an outlined card, 8px apart. Opening drops the outline for a tonal surface and the first elevation level.',
  },
  {
    id: '3',
    name: 'Elevated cards',
    leading: 'number',
    rule: 'Low-elevation cards that rise to level 3 when opened, their corners morphing from 12px to 28px.',
  },
  {
    id: '4',
    name: 'Connected list',
    leading: 'number',
    rule: 'M3 Expressive’s connected group: rows 2px apart with tight inner corners and round outer ones. The open row detaches, takes full round corners and springs apart from its neighbours.',
  },
  {
    id: '5',
    name: 'Shape-morph marker',
    leading: 'dot',
    rule: 'An open rail with a small square marker that springs into a wide capsule when its section opens, the M3 Expressive shape morph.',
  },
  {
    id: '6',
    name: 'Two-line list',
    leading: 'number',
    supporting: true,
    rule: 'The classic M3 list item: tonal leading container, headline with supporting text beneath, and a chevron that turns when opened. Dividers are inset to the text.',
  },
  {
    id: '7',
    name: 'Ripple',
    leading: 'number',
    supporting: true,
    rule: 'The two-line list with Material’s press ripple: a warm wave spreads from where you tap, over a state layer.',
  },
  {
    id: '8',
    name: 'Wavy progress',
    leading: 'dot',
    rule: 'The rail uses M3 Expressive’s wavy progress indicator. The open section’s thread turns into a gently moving wave; the rest stay straight.',
  },
  {
    id: '9',
    name: 'Container transform',
    leading: 'number',
    rule: 'The open section lifts into its own rounded, elevated surface and its headline grows, with emphasised easing, as if the row became a card.',
  },
  {
    id: '10',
    name: 'Tonal icon button',
    leading: 'dot',
    rule: 'Each row ends in a filled tonal icon button. It is round at rest and morphs to a rounded square when its section opens, the expressive press state.',
  },
]

const Chevron = () => (
  <span className="md__trail" aria-hidden="true">
    <svg viewBox="0 0 24 24">
      <path d="M7 10l5 5 5-5" />
    </svg>
  </span>
)

function Rows({ v }: { v: Variant }) {
  return (
    <>
      {ITEMS.map((it: Item, i) => (
        <details key={it.id} className="acc md__row" name={`md-${v.id}`} open={i === 1}>
          <summary className="acc__summary md__summary">
            {v.leading === 'number' && (
              <span className="md__lead" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
            )}
            {v.leading === 'dot' && <span className="md__dot" aria-hidden="true" />}
            <span className="md__text">
              <span className="acc__title md__headline">{it.title}</span>
              {v.supporting && <span className="md__supporting">{it.preview}</span>}
            </span>
            {!v.supporting && <span className="acc__preview md__preview">{it.preview}</span>}
            <Chevron />
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
    </>
  )
}

function Demo({ v }: { v: Variant }): ReactNode {
  const cls = `acc-set md md--${v.id}`
  if (v.id === '7') {
    return (
      <RippleSet className={cls}>
        <Rows v={v} />
      </RippleSet>
    )
  }
  return (
    <div className={cls}>
      <Rows v={v} />
    </div>
  )
}

export default function MaterialPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">01</span>
        <span className="accp-rail__track" />
      </aside>

      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Material rails</h1>
          <p className="accp-intro__lede">
            Ten takes on the warm and light rail in the manner of Material Design 3: tonal surfaces,
            state layers, elevation, shape morphing and spring motion, in our palette and on our
            grid.
          </p>
        </header>

        {VARIANTS.map((v) => (
          <section key={v.id} className="accp-design" aria-labelledby={`md-${v.id}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{v.id.padStart(2, '0')}</span>
              <h2 id={`md-${v.id}`} className="accp-design__name">
                {v.name}
              </h2>
              <p className="accp-design__rule">{v.rule}</p>
            </div>
            <div className="accp-design__demo">
              <Demo v={v} />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
