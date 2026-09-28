'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { isPoster, PIECES, type Piece, type PosterId } from './hhh-pieces'
import './hhh-wall.css'

/**
 * The head, heart and hands sketch as a wall that builds itself ("Pinned as you arrive", chosen
 * from /hhh on 28 September 2026). As it scrolls into view each poster drops onto its pins in
 * turn, then the sticky notes follow; pointing at a poster sets it swinging gently from its pins.
 * The sketch is cut into its pieces (public/illustrations/hhh), which rebuild it exactly. To a
 * screen reader it is one image with one description.
 */
const ORDER: PosterId[] = ['head', 'heart', 'hands']
const ENTRY: Record<PosterId, { x: number; y: number; r: number }> = {
  head: { x: -40, y: -60, r: -14 },
  heart: { x: 0, y: -90, r: 10 },
  hands: { x: 40, y: -60, r: 14 },
}
const src = (id: string) => `/illustrations/hhh/${id}.png`
const place = (p: Piece) => ({ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%` })

export function HhhWall({ alt }: { alt: string }) {
  const reduce = useReducedMotion()
  const [swinging, setSwinging] = useState<PosterId | null>(null)
  return (
    <motion.div
      className="hxw"
      role="img"
      aria-label={alt}
      initial="off"
      whileInView="on"
      viewport={{ once: true, amount: 0.5 }}
      onPointerLeave={() => setSwinging(null)}
    >
      {PIECES.map((p) => {
        const poster = isPoster(p.id)
        const k = poster ? ORDER.indexOf(p.id as PosterId) : 3 + Number(p.id.slice(5)) * 0.35
        const e = poster ? ENTRY[p.id as PosterId] : { x: 0, y: 24, r: 0 }
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
              className="hxw__piece"
              src={src(p.id)}
              alt=""
              aria-hidden="true"
              draggable={false}
              style={place(p)}
              variants={variants}
            />
          )
        const id = p.id as PosterId
        return (
          <motion.span
            key={id}
            className="hxw__piece hxw__poster"
            style={place(p)}
            variants={variants}
            onPointerEnter={() => setSwinging(id)}
          >
            <motion.span
              className="hxw__hang"
              animate={
                swinging === id && !reduce
                  ? {
                      rotate: [0, 2.2, -1.4, 0.8, 0],
                      transition: { duration: 1.4, ease: 'easeOut' },
                    }
                  : { rotate: 0 }
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src(id)} alt="" aria-hidden="true" draggable={false} />
            </motion.span>
          </motion.span>
        )
      })}
    </motion.div>
  )
}
