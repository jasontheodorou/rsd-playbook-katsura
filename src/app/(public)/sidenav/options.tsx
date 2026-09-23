/**
 * Ten side-navigation designs for a chapter page. Each carries reading progress that completes at
 * the bottom, and a way back to the Foundations grid. All in terracotta, the colour of the original
 * rail. Static mocks: progress is shown at about 55 per cent, some with a slow demonstration loop.
 */

const Mark = ({ size = 40 }: { size?: number }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
    <circle cx="50" cy="50" r="48" fill="var(--grey-2)" />
    <circle cx="50" cy="34" r="14" fill="var(--navy)" />
    <circle cx="35" cy="60" r="14" fill="var(--orange)" />
    <circle cx="65" cy="60" r="14" fill="var(--teal)" />
  </svg>
)

const Chevron = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

/** 01 The rail, refined: the original 48px column, thinner ribbon, hairline, back control at the foot instead of the middle. */
export function RailRefined() {
  return (
    <div className="sn sn--rail">
      <div className="sn__ribbon">
        <div className="sn__fill" />
      </div>
      <button
        type="button"
        className="sn__square sn__square--foot"
        aria-label="Back to the foundations"
      >
        <Chevron />
      </button>
    </div>
  )
}

/** 02 Thread and bead: a hairline thread down the edge, a bead travelling along it, becoming the way back at the bottom. */
export function ThreadBead() {
  return (
    <div className="sn sn--thread">
      <div className="sn__thread" />
      <div className="sn__thread-fill" />
      <span className="sn__bead" />
      <button type="button" className="sn__bead-home" aria-label="Back to the foundations">
        <Chevron />
      </button>
    </div>
  )
}

/** 03 Floating pill: a soft vertical pill set in from the edge, number at the top, fill inside, back at the foot. */
export function FloatingPill() {
  return (
    <div className="sn sn--pill">
      <span className="sn__pill-num">04</span>
      <div className="sn__pill-track">
        <div className="sn__pill-fill" />
      </div>
      <button type="button" className="sn__pill-home" aria-label="Back to the foundations">
        <Chevron />
      </button>
    </div>
  )
}

/** 04 Dots column: the six chapters as dots down the edge, this one ringed and filling as you read; the top dot is home. */
export function DotsColumn() {
  return (
    <div className="sn sn--dots">
      <button type="button" className="sn__home-dot" aria-label="Back to the foundations" />
      <ol>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <li
            key={i}
            className="sn__dot"
            data-current={i === 3 ? 'true' : undefined}
            data-read={i < 3 ? 'true' : undefined}
          >
            {i === 3 && (
              <svg viewBox="0 0 32 32" className="sn__dot-ring" aria-hidden>
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke="var(--tc-track)"
                  strokeWidth="2"
                />
                <circle
                  className="sn__dot-progress"
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke="var(--tc-deep)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="87.96"
                  strokeDashoffset="39.6"
                  transform="rotate(-90 16 16)"
                />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

/** 05 Margin contents: the chapter's sections as small labels down the edge, joined by a thread that fills; "Foundations" at the top is the way back. */
export function MarginContents() {
  return (
    <nav className="sn sn--contents" aria-label="Chapter contents">
      <button type="button" className="sn__contents-home">
        <Chevron /> Foundations
      </button>
      <div className="sn__contents-line">
        <div className="sn__contents-fill" />
      </div>
      <ol>
        {['Head', 'Heart', 'Hands'].map((l, i) => (
          <li key={l} data-state={i === 0 ? 'done' : i === 1 ? 'current' : undefined}>
            <span /> {l}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** 06 Corner ring: a small progress ring in the bottom-left corner with the chapter mark inside; full, it becomes the way back. */
export function CornerRing() {
  return (
    <div className="sn sn--ring">
      <button type="button" className="sn__ring-btn" aria-label="Back to the foundations">
        <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden>
          <circle cx="32" cy="32" r="29" fill="none" stroke="var(--tc-track)" strokeWidth="2.5" />
          <circle
            className="sn__ring-progress"
            cx="32"
            cy="32"
            r="29"
            fill="none"
            stroke="var(--tc)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="182.2"
            strokeDashoffset="82"
            transform="rotate(-90 32 32)"
          />
        </svg>
        <span className="sn__ring-mark">
          <Mark size={34} />
        </span>
      </button>
    </div>
  )
}

/** 07 Edge glow: no line at all. A soft terracotta light along the edge that deepens as you read. Back via the top bar trail. */
export function EdgeGlow() {
  return (
    <div className="sn sn--glow">
      <div className="sn__glow" />
    </div>
  )
}

/** 08 Editorial strip: a slim strip with the chapter number set vertically at the top, the ribbon, and a small arrow at the foot. */
export function EditorialStrip() {
  return (
    <div className="sn sn--strip">
      <span className="sn__strip-num">Chapter 04</span>
      <div className="sn__strip-track">
        <div className="sn__strip-fill" />
      </div>
      <button type="button" className="sn__strip-home" aria-label="Back to the foundations">
        <Chevron />
      </button>
    </div>
  )
}

/** 09 Bookmark: a terracotta ribbon hanging from the top edge whose length is your progress; its tail is the way back. */
export function Bookmark() {
  return (
    <div className="sn sn--bookmark">
      <div className="sn__bookmark">
        <span className="sn__bookmark-num">04</span>
      </div>
      <button type="button" className="sn__bookmark-home" aria-label="Back to the foundations">
        <Chevron />
      </button>
    </div>
  )
}

/** 10 Inset rail: the original idea with the hard edges gone. A rounded rail floated in from the edge, and a round back button at its foot. */
export function InsetRail() {
  return (
    <div className="sn sn--inset">
      <div className="sn__inset-track">
        <div className="sn__inset-fill" />
      </div>
      <button type="button" className="sn__inset-home" aria-label="Back to the foundations">
        <Chevron />
      </button>
    </div>
  )
}

/* ---- The way back, at the foot of the pill: eight marks that are not circles. ---- */

export type FootKind = 'bar' | 'diamond' | 'word' | 'tab' | 'wedge' | 'cross' | 'ticks' | 'twobars'

export function PillWithFoot({ foot }: { foot: FootKind }) {
  return (
    <div className="sn sn--pill" data-foot={foot}>
      <span className="sn__pill-num">04</span>
      <div className="sn__pill-track">
        <div className="sn__pill-fill" />
      </div>
      {foot === 'tab' ? (
        <button
          type="button"
          className="sn__foot sn__foot--tab"
          aria-label="Back to the foundations"
        />
      ) : foot === 'word' ? (
        <button type="button" className="sn__foot sn__foot--word">
          Back
        </button>
      ) : foot === 'ticks' ? (
        <button
          type="button"
          className="sn__foot sn__foot--ticks"
          aria-label="Back to the foundations"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} data-current={i === 3 ? 'true' : undefined} />
          ))}
        </button>
      ) : foot === 'twobars' ? (
        <button
          type="button"
          className="sn__foot sn__foot--twobars"
          aria-label="Back to the foundations"
        >
          <span />
          <span />
        </button>
      ) : foot === 'cross' ? (
        <button
          type="button"
          className="sn__foot sn__foot--cross"
          aria-label="Back to the foundations"
        >
          <span />
          <span />
        </button>
      ) : (
        <button
          type="button"
          className={`sn__foot sn__foot--${foot}`}
          aria-label="Back to the foundations"
        />
      )}
    </div>
  )
}
