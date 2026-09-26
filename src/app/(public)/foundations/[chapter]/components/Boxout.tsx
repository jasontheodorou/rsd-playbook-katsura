import './boxout.css'

/**
 * Boxout, adapted from the original build's information card (Pathway 1's "p1v2__card"): a white
 * panel with a hairline edge and a short accent bar in its top-left corner, a small uppercase label
 * and a list of points with square markers. On a Foundations page it spans page columns 2 to 9,
 * like body text. The accent bar takes the chapter's colour in place of the old build's orange.
 */
export function Boxout({
  label,
  items,
  accent = '#d9cfc1',
  className = '',
}: {
  label?: string
  items: string[]
  /** The top-left bar's colour: the chapter's own colour, quietly. */
  accent?: string
  className?: string
}) {
  return (
    <aside
      className={`boxout ${className}`.trim()}
      style={{ '--boxout-accent': accent } as React.CSSProperties}
    >
      {label && <p className="boxout__label">{label}</p>}
      <ul className="boxout__list">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </aside>
  )
}
