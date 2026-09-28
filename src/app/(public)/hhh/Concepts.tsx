'use client'

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useState, type PointerEvent } from 'react'

import {
  isPoster,
  PIECES,
  POSTERS,
  type Piece,
  type PosterId,
} from '../foundations/[chapter]/components/hhh-pieces'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const src = (id: string) => `/illustrations/hhh/${id}.png`
const place = (p: Piece) => ({ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%` })
const posterOf = (id: PosterId) => POSTERS.find((p) => p.id === id)!

/** The line under a stage: the chosen poster's definition, or a prompt. */
function Caption({ active, prompt }: { active: PosterId | null; prompt: string }) {
  const p = active ? posterOf(active) : null
  return (
    <div className="hx-caption" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={p?.id ?? 'prompt'}
          className={p ? 'hx-caption__line' : 'hx-caption__prompt'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {p ? (
            <>
              <span className="hx-caption__name">{p.name}</span> {p.line}
            </>
          ) : (
            prompt
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

/* ── 1. Lift and read: pointing at a poster lifts and straightens it; the others step back ── */

const STRAIGHTEN: Record<PosterId, number> = { head: 3, heart: -2, hands: 2.5 }

export function LiftAndRead() {
  const [active, setActive] = useState<PosterId | null>(null)
  const reduce = useReducedMotion()
  return (
    <div>
      <div className="hx-stage" onPointerLeave={() => setActive(null)}>
        {PIECES.map((p) => {
          if (!isPoster(p.id)) {
            const near = active && posterOf(active).notes.includes(p.id)
            return (
              <motion.img
                key={p.id}
                className="hx-piece"
                src={src(p.id)}
                alt=""
                style={place(p)}
                animate={{
                  opacity: active && !near ? 0.35 : 1,
                  y: near && !reduce ? -6 : 0,
                  rotate: near && !reduce ? -2 : 0,
                }}
                transition={{ duration: 0.45, ease: EASE }}
              />
            )
          }
          const id = p.id
          const on = active === id
          return (
            <motion.button
              key={id}
              type="button"
              className="hx-piece hx-poster"
              style={{ ...place(p), zIndex: on ? 3 : 2 }}
              aria-label={posterOf(id).line}
              aria-pressed={on}
              onPointerEnter={() => setActive(id)}
              onFocus={() => setActive(id)}
              onClick={() => setActive(id)}
              animate={
                reduce
                  ? { opacity: active && !on ? 0.4 : 1 }
                  : {
                      opacity: active && !on ? 0.4 : 1,
                      scale: on ? 1.06 : active ? 0.97 : 1,
                      rotate: on ? STRAIGHTEN[id] : 0,
                      y: on ? -10 : 0,
                    }
              }
              transition={{ duration: 0.5, ease: EASE }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src(id)} alt="" draggable={false} />
              <motion.span
                className="hx-poster__shadow"
                aria-hidden="true"
                animate={{ opacity: on ? 1 : 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </motion.button>
          )
        })}
      </div>
      <Caption active={active} prompt="Point at a poster." />
    </div>
  )
}

/* ── 2. Flip: choosing a poster turns it over to show its definition on the back ── */

export function Flip() {
  const [flipped, setFlipped] = useState<PosterId | null>(null)
  const reduce = useReducedMotion()
  return (
    <div>
      <div className="hx-stage hx-stage--flip">
        {PIECES.map((p) => {
          if (!isPoster(p.id))
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.id} className="hx-piece" src={src(p.id)} alt="" style={place(p)} />
            )
          const id = p.id
          const on = flipped === id
          const poster = posterOf(id)
          return (
            <button
              key={id}
              type="button"
              className="hx-piece hx-flip"
              style={place(p)}
              aria-pressed={on}
              aria-label={
                on ? `${poster.name}: ${poster.line} Turn back.` : `Turn over ${poster.name}`
              }
              onClick={() => setFlipped(on ? null : id)}
            >
              <motion.span
                className="hx-flip__inner"
                animate={reduce ? undefined : { rotateY: on ? 180 : 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="hx-flip__front"
                  src={src(id)}
                  alt=""
                  draggable={false}
                  style={reduce && on ? { opacity: 0 } : undefined}
                />
                <span
                  className={`hx-flip__back hx-flip__back--${id}`}
                  style={reduce ? { transform: 'none', opacity: on ? 1 : 0 } : undefined}
                >
                  <span className="hx-flip__name">{poster.name}</span>
                  <span className="hx-flip__line">{poster.line}</span>
                </span>
              </motion.span>
            </button>
          )
        })}
      </div>
      <Caption
        active={null}
        prompt="Choose a poster to turn it over. Choose it again to turn it back."
      />
    </div>
  )
}

/* ── 3. Pinned as you arrive: the wall builds itself as it scrolls into view, then each poster
       swings gently from its pins when pointed at ── */

const ENTRY: Record<string, { x: number; y: number; r: number }> = {
  head: { x: -40, y: -60, r: -14 },
  heart: { x: 0, y: -90, r: 10 },
  hands: { x: 40, y: -60, r: 14 },
}

export function PinnedOnArrival() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState<PosterId | null>(null)
  const [run, setRun] = useState(0)
  const order = ['head', 'heart', 'hands']
  return (
    <div>
      <motion.div
        key={run}
        className="hx-stage"
        initial="off"
        whileInView="on"
        viewport={{ once: true, amount: 0.5 }}
        onPointerLeave={() => setActive(null)}
      >
        {PIECES.map((p) => {
          const poster = isPoster(p.id)
          const k = poster ? order.indexOf(p.id) : 3 + Number(p.id.slice(5)) * 0.35
          const e = ENTRY[p.id] ?? { x: 0, y: 24, r: 0 }
          const variants = {
            off: reduce
              ? { opacity: 0 }
              : { opacity: 0, x: e.x, y: e.y, rotate: e.r, scale: poster ? 1.08 : 0.9 },
            on: {
              opacity: 1,
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              transition: reduce
                ? { duration: 0.3, delay: k * 0.08 }
                : { type: 'spring' as const, stiffness: 140, damping: 18, delay: 0.15 + k * 0.22 },
            },
          }
          if (!poster)
            return (
              <motion.img
                key={p.id}
                className="hx-piece"
                src={src(p.id)}
                alt=""
                style={place(p)}
                variants={variants}
              />
            )
          const id = p.id as PosterId
          return (
            <motion.button
              key={id}
              type="button"
              className="hx-piece hx-poster hx-poster--hang"
              style={place(p)}
              aria-label={posterOf(id).line}
              aria-pressed={active === id}
              variants={variants}
              onPointerEnter={() => setActive(id)}
              onFocus={() => setActive(id)}
              onClick={() => setActive(id)}
            >
              <motion.span
                className="hx-hang"
                animate={
                  active === id && !reduce
                    ? {
                        rotate: [0, 2.2, -1.4, 0.8, 0],
                        transition: { duration: 1.4, ease: 'easeOut' },
                      }
                    : { rotate: 0 }
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src(id)} alt="" draggable={false} />
              </motion.span>
            </motion.button>
          )
        })}
      </motion.div>
      <Caption active={active} prompt="Point at a poster to set it swinging." />
      <button type="button" className="hx-replay" onClick={() => setRun((r) => r + 1)}>
        Build the wall again
      </button>
    </div>
  )
}

/* ── 4. Depth and colour: the pieces float at different depths with the pointer, and the poster
       nearest it keeps its colour while the others fade to pencil ── */

const DEPTH: Record<string, number> = { head: 10, heart: 8, hands: 10 }

function Floating({
  p,
  mx,
  my,
  lit,
}: {
  p: Piece
  mx: MotionValue<number>
  my: MotionValue<number>
  lit: boolean | null
}) {
  const d = DEPTH[p.id] ?? 22
  const x = useTransform(mx, (v) => v * d)
  const y = useTransform(my, (v) => v * d)
  const poster = isPoster(p.id)
  return (
    <motion.img
      className="hx-piece"
      src={src(p.id)}
      alt=""
      style={{ ...place(p), x, y, zIndex: poster ? 2 : 1 }}
      animate={{
        filter: lit === false ? 'grayscale(1) contrast(0.9)' : 'grayscale(0) contrast(1)',
        opacity: lit === false ? 0.55 : 1,
        scale: lit ? 1.04 : 1,
      }}
      transition={{ duration: 0.5, ease: EASE }}
    />
  )
}

export function DepthAndColour() {
  const reduce = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const mx = useSpring(rx, { stiffness: 80, damping: 20 })
  const my = useSpring(ry, { stiffness: 80, damping: 20 })
  const [near, setNear] = useState<PosterId | null>(null)
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    if (!reduce) {
      rx.set(px - 0.5)
      ry.set(py - 0.5)
    }
    // The poster whose centre is nearest the pointer.
    let best: PosterId | null = null
    let bd = Infinity
    for (const p of PIECES)
      if (isPoster(p.id)) {
        const cx = (p.x + p.w / 2) / 100
        const d = Math.abs(cx - px)
        if (d < bd) {
          bd = d
          best = p.id
        }
      }
    setNear(best)
  }
  const litFor = (p: Piece): boolean | null => {
    if (!near) return null
    if (isPoster(p.id)) return p.id === near
    return posterOf(near).notes.includes(p.id) ? true : false
  }
  return (
    <div>
      <div
        className="hx-stage hx-stage--depth"
        onPointerMove={onMove}
        onPointerLeave={() => {
          rx.set(0)
          ry.set(0)
          setNear(null)
        }}
      >
        {PIECES.map((p) => (
          <Floating key={p.id} p={p} mx={mx} my={my} lit={litFor(p)} />
        ))}
      </div>
      <Caption active={near} prompt="Move across the wall." />
      <div className="hx-keys" role="group" aria-label="Choose a part">
        {POSTERS.map((p) => (
          <button
            key={p.id}
            type="button"
            className="hx-key"
            aria-pressed={near === p.id}
            onClick={() => setNear(near === p.id ? null : p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  )
}
