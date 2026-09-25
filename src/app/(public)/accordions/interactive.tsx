'use client'

import { useRef, useState, useSyncExternalStore } from 'react'

import type { Item } from './data'

const noop = () => () => {}
/** False during server render and hydration, true once JavaScript is running. */
const useEnhanced = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )

const n = (i: number) => String(i + 1).padStart(2, '0')

/* 7. Show all sections: GOV.UK's accordion. The control opens or closes every section at once. */
export function ShowAllAccordion({ items }: { items: Item[] }) {
  const root = useRef<HTMLDivElement>(null)
  const enhanced = useEnhanced()
  const [allOpen, setAllOpen] = useState(false)

  const sync = () => {
    const all = [...(root.current?.querySelectorAll('details') ?? [])]
    setAllOpen(all.length > 0 && all.every((d) => d.open))
  }
  const toggleAll = () => {
    const next = !allOpen
    root.current?.querySelectorAll('details').forEach((d) => (d.open = next))
    setAllOpen(next)
  }

  return (
    <div className="acc-set acc-set--showall" ref={root}>
      <div className="acc-showall__bar">
        <span className="acc-showall__count">{items.length} sections</span>
        {enhanced && (
          <button
            type="button"
            className="acc-showall__toggle"
            aria-expanded={allOpen}
            onClick={toggleAll}
          >
            <span className="acc__plus" data-open={allOpen} aria-hidden="true" />
            {allOpen ? 'Hide all sections' : 'Show all sections'}
          </button>
        )}
      </div>
      {items.map((it) => (
        <details key={it.id} className="acc acc--showall" onToggle={sync}>
          <summary className="acc__summary">
            <span className="acc__title">{it.title}</span>
            <span className="acc__preview">{it.preview}</span>
            <span className="acc__action" aria-hidden="true" />
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
  )
}

/* 4. Side index: an index of titles beside the chosen section on wide screens. Without JavaScript,
      and below 1024px, it stays a plain accordion. */
export function SideIndex({ items }: { items: Item[] }) {
  const enhanced = useEnhanced()
  const [active, setActive] = useState(0)

  if (!enhanced) {
    return (
      <div className="acc-set acc-set--ledger">
        {items.map((it, i) => (
          <details key={it.id} className="acc acc--ledger" name="side" open={i === 0}>
            <summary className="acc__summary">
              <span className="acc__n">{n(i)}</span>
              <span className="acc__title">{it.title}</span>
              <span className="acc__plus" aria-hidden="true" />
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
    )
  }

  const item = items[active]
  return (
    <div className="acc-side">
      <ul
        className="acc-side__list"
        role="tablist"
        aria-orientation="vertical"
        aria-label="Sections"
      >
        {items.map((it, i) => (
          <li key={it.id}>
            <button
              type="button"
              role="tab"
              id={`side-tab-${it.id}`}
              aria-selected={i === active}
              aria-controls="side-panel"
              className="acc-side__tab"
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') setActive((a) => Math.min(items.length - 1, a + 1))
                else if (e.key === 'ArrowUp') setActive((a) => Math.max(0, a - 1))
              }}
            >
              <span className="acc__n">{n(i)}</span>
              <span className="acc__title">{it.title}</span>
            </button>
          </li>
        ))}
      </ul>
      <div
        id="side-panel"
        role="tabpanel"
        aria-labelledby={`side-tab-${item.id}`}
        className="acc-side__panel"
        key={item.id}
      >
        <p className="acc-side__heading">{item.title}</p>
        <div className="acc__copy">
          {item.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
