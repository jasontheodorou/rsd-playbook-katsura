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
            <circle
              r={r}
              fill={current ? 'var(--grey-2)' : 'none'}
              stroke={current ? 'none' : 'var(--grey-4)'}
              strokeWidth="0.8"
            />
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
            <span
              className="ph-contents__dot"
              style={{ background: [navy, orange, teal][i % 3] }}
            />
            <span className="ph-contents__label">{label}</span>
            <span className="ph-contents__meta">
              {['How we think', 'Why we care', 'How we deliver'][i % 3]}
            </span>
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
        <circle
          key={o.colour}
          cx={o.cx}
          cy={o.cy}
          r={o.r}
          fill="none"
          stroke={o.colour}
          strokeWidth="0.7"
        />
      ))}
    </svg>
  )
}

/** 04b Tints: the orbs at a sixth of their strength, overlaps deepening where they meet. */
export function ExplodedTints() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="ph-visual ph-drift"
      aria-hidden
      style={{ mixBlendMode: 'multiply' }}
    >
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
      <circle
        cx="66"
        cy="62"
        r="24"
        fill="var(--grey-1)"
        stroke="var(--grey-3)"
        strokeWidth="0.5"
      />
      <circle cx="30" cy="70" r="9" fill={orange} />
    </svg>
  )
}

/* ---- Variations on 05, a photograph in the circle. Same photographs, quieter each time. ---- */

const photos = {
  head: '/photos/head-flipchart.jpg',
  heart: '/photos/journey-map-group.jpg',
  hands: '/photos/lego-prototyping.jpg',
}

/** 05a Duotone: the photograph in navy and paper, so it sits with the type rather than against it. */
export function PhotoDuotone() {
  return (
    <svg viewBox="0 0 100 100" className="ph-visual" aria-hidden>
      <defs>
        <clipPath id="pd-clip">
          <circle cx="50" cy="50" r="46" />
        </clipPath>
        <filter id="pd-mono">
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="46" fill={navy} />
      <image
        href={photos.head}
        width="100"
        height="100"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#pd-clip)"
        filter="url(#pd-mono)"
        style={{ mixBlendMode: 'screen', opacity: 0.9 }}
      />
    </svg>
  )
}

/** 05b Three photographs: the mark's three orbs, each a photograph. Head, heart and hands, literally. */
export function PhotoTriad() {
  const orbSet = [
    { src: photos.head, cx: 50, cy: 31, r: 23 },
    { src: photos.heart, cx: 31, cy: 65, r: 21 },
    { src: photos.hands, cx: 69, cy: 65, r: 21 },
  ]
  return (
    <svg viewBox="0 0 100 100" className="ph-visual ph-drift" aria-hidden>
      <defs>
        {orbSet.map((o, i) => (
          <clipPath key={i} id={`pt-${i}`}>
            <circle cx={o.cx} cy={o.cy} r={o.r} />
          </clipPath>
        ))}
      </defs>
      {orbSet.map((o, i) => (
        <g key={i}>
          <circle cx={o.cx} cy={o.cy} r={o.r + 1.2} fill="#fcfbf8" />
          <image
            href={o.src}
            x={o.cx - o.r}
            y={o.cy - o.r}
            width={o.r * 2}
            height={o.r * 2}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#pt-${i})`}
          />
        </g>
      ))}
    </svg>
  )
}

/** 05c Fade: the photograph inside the circle, dissolving into the paper towards its edge. */
export function PhotoFade() {
  return (
    <svg viewBox="0 0 100 100" className="ph-visual" aria-hidden>
      <defs>
        <radialGradient id="pf-fade">
          <stop offset="45%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="pf-mask">
          <circle cx="50" cy="50" r="48" fill="url(#pf-fade)" />
        </mask>
      </defs>
      <image
        href={photos.head}
        width="100"
        height="100"
        preserveAspectRatio="xMidYMid slice"
        mask="url(#pf-mask)"
        style={{ opacity: 0.85 }}
      />
    </svg>
  )
}

/** 05d Off the edge: one very large circle, mostly beyond the page, a slice of photograph showing. */
export function PhotoOffEdge() {
  return (
    <div className="ph-visual ph-offedge" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photos.heart} alt="" />
    </div>
  )
}

/** 05e Monochrome with one orange point: the photograph in grey, and the brand's one allowed colour beside it. */
export function PhotoMono() {
  return (
    <div className="ph-visual ph-mono" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photos.head} alt="" />
      <span className="ph-mono__dot" style={{ background: orange }} />
    </div>
  )
}

/** 05f Split: half photograph, half flat colour, one circle. An echo of the What we do mark. */
export function PhotoSplit() {
  return (
    <svg viewBox="0 0 100 100" className="ph-visual" aria-hidden>
      <defs>
        <clipPath id="ps-left">
          <path d="M50 4 A46 46 0 0 0 50 96 Z" />
        </clipPath>
      </defs>
      <path d="M50 4 A46 46 0 0 1 50 96 Z" fill={teal} />
      <image
        href={photos.hands}
        width="100"
        height="100"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#ps-left)"
      />
    </svg>
  )
}

/* ---- Six more on 05 ---- */

/** 05g Offset ring: a modest photograph with one large hairline circle set behind and to the side. */
export function PhotoOffsetRing() {
  return (
    <svg viewBox="0 0 100 100" className="ph-visual" aria-hidden>
      <defs>
        <clipPath id="por-clip">
          <circle cx="44" cy="54" r="30" />
        </clipPath>
      </defs>
      <circle cx="60" cy="42" r="38" fill="none" stroke="var(--grey-3)" strokeWidth="0.6" />
      <image
        href={photos.head}
        x="14"
        y="24"
        width="60"
        height="60"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#por-clip)"
      />
    </svg>
  )
}

/** 05h Eclipse: a flat colour circle passing in front of the photograph, leaving a crescent of it. */
export function PhotoEclipse() {
  return (
    <svg viewBox="0 0 100 100" className="ph-visual ph-drift" aria-hidden>
      <defs>
        <clipPath id="pe-clip">
          <circle cx="42" cy="50" r="40" />
        </clipPath>
      </defs>
      <image
        href={photos.heart}
        x="2"
        y="10"
        width="80"
        height="80"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#pe-clip)"
      />
      <circle cx="66" cy="50" r="40" fill="#fcfbf8" />
      <circle cx="66" cy="50" r="40" fill={teal} fillOpacity="0.92" />
    </svg>
  )
}

/** 05i Small, on a disc: a little photograph resting on a large pale disc. Mostly paper. */
export function PhotoSmallOnDisc() {
  return (
    <svg viewBox="0 0 100 100" className="ph-visual" aria-hidden>
      <defs>
        <clipPath id="psd-clip">
          <circle cx="58" cy="60" r="17" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="46" fill="var(--grey-1)" />
      <image
        href={photos.hands}
        x="41"
        y="43"
        width="34"
        height="34"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#psd-clip)"
      />
      <circle cx="33" cy="36" r="5" fill={orange} />
    </svg>
  )
}

/** 05j Horizon: only the lower half of the circle carries the photograph, under a hairline horizon. */
export function PhotoHorizon() {
  return (
    <svg viewBox="0 0 100 100" className="ph-visual" aria-hidden>
      <defs>
        <clipPath id="phz-clip">
          <path d="M4 50 A46 46 0 0 0 96 50 Z" />
        </clipPath>
      </defs>
      <path d="M4 50 A46 46 0 0 1 96 50 Z" fill="none" stroke="var(--grey-3)" strokeWidth="0.5" />
      <image
        href={photos.head}
        x="4"
        y="4"
        width="92"
        height="92"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#phz-clip)"
      />
      <line x1="4" y1="50" x2="96" y2="50" stroke="var(--grey-7)" strokeWidth="0.6" />
    </svg>
  )
}

/** 05k Halo: a sharp small photograph inside a large, softly blurred version of itself. */
export function PhotoHalo() {
  return (
    <div className="ph-visual ph-halo" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ph-halo__blur" src={photos.heart} alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ph-halo__sharp" src={photos.heart} alt="" />
    </div>
  )
}

/** 05l Screen: the photograph seen through a fine dot screen, so it reads as print rather than photo. */
export function PhotoScreen() {
  return (
    <svg viewBox="0 0 100 100" className="ph-visual" aria-hidden>
      <defs>
        <clipPath id="psc-clip">
          <circle cx="50" cy="50" r="46" />
        </clipPath>
        <pattern id="psc-dots" width="2.4" height="2.4" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="0.72" fill="#fcfbf8" />
        </pattern>
        <filter id="psc-mono">
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <g clipPath="url(#psc-clip)">
        <image
          href={photos.head}
          width="100"
          height="100"
          preserveAspectRatio="xMidYMid slice"
          filter="url(#psc-mono)"
          style={{ opacity: 0.8 }}
        />
        <rect width="100" height="100" fill="url(#psc-dots)" />
      </g>
    </svg>
  )
}
