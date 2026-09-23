/**
 * Seven candidate visuals for the space beside a chapter heading. All drawn in the playbook
 * language: circles carry colour, greys carry structure, Open Sans carries words. CSS-only motion,
 * switched off under reduced motion. Each takes the full right-hand column.
 */

const navy = 'var(--navy)'
const orange = 'var(--orange)'
const teal = 'var(--teal)'

/** 01 The mark, large: the chapter's own circle, the one that grew out of the card, at full size. */
export function MarkLarge() {
  return (
    <svg viewBox="0 0 100 100" className="ph-visual ph-visual--mark" aria-hidden>
      <circle cx="50" cy="50" r="48" fill="var(--grey-2)" />
      <circle cx="50" cy="34" r="14" fill={navy} />
      <circle cx="35" cy="60" r="14" fill={orange} />
      <circle cx="65" cy="60" r="14" fill={teal} />
    </svg>
  )
}

/** 02 The journey: all six marks in outline along an arc, this chapter solid. Says where you are. */
export function Journey() {
  const points = Array.from({ length: 6 }, (_, i) => {
    const t = i / 5
    const a = Math.PI * (1.15 - t * 1.3)
    return { x: 50 + Math.cos(a) * 40, y: 58 + Math.sin(a) * 34 }
  })
  return (
    <svg viewBox="0 0 100 100" className="ph-visual" aria-hidden>
      <path
        d={points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')}
        fill="none"
        stroke="var(--grey-3)"
        strokeWidth="0.6"
        strokeDasharray="1.2 2.2"
      />
      {points.map((p, i) => {
        const current = i === 3
        const r = current ? 11 : 6
        return (
          <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
            <circle r={r} fill={current ? 'var(--grey-2)' : 'none'} stroke={current ? 'none' : 'var(--grey-4)'} strokeWidth="0.8" />
            {current && (
              <>
                <circle cy={-4.5} r="3.6" fill={navy} />
                <circle cx={-4} cy={3} r="3.6" fill={orange} />
                <circle cx={4} cy={3} r="3.6" fill={teal} />
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/** 03 The numeral: the chapter number as ghosted display type, the mark's colour behind it. */
export function Numeral({ n = '04' }: { n?: string }) {
  return (
    <div className="ph-visual ph-numeral" aria-hidden>
      <span className="ph-numeral__disc" />
      <span className="ph-numeral__text">{n}</span>
    </div>
  )
}

/** 04 The mark, taken apart: its three orbs enlarged and overlapping, drifting very slowly. */
export function Exploded() {
  return (
    <div className="ph-visual ph-exploded" aria-hidden>
      <span className="ph-exploded__orb ph-exploded__orb--a" style={{ background: navy }} />
      <span className="ph-exploded__orb ph-exploded__orb--b" style={{ background: orange }} />
      <span className="ph-exploded__orb ph-exploded__orb--c" style={{ background: teal }} />
    </div>
  )
}

/** 05 A photograph inside the circle: the chapter's image, masked round, with a hairline ring. */
export function PhotoCircle() {
  return (
    <div className="ph-visual ph-photo" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/photos/head-flipchart.jpg" alt="" />
      <span className="ph-photo__ring" />
      <span className="ph-photo__dot" style={{ background: orange }} />
    </div>
  )
}

/** 06 Progress rings: the outer ring fills as the reader moves through the chapter. Functional. */
export function ProgressRings() {
  const r = 44
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 100 100" className="ph-visual ph-rings" aria-hidden>
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--grey-2)" strokeWidth="2.5" />
      <circle
        className="ph-rings__progress"
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="var(--grey-7)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c}
        transform="rotate(-90 50 50)"
      />
      <circle cx="50" cy="50" r="34" fill="var(--grey-2)" />
      <circle cx="50" cy="38" r="10" fill={navy} />
      <circle cx="39.5" cy="57" r="10" fill={orange} />
      <circle cx="60.5" cy="57" r="10" fill={teal} />
    </svg>
  )
}

/** 07 The chapter's shape as a path: its sections as stops on a vertical line, the mark at the top. */
export function Contents({ items = ['Head', 'Heart', 'Hands'] }: { items?: string[] }) {
  return (
    <div className="ph-visual ph-contents" aria-hidden>
      <div className="ph-contents__line" />
      <ol>
        <li className="ph-contents__mark">
          <svg viewBox="0 0 100 100" width="72" height="72">
            <circle cx="50" cy="50" r="48" fill="var(--grey-2)" />
            <circle cx="50" cy="34" r="14" fill={navy} />
            <circle cx="35" cy="60" r="14" fill={orange} />
            <circle cx="65" cy="60" r="14" fill={teal} />
          </svg>
        </li>
        {items.map((label, i) => (
          <li key={label}>
            <span className="ph-contents__dot" style={{ background: [navy, orange, teal][i % 3] }} />
            <span className="ph-contents__label">{label}</span>
            <span className="ph-contents__meta">{['How we think', 'Why we care', 'How we deliver'][i % 3]}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}


/* ---- Variations on 04, the mark taken apart. Same three orbs, quieter each time. ---- */

const orbs = [
  { colour: navy, cx: 50, cy: 30, r: 24 },
  { colour: orange, cx: 30, cy: 66, r: 22 },
  { colour: teal, cx: 70, cy: 66, r: 22 },
]

/** 04a Outlines: the orbs as hairlines in their own colours, overlaps left to the eye. */
export function ExplodedOutlines() {
  return (
    <svg viewBox="0 0 100 100" className="ph-visual ph-drift" aria-hidden>
      {orbs.map((o) => (
        <circle key={o.colour} cx={o.cx} cy={o.cy} r={o.r} fill="none" stroke={o.colour} strokeWidth="0.7" />
      ))}
    </svg>
  )
}

/** 04b Tints: the orbs at a sixth of their strength, overlaps deepening where they meet. */
export function ExplodedTints() {
  return (
    <svg viewBox="0 0 100 100" className="ph-visual ph-drift" aria-hidden style={{ mixBlendMode: 'multiply' }}>
      {orbs.map((o) => (
        <circle key={o.colour} cx={o.cx} cy={o.cy} r={o.r + 2} fill={o.colour} fillOpacity="0.16" />
      ))}
    </svg>
  )
}

/** 04c Glow: the orbs as soft discs that fade to nothing at the edge, like light rather than paint. */
export function ExplodedGlow() {
  return (
    <svg viewBox="0 0 100 100" className="ph-visual ph-drift" aria-hidden>
      <defs>
        {orbs.map((o, i) => (
          <radialGradient key={i} id={`glow-${i}`}>
            <stop offset="0%" stopColor={o.colour} stopOpacity="0.55" />
            <stop offset="55%" stopColor={o.colour} stopOpacity="0.22" />
            <stop offset="100%" stopColor={o.colour} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      {orbs.map((o, i) => (
        <circle key={i} cx={o.cx} cy={o.cy} r={o.r + 8} fill={`url(#glow-${i})`} />
      ))}
    </svg>
  )
}

/** 04d Halftone: the orbs as fields of tiny dots, a texture more than a shape. */
export function ExplodedHalftone() {
  return (
    <svg viewBox="0 0 100 100" className="ph-visual" aria-hidden>
      <defs>
        {orbs.map((o, i) => (
          <pattern key={i} id={`dots-${i}`} width="3.2" height="3.2" patternUnits="userSpaceOnUse">
            <circle cx="1.6" cy="1.6" r="0.75" fill={o.colour} fillOpacity="0.7" />
          </pattern>
        ))}
        <radialGradient id="dots-fade">
          <stop offset="60%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="dots-mask">
          <rect width="100" height="100" fill="url(#dots-fade)" />
        </mask>
      </defs>
      <g mask="url(#dots-mask)">
        {orbs.map((o, i) => (
          <circle key={i} cx={o.cx} cy={o.cy} r={o.r + 3} fill={`url(#dots-${i})`} />
        ))}
      </g>
    </svg>
  )
}

/** 04e Rings: each orb as a set of thin concentric rings, breathing very slowly. */
export function ExplodedRings() {
  return (
    <svg viewBox="0 0 100 100" className="ph-visual ph-breathe" aria-hidden>
      {orbs.map((o) =>
        [1, 0.72, 0.44].map((k, j) => (
          <circle
            key={`${o.colour}-${j}`}
            cx={o.cx}
            cy={o.cy}
            r={o.r * k}
            fill="none"
            stroke={o.colour}
            strokeWidth="0.5"
            strokeOpacity={0.9 - j * 0.25}
          />
        )),
      )}
    </svg>
  )
}

/** 04f Grey, with one orange: two orbs in the paper's own greys, the smallest in orange. The brand's rule, kept to the letter. */
export function ExplodedGreyOrange() {
  return (
    <svg viewBox="0 0 100 100" className="ph-visual ph-drift" aria-hidden>
      <circle cx="46" cy="40" r="30" fill="var(--grey-2)" />
      <circle cx="66" cy="62" r="24" fill="var(--grey-1)" stroke="var(--grey-3)" strokeWidth="0.5" />
      <circle cx="30" cy="70" r="9" fill={orange} />
    </svg>
  )
}
