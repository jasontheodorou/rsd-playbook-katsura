import type { ReactNode } from 'react'

import './accordion.css'

/**
 * The Foundations accordion ("quiet outline", chosen on /accordions/tonal). Each section is a row
 * on a faint warm tint, with a small marker, the title and a grey preview, and a 32px outlined
 * button at the end of the row that fills when its section opens.
 * Built on details, so every section's text is in the page and works without JavaScript.
 *
 * It spans the 11 content columns of a Foundations page (page columns 2 to 12).
 */
export type AccordionSection = { id: string; title: string; preview?: string; body: ReactNode }

export function Accordion({
  sections,
  name,
  open,
  className = '',
}: {
  sections: AccordionSection[]
  /** Give a name to let only one section be open at a time. */
  name?: string
  /** The id of a section to show open at first. */
  open?: string
  className?: string
}) {
  return (
    <div className={`qacc ${className}`.trim()}>
      {sections.map((s) => (
        <details key={s.id} className="qacc__row" name={name} open={s.id === open}>
          <summary className="qacc__summary">
            <span className="qacc__marker" aria-hidden="true" />
            <span className="qacc__title">{s.title}</span>
            {s.preview && <span className="qacc__preview">{s.preview}</span>}
            <span className="qacc__button" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5" />
              </svg>
            </span>
          </summary>
          <div className="qacc__body">
            <div className="qacc__copy">{s.body}</div>
          </div>
        </details>
      ))}
    </div>
  )
}
