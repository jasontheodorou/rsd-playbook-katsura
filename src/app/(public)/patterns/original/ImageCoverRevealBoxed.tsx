// Copied from the-rsd-playbook src/experiments/pilot-3/patterns/ImageCoverRevealBoxed.tsx for the pattern library's record of the original build.
'use client'

import { useRef, type RefObject } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'motion/react'

/**
 * Cribbed from jasontheodorou/valencia-pattern-library
 *   src/patterns/image-cover-reveal/ImageCoverReveal.tsx
 *
 * A boxed container with a scroll-driven reveal:
 *   · Cover starts full-width (image fully hidden) and clips away from the
 *     right as the box scrolls into view
 *   · Heading has an ink layer INSIDE the cover and a white layer BELOW it,
 *     positioned at identical coordinates. Because the ink layer is a child
 *     of the cover, the same clipPath removes both the cream background and
 *     the ink text in one operation — the white text beneath is revealed in
 *     exact sync, with no possibility of a sub-pixel seam.
 *
 * Adaptations for pilot-3:
 *   · Tokens (background, ink, font) are props, defaulting to the RSD palette
 *   · Accepts a `scrollContainer` ref so it works inside pilot-3's nested
 *     `.p3-scroll` container rather than window scroll
 */
type Props = {
  imageUrl: string
  heading: string
  height?: number
  bgColor?: string
  inkColor?: string
  scrollContainer?: RefObject<HTMLElement | null>
}

const FONT = "'Open Sans', -apple-system, 'Segoe UI', sans-serif"

export function ImageCoverRevealBoxed({
  imageUrl,
  heading,
  height = 480,
  bgColor = '#FCFBF8',
  inkColor = '#111',
  scrollContainer,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: boxRef,
    container: scrollContainer,
    // Reveal spans a full viewport-height of scroll: it starts as the box
    // enters at the bottom and completes when the box's top reaches the
    // viewport top. Slower than "bottom-at-bottom", so the covered state is
    // readable before the wipe begins and the wipe itself lasts long enough
    // to feel like an event.
    offset: ['start end', 'start start'],
  })

  // Track the maximum progress ever reached — the reveal is one-way, so
  // scrolling back up must NOT un-reveal the image. `peak` is a motion
  // value that only ratchets upward; the clip-path is driven from it.
  const peak = useMotionValue(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > peak.get()) peak.set(v)
  })

  // Cover clips from the right (right-inset 0% → 100%). The ink heading is
  // a child of the cover, so both are clipped by the same operation — no
  // sub-pixel drift is possible between the cream mask and the ink text.
  const coverClip = useTransform(
    peak,
    [0, 1],
    ['inset(0 0% 0 0)', 'inset(0 100% 0 0)']
  )

  const textStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 'clamp(20px, 2.4vw, 34px)',
    fontWeight: 800,
    lineHeight: 1.12,
    letterSpacing: '-0.015em',
    margin: 0,
    padding: '0 36px',
    maxWidth: 520,
    boxSizing: 'border-box',
  }

  // Both heading layers use identical positioning coordinates so the ink
  // (inside the cover) and the white (below the cover) render at the same
  // pixel positions relative to the box.
  const headingAnchor: React.CSSProperties = {
    position: 'absolute',
    bottom: 36,
    left: 0,
    right: 0,
    pointerEvents: 'none',
  }

  return (
    <div
      ref={boxRef}
      style={{ position: 'relative', height, overflow: 'hidden', borderRadius: 0 }}
    >
      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* White heading — always in place; hidden by the cover on the
          covered side, revealed on the uncovered side. */}
      <div style={{ ...headingAnchor, zIndex: 1 }}>
        <h3 style={{ ...textStyle, color: '#ffffff' }}>{heading}</h3>
      </div>

      {/* Cover — clips from right. Ink heading lives inside so it's clipped
          together with the cover background: single clipPath, one truth. */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: bgColor,
          zIndex: 2,
          clipPath: coverClip,
        }}
      >
        <div style={headingAnchor}>
          <h3 style={{ ...textStyle, color: inkColor }}>{heading}</h3>
        </div>
      </motion.div>
    </div>
  )
}
