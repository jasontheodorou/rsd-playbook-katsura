import type { ReactNode } from 'react'

import './quote-card.css'

/**
 * Quote card, adapted from the original build's tinted quote card (pattern library: "Tinted quote
 * card"): a flat yellow panel with an oversized Georgia speech mark in its top-left corner, the
 * quotation in bold type and an optional small uppercase attribution. On a Foundations page it
 * spans page columns 2 to 9, like body text: the speech mark sits in the first column and the
 * quotation runs from column 3 to column 8, leaving one column of margin on the right.
 */
export function QuoteCard({
  text,
  attribution,
  className = '',
}: {
  text: ReactNode
  attribution?: string
  className?: string
}) {
  return (
    <figure className={`qcard ${className}`.trim()}>
      <span className="qcard__mark" aria-hidden="true">
        &ldquo;
      </span>
      <blockquote className="qcard__text">
        <p>{text}</p>
      </blockquote>
      {attribution && <figcaption className="qcard__attribution">{attribution}</figcaption>}
    </figure>
  )
}
