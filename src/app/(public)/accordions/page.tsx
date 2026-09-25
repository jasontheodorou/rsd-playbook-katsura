import type { ReactNode } from 'react'

import { ITEMS, type Item } from './data'
import { ShowAllAccordion, SideIndex } from './interactive'
import './accordions.css'

export const metadata = { title: 'Accordion options. The RSD Playbook' }

/**
 * Ten accordion designs for long runs of information, in the Who we are frame (rail on column 1,
 * content on columns 2 to 12). Every one is built on the
 * native details element, so all content is in the page and works without JavaScript; two add a
 * small enhancement on top (show all, and a side index). The sample sections reuse wording from
 * Who we are and are placeholders for comparison only.
 */

const Body = ({ item }: { item: Item }) => (
  <>
    {item.body.map((p) => (
      <p key={p}>{p}</p>
    ))}
  </>
)

const n = (i: number) => String(i + 1).padStart(2, '0')

/* A details element with the shared open animation; `name` makes a set open one at a time. */
function Row({
  item,
  kind,
  name,
  open,
  children,
}: {
  item: Item
  kind: string
  name?: string
  open?: boolean
  children: ReactNode
}) {
  return (
    <details className={`acc acc--${kind}`} name={name} open={open}>
      {children}
      <div className="acc__body">
        <div className="acc__copy">
          <Body item={item} />
        </div>
      </div>
    </details>
  )
}

const Plus = () => <span className="acc__plus" aria-hidden="true" />

type Design = { id: string; name: string; rule: string; demo: ReactNode }

const DESIGNS: Design[] = [
  {
    id: '1',
    name: 'Hairline ledger',
    rule: 'Rules between rows, the number on column 2, the title on column 3 and a plus that turns to a minus on column 12’s edge. The quietest option: GOV.UK’s logic, set in our type.',
    demo: (
      <div className="acc-set acc-set--ledger">
        {ITEMS.map((it, i) => (
          <Row key={it.id} item={it} kind="ledger" open={i === 0}>
            <summary className="acc__summary">
              <span className="acc__n">{n(i)}</span>
              <span className="acc__title">{it.title}</span>
              <Plus />
            </summary>
          </Row>
        ))}
      </div>
    ),
  },
  {
    id: '2',
    name: 'Large index',
    rule: 'Titles at statement size with big numerals. The open row’s numeral turns orange. For a short list of weighty sections, where each title is worth reading on its own.',
    demo: (
      <div className="acc-set acc-set--index">
        {ITEMS.map((it, i) => (
          <Row key={it.id} item={it} kind="index" name="index" open={i === 1}>
            <summary className="acc__summary">
              <span className="acc__n">{n(i)}</span>
              <span className="acc__title">{it.title}</span>
            </summary>
          </Row>
        ))}
      </div>
    ),
  },
  {
    id: '3',
    name: 'Paper cards',
    rule: 'Each section is a card in the page’s warm paper, 8px apart. The open card lifts slightly and deepens a tone. A cousin of the stacking cards, so the two patterns feel related.',
    demo: (
      <div className="acc-set acc-set--cards">
        {ITEMS.map((it, i) => (
          <Row key={it.id} item={it} kind="cards" name="cards" open={i === 0}>
            <summary className="acc__summary">
              <span className="acc__title">{it.title}</span>
              <span className="acc__preview">{it.preview}</span>
              <Plus />
            </summary>
          </Row>
        ))}
      </div>
    ),
  },
  {
    id: '4',
    name: 'Side index',
    rule: 'On wide screens the titles become an index on columns 2 to 5 and the chosen section reads on columns 6 to 12, so long content never pushes the list away. Without JavaScript, and on phones, it is an ordinary accordion.',
    demo: <SideIndex items={ITEMS} />,
  },
  {
    id: '5',
    name: 'Preview lines',
    rule: 'Closed, each row shows its title and a one-line preview in grey; opening swaps the preview for the full text. Readers can scan the whole set without opening anything.',
    demo: (
      <div className="acc-set acc-set--preview">
        {ITEMS.map((it) => (
          <Row key={it.id} item={it} kind="preview">
            <summary className="acc__summary">
              <span className="acc__title">{it.title}</span>
              <span className="acc__preview">{it.preview}</span>
              <Plus />
            </summary>
          </Row>
        ))}
      </div>
    ),
  },
  {
    id: '6',
    name: 'Progress rail',
    rule: 'A vertical line on column 2 with a square node for each section. Opened sections fill their node, so the rail records what has been read.',
    demo: (
      <div className="acc-set acc-set--rail">
        {ITEMS.map((it, i) => (
          <Row key={it.id} item={it} kind="rail" open={i === 0}>
            <summary className="acc__summary">
              <span className="acc__node" aria-hidden="true" />
              <span className="acc__title">{it.title}</span>
              <span className="acc__preview">{it.preview}</span>
            </summary>
          </Row>
        ))}
      </div>
    ),
  },
  {
    id: '7',
    name: 'Show all sections',
    rule: 'The GOV.UK pattern for a lot of information: a “Show all sections” control above the set, a count, and each heading with a short summary under it.',
    demo: <ShowAllAccordion items={ITEMS} />,
  },
  {
    id: '8',
    name: 'Folder tabs',
    rule: 'Rows overlap like the edges of a file drawer, each a shade deeper than the one above. The open section pulls forward and its tab sits flush with the paper.',
    demo: (
      <div className="acc-set acc-set--folders">
        {ITEMS.map((it, i) => (
          <Row key={it.id} item={it} kind="folders" name="folders" open={i === 2}>
            <summary className="acc__summary">
              <span className="acc__n">{n(i)}</span>
              <span className="acc__title">{it.title}</span>
              <Plus />
            </summary>
          </Row>
        ))}
      </div>
    ),
  },
  {
    id: '9',
    name: 'Colour sweep',
    rule: 'Opening a row sweeps a soft yellow wash across it from the left, from column 2 to column 12, and the text settles in after. One quiet moment of motion per click.',
    demo: (
      <div className="acc-set acc-set--sweep">
        {ITEMS.map((it, i) => (
          <Row key={it.id} item={it} kind="sweep" name="sweep">
            <summary className="acc__summary">
              <span className="acc__n">{n(i)}</span>
              <span className="acc__title">{it.title}</span>
              <Plus />
            </summary>
          </Row>
        ))}
      </div>
    ),
  },
  {
    id: '10',
    name: 'Watermark numerals',
    rule: 'The open section shows its number as a large, pale watermark behind the text on columns 10 to 12, so the reader always knows where they are in a long set.',
    demo: (
      <div className="acc-set acc-set--watermark">
        {ITEMS.map((it, i) => (
          <details key={it.id} className="acc acc--watermark" name="watermark" open={i === 3}>
            <summary className="acc__summary">
              <span className="acc__title">{it.title}</span>
              <Plus />
            </summary>
            <div className="acc__body">
              <div className="acc__copy">
                <Body item={it} />
              </div>
              <span className="acc__mark" aria-hidden="true">
                {n(i)}
              </span>
            </div>
          </details>
        ))}
      </div>
    ),
  },
]

export default function AccordionsPage() {
  return (
    <div className="accp">
      {/* The Who we are frame: column 1 is the rail (chapter number and progress), and all content
          sits in columns 2 to 12. The rail here is a static stand-in for the chapter's own. */}
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">01</span>
        <span className="accp-rail__track" />
      </aside>

      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Accordions</h1>
          <p className="accp-intro__lede">
            Ten ways to set out a lot of information in sections that open and close, sized for the
            Who we are frame: columns 2 to 12, with text at the body text size and measure.
          </p>
        </header>

        {DESIGNS.map((d) => (
          <section key={d.id} className="accp-design" aria-labelledby={`acc-${d.id}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{d.id.padStart(2, '0')}</span>
              <h2 id={`acc-${d.id}`} className="accp-design__name">
                {d.name}
              </h2>
              <p className="accp-design__rule">{d.rule}</p>
            </div>
            <div className="accp-design__demo">{d.demo}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
