'use client'

import { motion, stagger, useAnimate, useReducedMotion, type Variants } from 'motion/react'
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

import './foundation-marks.css'

/**
 * One mark per Foundations chapter: a symbol on a 160-unit circle, after the "try" reference
 * (28 September 2026). Each mark's geometry is drawn twice from the same shapes:
 *
 * - fm-line: unread. Grey outlines on a grey circle; each shape is filled with the circle's
 *   colour, so it cuts out whatever sits behind it.
 * - fm-solid: read. One solid dark colour on a pastel circle of the same family, with gaps in
 *   the circle's colour (fm-knock) where shapes overlap.
 *
 * When the chapter is read, the pastel blooms out from the centre, the outline fades out as the
 * solid fades in, and the solid settles. Colour is in foundation-marks.css. Hover and focus
 * movement comes from the card (MarkCard) through the "rest" and "hover" variants.
 */
export type MarkProps = {
  className?: string
  style?: CSSProperties
  read?: boolean
  /** Trace the outline when it first scrolls into view. Used at the end of an unread chapter. */
  drawOnView?: boolean
}

/** Soft, heavily damped: no overshoot, so nothing bounces. */
const soft = { type: 'spring', bounce: 0, duration: 0.7 } as const
const bloom = { type: 'spring', bounce: 0, duration: 1.1 } as const
const still = { duration: 0 } as const

const hoverVariants = (hover: Record<string, number>): Variants => ({
  rest: { x: 0, y: 0, scale: 1, rotate: 0, transition: soft },
  hover: { ...hover, transition: soft },
})

const LINES = '.fm-line :is(circle, path, rect)'

/** Every drawing is scaled to this share of its size and centred on the circle, for air around it. */
const SCALE = 0.82

type FrameProps = MarkProps & {
  icon: string
  /** The centre of the drawing's bounds, measured, so it can sit at the circle's centre. */
  centre?: [number, number]
  hover: Record<string, number>
  children: ReactNode
}

function MarkFrame({
  icon,
  centre = [80, 80],
  hover,
  read = false,
  drawOnView = false,
  className = '',
  style,
  children,
}: FrameProps) {
  const reduce = useReducedMotion()
  const [scope, animate] = useAnimate<SVGSVGElement>()
  const wasRead = useRef(read)

  // The settle: when the chapter becomes read, the solid eases up from slightly smaller.
  useEffect(() => {
    const becameRead = read && !wasRead.current
    wasRead.current = read
    if (!becameRead || reduce || !scope.current) return
    animate('.fm-solid', { scale: [0.92, 1] }, { ...bloom, delay: 0.1 })
    // A chapter read before its outline finished tracing completes it as the colour arrives.
    animate(LINES, { pathLength: 1 }, { duration: 0.25 })
  }, [read, reduce, animate, scope])

  // The trace: hide the outline, then draw it in, shape by shape, once the mark is well in view.
  useEffect(() => {
    const svg = scope.current
    if (!drawOnView || read || reduce || !svg) return
    const lines = svg.querySelectorAll<SVGGeometryElement>(LINES)
    animate(lines, { pathLength: 0 }, still)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        io.disconnect()
        animate(
          lines,
          { pathLength: [0, 1] },
          { duration: 1, ease: [0.22, 0.68, 0.2, 1], delay: stagger(0.08) },
        )
      },
      { threshold: 0.6 },
    )
    io.observe(svg)
    return () => io.disconnect()
    // Only on arrival: a chapter read while the page is open keeps its outline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg
      ref={scope}
      data-icon={icon}
      viewBox="0 0 160 160"
      aria-hidden="true"
      focusable="false"
      className={`foundation-mark ${className}`}
      style={style}
    >
      <circle className="fm-disc" cx="80" cy="80" r="77" />
      <motion.circle
        className="fm-bloom"
        cx="80"
        cy="80"
        initial={false}
        animate={{ r: read ? 77 : 0 }}
        transition={reduce ? still : bloom}
      />
      <motion.g className="fm-hover" variants={reduce ? undefined : hoverVariants(hover)}>
        <g transform={`translate(80 80) scale(${SCALE}) translate(${-centre[0]} ${-centre[1]})`}>
          <g className="fm-line">{children}</g>
          <g className="fm-solid">{children}</g>
        </g>
      </motion.g>
    </svg>
  )
}

/** Who we are: three people, one in front. */
export function WhatWeDoMark(props: MarkProps) {
  return (
    <MarkFrame icon="users" centre={[80, 77]} hover={{ y: -2 }} {...props}>
      <circle cx="47" cy="66" r="11" />
      <path d="M26 112V104C26 92 35 85 47 85C59 85 68 92 68 104V112Z" />
      <circle cx="113" cy="66" r="11" />
      <path d="M92 112V104C92 92 101 85 113 85C125 85 134 92 134 104V112Z" />
      <circle className="fm-knock" cx="80" cy="57" r="15" />
      <path className="fm-knock" d="M54 112V101C54 87 65 79 80 79C95 79 106 87 106 101V112Z" />
    </MarkFrame>
  )
}

/** Why design matters: a selection frame with handles around a layout. */
export function WhyWeDoItMark(props: MarkProps) {
  return (
    <MarkFrame icon="interface" hover={{ scale: 1.04 }} {...props}>
      <rect className="fm-stroke" x="40" y="48" width="80" height="64" />
      <rect className="fm-accent" x="53" y="62" width="19" height="36" rx="2" />
      <path className="fm-stroke fm-bar" d="M84 73H106 M84 87H106" />
      <rect x="35" y="43" width="10" height="10" rx="1.5" />
      <rect x="115" y="43" width="10" height="10" rx="1.5" />
      <rect x="35" y="107" width="10" height="10" rx="1.5" />
      <rect x="115" y="107" width="10" height="10" rx="1.5" />
    </MarkFrame>
  )
}

/** Head, heart and hands: the heart. */
export function HeadHeartHandsMark(props: MarkProps) {
  return (
    <MarkFrame icon="heart" centre={[80, 78]} hover={{ scale: 1.035 }} {...props}>
      <path d="M80 120C66 110 31 88 31 61C31 46 42 36 56 36C66 36 74 42 80 51C86 42 94 36 104 36C118 36 129 46 129 61C129 88 94 110 80 120Z" />
    </MarkFrame>
  )
}

/**
 * How we think: "Aa" in Inter Bold (SIL Open Font License), traced to paths so the page loads no
 * font. The A's legs and crossbar are merged into one outline, so it strokes cleanly.
 */
export function OurDifferenceMark(props: MarkProps) {
  return (
    <MarkFrame icon="type" hover={{ y: -2 }} {...props}>
      <path
        fillRule="evenodd"
        d="M27.1 110.5L48.3 48.5H65L86.7 110.5H72.6L67.8 96.1H45.8L41.2 110.5Z M48.9 86.2L50.7 80.6Q52.4 75 54.2 68Q55.5 62.5 56.5 54.5Q57.5 62.5 59 68Q60.8 74.8 62.6 80.6L64.5 86.2Z"
      />
      <path
        fillRule="evenodd"
        d="M107 111.5Q102.6 111.5 99.1 109.9Q95.6 108.3 93.6 105.2Q91.5 102.1 91.5 97.5Q91.5 93.6 93 91Q94.4 88.4 96.9 86.8Q99.4 85.2 102.5 84.4Q105.7 83.6 109.1 83.2Q113.1 82.8 115.6 82.5Q118.1 82.1 119.2 81.4Q120.4 80.6 120.4 79.1V78.9Q120.4 76.9 119.6 75.5Q118.7 74.1 117.1 73.4Q115.4 72.7 113.1 72.7Q110.7 72.7 108.9 73.4Q107.1 74.1 106 75.3Q104.9 76.5 104.3 78L92.9 76.2Q94.1 72.1 96.9 69.3Q99.7 66.4 103.8 64.9Q107.9 63.4 113.1 63.4Q116.9 63.4 120.4 64.3Q124 65.2 126.8 67.1Q129.6 69 131.2 72Q132.9 75 132.9 79.2V110.5H121V104.1H120.6Q119.5 106.3 117.6 107.9Q115.8 109.5 113.1 110.5Q110.5 111.5 107 111.5Z M110.6 102.7Q113.5 102.7 115.7 101.5Q118 100.3 119.2 98.4Q120.5 96.4 120.5 93.9V88.9Q119.9 89.3 118.8 89.6Q117.7 89.9 116.3 90.2Q114.9 90.4 113.6 90.7Q112.3 90.9 111.2 91Q108.9 91.3 107.2 92.1Q105.4 92.8 104.5 94Q103.5 95.3 103.5 97.2Q103.5 99 104.4 100.2Q105.4 101.4 106.9 102.1Q108.5 102.7 110.6 102.7Z"
      />
    </MarkFrame>
  )
}

/** What we care about: two speech bubbles, one over the other. A conversation. */
export function OurValuesMark(props: MarkProps) {
  return (
    <MarkFrame icon="conversation" centre={[80, 82]} hover={{ y: -2 }} {...props}>
      <path d="M42 40H84Q98 40 98 54V74Q98 88 84 88H56L40 100L42 88Q28 88 28 74V54Q28 40 42 40Z" />
      <path
        className="fm-knock"
        d="M76 64H118Q132 64 132 78V98Q132 112 118 112L120 124L104 112H76Q62 112 62 98V78Q62 64 76 64Z"
      />
    </MarkFrame>
  )
}

/** How we deliver: a service map, three touchpoints feeding two outcomes. */
export function OurMethodsMark(props: MarkProps) {
  return (
    <MarkFrame icon="service" hover={{ scale: 1.025 }} {...props}>
      <path className="fm-stroke" d="M47 56H113 M80 56V76 M60 76H100 M60 76V94 M100 76V94" />
      <circle cx="47" cy="56" r="10" />
      <circle cx="80" cy="56" r="10" />
      <circle cx="113" cy="56" r="10" />
      <rect x="48" y="92" width="24" height="22" rx="5" />
      <rect x="88" y="92" width="24" height="22" rx="5" />
    </MarkFrame>
  )
}
