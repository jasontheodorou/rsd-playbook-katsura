'use client'

import { motion, useAnimate, useInView } from 'motion/react'
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'

import { ART, BRIDGES, INK, OUTLINES, PERSON, POINTERS, type ArtShape, type ZoneId } from './art'
import './landscape.css'

/*
 * The Design Landscape drawn as a map: landscape1.svg with its 33 people in orange. Each of the
 * five zones can be chosen, which brings its name up at the top of its line and the manual's words
 * below. Five treatments share the same drawing, zones and text, so only the life differs.
 */
export type Variant = 'wash' | 'draw' | 'focus' | 'build' | 'ripple'
export type Layer = { id: string; name: string; text: string }

/** Inside out, which is also the order the arrow keys move in. */
const ORDER: ZoneId[] = ['individual', 'service', 'organisation', 'community', 'environment']
const INNER: Record<ZoneId, ZoneId | null> = {
  individual: null,
  service: 'individual',
  organisation: 'service',
  community: 'organisation',
  environment: 'community',
}
/** A zone's own area: its outline less the zone inside it. */
const ring = (z: ZoneId) => {
  const inner = INNER[z]
  return inner ? `${OUTLINES[z]} ${OUTLINES[inner]}` : OUTLINES[z]
}
/** The part of the drawing shown: the table, its lines and room for the names above them. */
const VB = { x: 30, y: 22, w: 896, h: 404 }
const CENTRE = { x: 260, y: 250 }

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const SOFT = { type: 'spring', bounce: 0, duration: 0.6 } as const
const STILL = { duration: 0 } as const
/** A very light blue over the paper (the palette's blue, #619cba, at 12% when chosen), to set off the orange people. */
const WASH = { colour: '#619cba', chosen: 0.12, hover: 0.06, cue: 0.1 }
/** Focus's first-view cue: a soft blue disc and ring rising in turn at three points (in the drawing's units), and their timing. */
const PULSE = {
  at: [
    [260, 250],
    [600, 262],
    [742, 300],
  ],
  gap: 0.35,
  every: 5,
}
/** Focus, in seconds: breaks part, the line rises through them, and on leaving it sinks back. */
const LINE = { part: 0.3, grow: 0.25, retract: 0.45 }
/** The ripple travels at an even speed, in drawing units a second, so people rise as it reaches them. */
const RIPPLE = { reach: 620, speed: 420 }

const QUERY = '(prefers-reduced-motion: reduce)'
const subscribe = (fn: () => void) => {
  const m = window.matchMedia(QUERY)
  m.addEventListener('change', fn)
  return () => m.removeEventListener('change', fn)
}
/** Reduced motion, read after hydration so the server's HTML and the first client render match. */
const useReduced = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )

/** False on the server and in the first render, true once the page is live in the browser. */
const noop = () => () => {}
const useLive = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )

const dist = (s: ArtShape, x: number, y: number) =>
  Math.hypot(s.box[0] + s.box[2] / 2 - x, s.box[1] + s.box[3] / 2 - y)

/** Whether a shape stays in full ink when a zone is in focus: its contents and both its edges. */
const inFocus = (s: ArtShape, z: ZoneId) =>
  s.zone === z || (s.kind === 'contour' && s.zone === INNER[z])

/** When each shape arrives as the landscape builds: edges from the centre out, then the rest. */
const buildDelay = (s: ArtShape) => {
  const d = dist(s, CENTRE.x, CENTRE.y) / 700
  if (s.kind === 'contour') return ORDER.indexOf(s.zone) * 0.14
  if (s.kind === 'building') return 0.75 + d * 0.5
  if (s.kind === 'detail') return 1.05 + d * 0.5
  return 1.3 + d * 0.7
}

export function Landscape({
  variant,
  fit = 'below',
  label,
  restTitle,
  restBody,
  prompt: promptText,
  layers,
}: {
  variant: Variant
  /** Where the message and text sit: the message above and the box below the drawing, the
      message in the drawing's empty top-left corner, or the box in that corner as the map's key. */
  fit?: 'below' | 'corner' | 'legend'
  /** What the set of zones is, for screen readers. */
  label: string
  /** What the text says before a zone is chosen. */
  restTitle: string
  restBody: string
  /** What to do, at the top of the drawing until a zone is chosen. */
  prompt: string
  layers: Layer[]
}) {
  const reduce = useReduced()
  // Until the reader first chooses a region on this visit, the message shows and the pulses play
  // on every page load. After that the message is gone and the pulses stop, even if the region is
  // let go again.
  const [touched, setTouched] = useState(false)
  const uid = useId().replace(/:/g, '')
  const [chosen, setChosen] = useState<ZoneId | null>(null)
  const [hover, setHover] = useState<ZoneId | null>(null)
  const [ripple, setRipple] = useState<{ x: number; y: number; n: number } | null>(null)
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const svgRef = useRef<SVGSVGElement>(null)
  const hits = useRef(new Map<ZoneId, SVGPathElement>())
  const inView = useInView(scope, { once: true, amount: 0.4 })

  // Build: drawn in full by the server, hidden once the page is live, then assembled in view.
  const live = useLive()
  const building = variant === 'build' && !reduce && live
  const phase: 'static' | 'armed' | 'play' = !building ? 'static' : inView ? 'play' : 'armed'
  const built = phase !== 'armed'
  const buildDone = phase === 'static'
  // The cue waits for the landscape to finish building.
  const [buildOver, setBuildOver] = useState(false)
  useEffect(() => {
    if (phase !== 'play') return
    const t = setTimeout(() => setBuildOver(true), 2300)
    return () => clearTimeout(t)
  }, [phase])
  const cueReady = phase === 'static' || buildOver
  const cue = !touched && inView && cueReady && chosen === null
  // The wash sweep of the other options still waits while the pointer is over the map.
  const sweep = cue && hover === null
  // Focus: three soft pulses in turn, in three zones, repeated every few seconds until used.
  const [round, setRound] = useState(0)
  useEffect(() => {
    if (!cue || reduce || variant !== 'focus') return
    const t = setInterval(() => setRound((r) => r + 1), PULSE.every * 1000)
    return () => clearInterval(t)
  }, [cue, reduce, variant])

  const choose = (z: ZoneId, at?: { x: number; y: number }) => {
    setChosen(z)
    setTouched(true)
    if (variant !== 'ripple' || reduce) return
    const o = at ?? { x: CENTRE.x, y: CENTRE.y }
    setRipple((r) => ({ ...o, n: (r?.n ?? 0) + 1 }))
    // The zone's people rise a little as the ripple passes them.
    scope.current
      ?.querySelectorAll<SVGPathElement>(`path[data-zone="${z}"][data-kind="person"]`)
      .forEach((el) => {
        const s = ART[Number(el.dataset.i)]
        animate(
          el,
          { y: [0, -3, 0] },
          { duration: 0.7, ease: 'easeInOut', delay: dist(s, o.x, o.y) / RIPPLE.speed },
        )
      })
  }

  const onClick = (z: ZoneId) => (e: MouseEvent<SVGPathElement>) => {
    // Choosing the chosen zone again lets it go.
    if (chosen === z) return setChosen(null)
    const svg = svgRef.current
    const m = svg?.getScreenCTM()
    if (!svg || !m) return choose(z)
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse())
    choose(z, { x: p.x, y: p.y })
  }

  // A click anywhere outside the zones (the sky above the table, or elsewhere on the page) lets
  // the chosen zone go, back to the opening state. Clicks on the text box keep it.
  useEffect(() => {
    if (chosen === null) return
    const away = (e: PointerEvent) => {
      const t = e.target as Element | null
      if (t?.closest('.lm-hit') || t?.closest('.lm-text')) return
      setChosen(null)
    }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [chosen])

  // Escape lets the chosen region go. It is caught first, so on a chapter page it does not also
  // close the chapter (as the pinned photo's quote does).
  useEffect(() => {
    if (chosen === null) return
    const onEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopImmediatePropagation()
      setChosen(null)
    }
    window.addEventListener('keydown', onEscape, true)
    return () => window.removeEventListener('keydown', onEscape, true)
  }, [chosen])

  const onKey = (z: ZoneId) => (e: KeyboardEvent<SVGPathElement>) => {
    const i = ORDER.indexOf(z)
    const to =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? ORDER[Math.min(i + 1, ORDER.length - 1)]
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? ORDER[Math.max(i - 1, 0)]
          : e.key === 'Home'
            ? ORDER[0]
            : e.key === 'End'
              ? ORDER[ORDER.length - 1]
              : e.key === 'Enter' || e.key === ' '
                ? z
                : null
    if (!to) return
    e.preventDefault()
    choose(to)
    hits.current.get(to)?.focus()
  }

  const washOpacity = (z: ZoneId, i: number) => {
    if (chosen === z) return { opacity: WASH.chosen, transition: SOFT }
    if (hover === z) return { opacity: WASH.hover, transition: { duration: 0.2 } }
    if (sweep && !reduce && !dormant)
      return {
        opacity: [0, WASH.cue, 0],
        transition: { delay: 0.3 + i * 0.16, duration: 1.1, times: [0, 0.4, 1] },
      }
    return { opacity: 0, transition: { duration: 0.3 } }
  }

  const shapeTarget = (s: ArtShape) => {
    if (!built)
      return { opacity: 0, y: s.kind === 'building' ? 6 : 0, scale: s.kind === 'person' ? 0.4 : 1 }
    const faded =
      variant === 'focus' && chosen !== null && s.kind !== 'contour' && !inFocus(s, chosen)
    return { opacity: faded ? 0.2 : 1, y: 0, scale: 1 }
  }
  const shapeTransition = (s: ArtShape) => {
    if (reduce) return STILL
    if (variant === 'build' && !buildDone) {
      if (phase === 'armed') return STILL
      return { duration: 0.6, ease: EASE, delay: buildDelay(s) }
    }
    return { duration: 0.45, ease: EASE }
  }

  // Focus: a zone's edge stays in full ink when it or the zone just outside it is chosen.
  const edgeFaded = (z: ZoneId) =>
    variant === 'focus' && chosen !== null && z !== chosen && z !== INNER[chosen]
  // Focus: the lines lie dormant and the breaks they pass through are closed. Choosing a zone
  // parts its breaks, then its line rises through them; leaving it, the line sinks back and the
  // breaks close behind it.
  const dormant = variant === 'focus'
  const lineOn = (z: ZoneId) => chosen === z || (reduce && variant === 'draw')

  const byId = new Map(layers.map((l) => [l.id, l]))
  const tabZone = chosen ?? 'individual'

  return (
    <div className="lm" data-variant={variant} data-fit={fit} ref={scope}>
      <div className="lm-stage">
        {dormant && fit !== 'legend' && (
          <motion.p
            className="lm-prompt"
            initial={false}
            animate={{ opacity: touched ? 0 : 1 }}
            transition={reduce ? STILL : { duration: 0.3 }}
            aria-hidden={touched}
          >
            {promptText}
          </motion.p>
        )}
        <svg
          ref={svgRef}
          className="lm-svg"
          viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
          role="img"
          aria-label="A hand-drawn map of the Design Landscape: five zones on a table top, from one person at the centre, through a service, an organisation and a community, to the wider environment."
        >
          <defs>
            {chosen && (
              <clipPath id={`${uid}-zone`}>
                <path d={ring(chosen)} clipRule="evenodd" />
              </clipPath>
            )}
            {POINTERS.map((p) => (
              <clipPath key={p.zone} id={`${uid}-line-${p.zone}`}>
                <motion.rect
                  x={0}
                  width={953}
                  initial={false}
                  animate={
                    lineOn(p.zone)
                      ? { y: p.top[1] - 4, height: p.end[1] - p.top[1] + 8 }
                      : { y: p.end[1] + 4, height: 0 }
                  }
                  transition={
                    reduce
                      ? STILL
                      : lineOn(p.zone)
                        ? { duration: 0.8, ease: 'easeInOut', delay: dormant ? LINE.grow : 0 }
                        : dormant
                          ? { duration: LINE.retract, ease: [0.4, 0, 0.9, 0.6] }
                          : { duration: 0, delay: 0.3 }
                  }
                />
              </clipPath>
            ))}
          </defs>

          {/* The chosen or pointed-at zone's wash, under the drawing. */}
          <g aria-hidden="true">
            {ORDER.map((z, i) => (
              <motion.path
                key={z}
                d={ring(z)}
                fill={WASH.colour}
                fillRule="evenodd"
                initial={{ opacity: 0 }}
                animate={washOpacity(z, i)}
              />
            ))}
            {ripple && chosen && (
              <g clipPath={`url(#${uid}-zone)`}>
                <motion.circle
                  key={ripple.n}
                  cx={ripple.x}
                  cy={ripple.y}
                  fill="none"
                  stroke={PERSON}
                  strokeWidth={14}
                  initial={{ r: 0, opacity: 0.3 }}
                  animate={{ r: RIPPLE.reach, opacity: 0 }}
                  transition={{ duration: RIPPLE.reach / RIPPLE.speed, ease: 'linear' }}
                />
              </g>
            )}
          </g>

          {/* The drawing, path for path. The zones' edges come first, each zone's in one group
              with the bridges across its breaks, so a faded edge and its bridges fade as one. */}
          <g aria-hidden="true" className="lm-art">
            {ORDER.map((z) => (
              <motion.g
                key={z}
                initial={false}
                animate={{ opacity: edgeFaded(z) ? 0.2 : 1 }}
                transition={reduce ? STILL : { duration: 0.45, ease: EASE }}
              >
                {ART.map((s, i) =>
                  s.kind === 'contour' && s.zone === z ? (
                    <motion.path
                      key={i}
                      d={s.d}
                      data-i={i}
                      data-zone={s.zone}
                      data-kind={s.kind}
                      fill={INK}
                      initial={false}
                      animate={shapeTarget(s)}
                      transition={shapeTransition(s)}
                    />
                  ) : null,
                )}
                {dormant &&
                  BRIDGES.filter((b) => b.edge === z).map((b, k) => {
                    const open = chosen === b.zone
                    const mid = [(b.a[0] + b.b[0]) / 2, (b.a[1] + b.b[1]) / 2]
                    return [b.a, b.b].map((end, h) => (
                      <motion.path
                        key={`${k}-${h}`}
                        className="lm-bridge"
                        d={`M${end[0]} ${end[1]} L${mid[0]} ${mid[1]}`}
                        fill="none"
                        stroke={INK}
                        strokeWidth={b.w}
                        strokeLinecap="round"
                        initial={false}
                        animate={{ pathLength: open ? 0 : 1, opacity: open ? 0 : 1 }}
                        transition={
                          reduce
                            ? STILL
                            : open
                              ? {
                                  pathLength: { duration: LINE.part, ease: EASE },
                                  opacity: { duration: 0.01, delay: LINE.part },
                                }
                              : {
                                  pathLength: {
                                    duration: LINE.part,
                                    ease: EASE,
                                    delay: LINE.retract,
                                  },
                                  opacity: { duration: 0.01, delay: LINE.retract },
                                }
                        }
                      />
                    ))
                  })}
              </motion.g>
            ))}
            {ART.map((s, i) =>
              s.kind === 'contour' ? null : (
                <motion.path
                  key={i}
                  d={s.d}
                  data-i={i}
                  data-zone={s.zone}
                  data-kind={s.kind}
                  fill={s.kind === 'person' ? PERSON : INK}
                  style={{ originX: 0.5, originY: 1 }}
                  initial={false}
                  animate={shapeTarget(s)}
                  transition={shapeTransition(s)}
                />
              ),
            )}
            {POINTERS.map((p) =>
              variant === 'draw' ? (
                <g key={p.zone}>
                  <motion.path
                    d={p.d}
                    fill={INK}
                    initial={false}
                    animate={{ opacity: reduce ? 1 : 0.16 }}
                  />
                  <motion.path
                    d={p.d}
                    fill={INK}
                    clipPath={`url(#${uid}-line-${p.zone})`}
                    initial={false}
                    animate={{ opacity: chosen === p.zone || reduce ? 1 : 0 }}
                    transition={reduce ? STILL : { duration: 0.3 }}
                  />
                </g>
              ) : dormant ? (
                <path
                  key={p.zone}
                  className="lm-line"
                  d={p.d}
                  fill={INK}
                  clipPath={`url(#${uid}-line-${p.zone})`}
                />
              ) : (
                <motion.path
                  key={p.zone}
                  d={p.d}
                  fill={INK}
                  initial={false}
                  animate={{
                    opacity: built ? 1 : 0,
                  }}
                  transition={
                    variant === 'build' && !buildDone && !reduce
                      ? { duration: 0.6, ease: EASE, delay: phase === 'armed' ? 0 : 1.9 }
                      : { duration: 0.45, ease: EASE }
                  }
                />
              ),
            )}
          </g>

          {/* Focus's cue: three soft rings, one after another, where a reader might choose. */}
          {dormant && cue && !reduce && (
            <g key={round} aria-hidden="true" className="lm-art">
              {PULSE.at.map(([x, y], i) => (
                <g key={i}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    fill={WASH.colour}
                    initial={{ r: 4, opacity: 0 }}
                    animate={{ r: 26, opacity: [0, 0.28, 0] }}
                    transition={{
                      duration: 1.4,
                      delay: 0.4 + i * PULSE.gap,
                      ease: 'easeOut',
                      times: [0, 0.25, 1],
                    }}
                  />
                  <motion.circle
                    cx={x}
                    cy={y}
                    fill="none"
                    stroke={WASH.colour}
                    strokeWidth={3}
                    initial={{ r: 6, opacity: 0 }}
                    animate={{ r: 40, opacity: [0, 0.9, 0] }}
                    transition={{
                      duration: 1.4,
                      delay: 0.4 + i * PULSE.gap,
                      ease: 'easeOut',
                      times: [0, 0.2, 1],
                    }}
                  />
                </g>
              ))}
            </g>
          )}

          {/* The zones, outer first so the inner ones sit on top and take the pointer. */}
          <g role="radiogroup" aria-label={label}>
            {[...ORDER].reverse().map((z) => (
              <path
                key={z}
                ref={(el) => {
                  if (el) hits.current.set(z, el)
                  else hits.current.delete(z)
                }}
                className="lm-hit"
                d={OUTLINES[z]}
                role="radio"
                aria-checked={chosen === z}
                aria-label={byId.get(z)?.name ?? z}
                tabIndex={tabZone === z ? 0 : -1}
                onClick={onClick(z)}
                onKeyDown={onKey(z)}
                onPointerEnter={() => setHover(z)}
                onPointerLeave={() => setHover((h) => (h === z ? null : h))}
              />
            ))}
          </g>
        </svg>

        {/* Each zone's name, just above the top of its line. */}
        <div className="lm-caps" aria-hidden="true">
          {POINTERS.map((p) => {
            const on = chosen === p.zone && !(fit === 'legend' && p.zone === 'individual')
            const delay =
              !on || reduce ? 0 : variant === 'draw' ? 0.65 : dormant ? LINE.grow + 0.6 : 0
            return (
              <motion.span
                key={p.zone}
                className="lm-cap"
                data-zone={p.zone}
                style={{
                  left: `${((p.top[0] - VB.x) / VB.w) * 100}%`,
                  top: `${((p.top[1] - VB.y) / VB.h) * 100}%`,
                }}
                initial={false}
                animate={{ opacity: on ? 1 : 0 }}
                transition={reduce ? STILL : { duration: 0.35, delay }}
              >
                <motion.span
                  className="lm-cap__name"
                  initial={false}
                  animate={{ y: on || reduce ? 0 : 6 }}
                  transition={reduce ? STILL : { ...SOFT, delay }}
                >
                  {byId.get(p.zone)?.name}
                </motion.span>
              </motion.span>
            )
          })}
        </div>
      </div>

      {/* A pale tint box under the drawing. Every state in one grid cell, so its height never changes. */}
      <div className="lm-text" aria-live="polite">
        <div className="lm-entry" data-on={chosen === null}>
          <h3 className="lm-entry__name">{fit === 'legend' ? promptText : restTitle}</h3>
          <p className="lm-entry__body">{restBody}</p>
        </div>
        {ORDER.map((z) => {
          const l = byId.get(z)
          if (!l) return null
          return (
            <div key={z} className="lm-entry" data-on={chosen === z}>
              <h3 className="lm-entry__name">{l.name}</h3>
              <p className="lm-entry__body">{l.text}</p>
            </div>
          )
        })}
      </div>

      <noscript>
        <style>{`.lm-cap{opacity:1!important}.lm-line{clip-path:none!important}.lm-bridge{display:none}.lm-cap__name{transform:none!important}.lm-text{display:block}.lm-entry{visibility:visible;opacity:1}.lm-entry+.lm-entry{margin-top:32px}.lm-prompt{display:none}`}</style>
      </noscript>
    </div>
  )
}
