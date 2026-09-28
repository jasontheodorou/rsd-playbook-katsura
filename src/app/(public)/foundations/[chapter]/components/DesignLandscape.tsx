'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState, type CSSProperties } from 'react'

import { createOnce } from '../page/once'
import './design-landscape.css'

/**
 * The Design Landscape (chapter 04, How we think): five layers that shape decision making, each
 * inside the next, from the individual at the centre to the environment around everything. Built
 * on the photo diagram's approved form: one card in two zones, the control on a tinted, ambient
 * side and its result on plain white, meeting in one straight edge. The layers' labels are the
 * only control. The innermost label pulses on first view until a reader chooses a layer, then
 * never again. Every layer's text is in the page; without JavaScript it is a plain list.
 */
export type LandscapeLayer = { id: string; name: string; text: string }

const prompt = createOnce('katsura:landscape-used')
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

export function DesignLandscape({
  title,
  label,
  restTitle,
  restBody,
  layers,
  washes,
}: {
  /** A short instruction at the control zone's top left. */
  title?: string
  /** What the set is, for screen readers. */
  label: string
  /** What the result zone says before a layer is chosen. */
  restTitle: string
  restBody: string
  /** From the outside in: the first layer surrounds all the others. */
  layers: LandscapeLayer[]
  washes?: [string, string]
}) {
  const reduce = useReducedMotion()
  const used = prompt.useUsed()
  const [active, setActive] = useState<number | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  useEffect(() => {
    if (active !== null) prompt.mark()
  }, [active])
  const inner = layers.length - 1
  const lit = hover ?? active

  return (
    <div
      className="dl"
      style={
        washes ? ({ '--wash-a': washes[0], '--wash-b': washes[1] } as CSSProperties) : undefined
      }
    >
      {/* ── The layers ── */}
      <div className="dl__stage">
        <span className="dl__washes" aria-hidden="true">
          <span />
          <span />
        </span>
        {title && <p className="dl__title">{title}</p>}
        <div className="dl__rings" role="group" aria-label={label}>
          {layers.map((l, k) => (
            <motion.div
              key={l.id}
              className="dl__ring"
              style={{ '--k': k } as CSSProperties}
              data-on={active === k}
              data-lit={lit === k}
              data-dim={lit !== null && lit !== k}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 + (inner - k) * 0.08 }}
            >
              <button
                type="button"
                className="dl__label"
                aria-pressed={active === k}
                aria-controls="dl-reading"
                onClick={() => setActive(k)}
                onPointerEnter={() => setHover(k)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(k)}
                onBlur={() => setHover(null)}
              >
                {k === inner && !used && active === null && !reduce && (
                  <span className="dl__pulse" aria-hidden="true" />
                )}
                {l.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── The result: every passage in one cell, the chosen one shown ── */}
      <div className="dl__result">
        <div id="dl-reading" className="dl__passages" aria-live="polite">
          <div className="dl__passage" data-on={active === null} aria-hidden={active !== null}>
            <span className="dl__n">{layers.length} layers</span>
            <p className="dl__lead">{restTitle}</p>
            <p className="dl__body">{restBody}</p>
          </div>
          {layers.map((l, k) => (
            <div
              key={l.id}
              className="dl__passage"
              data-on={active === k}
              aria-hidden={active !== k}
            >
              <span className="dl__n">
                Layer {inner - k + 1} of {layers.length}
              </span>
              <p className="dl__lead">{l.name}</p>
              <p className="dl__body">{l.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
