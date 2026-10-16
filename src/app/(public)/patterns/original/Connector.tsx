// Copied from the-rsd-playbook src/pages/superpower/executions.tsx (the shared parts and S05, the drawn connector).
'use client'

import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ICONS, VB, centre, pct, useIllustration, type IconKey } from './stage'
import './superpower.css'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* Percentage geometry only lines up with the artwork if the box it resolves
   against IS the artwork. Any padding on the stage (headroom for popovers,
   room for a caption) would otherwise stretch every overlay vertically, so
   padding lives on the stage and everything positioned lives in here. */
function Frame({ children }: { children: ReactNode }) {
  return <div className="spw-frame">{children}</div>
}

/* Transparent hit targets. The pencils and bubble strokes are far too thin
   to click, so the artwork stays visual and these take the interaction. */
function Hotspots({
  onEnter, onLeave, onPick, active, labelled = false,
}: {
  onEnter?: (k: IconKey) => void
  onLeave?: () => void
  onPick?: (k: IconKey) => void
  active: IconKey | null
  labelled?: boolean
}) {
  return (
    <>
      {ICONS.map((ic, n) => (
        <button
          key={ic.key}
          className={`spw-hot${active === ic.key ? ' is-active' : ''}`}
          style={pct(ic.box)}
          aria-label={ic.title}
          aria-pressed={active === ic.key}
          onMouseEnter={() => onEnter?.(ic.key)}
          onFocus={() => onEnter?.(ic.key)}
          onMouseLeave={() => onLeave?.()}
          onBlur={() => onLeave?.()}
          // Stopped here: S02 dismisses on a background click, and without
          // this the hotspot's own selection was cancelled by its own bubble.
          onClick={(e) => { e.stopPropagation(); onPick?.(ic.key) }}
        >
          {labelled && <span className="spw-hot__num">{n + 1}</span>}
        </button>
      ))}
    </>
  )
}

function Art({
  mode, active, hover = null,
}: { mode: string; active: IconKey | null; hover?: IconKey | null }) {
  const { hostRef, ready } = useIllustration()
  return (
    <div
      ref={hostRef}
      className={`spw-art${ready ? ' is-ready' : ''}`}
      data-mode={mode}
      data-active={active ?? ''}
      data-hover={hover ?? ''}
      aria-hidden="true"
    />
  )
}

/* ══ S01 · Sidebar dossier ══════════════════════════════════════════════ */

/* ══ S05 · Drawn connector ══════════════════════════════════════════════
   Reusable: the pathway uses the same mechanic with its own copy.        */

export type ConnectorItem = {
  key: IconKey
  colour: string
  title: string
  /** A single line, or one paragraph per sentence. */
  body: string | string[]
}

export function ConnectorPattern({
  items = ICONS,
  className = '',
}: { items?: ConnectorItem[]; className?: string }) {
  const [active, setActive] = useState<IconKey | null>(null)
  const [hover, setHover] = useState<IconKey | null>(null)
  const reduce = useReducedMotion()
  const cur = items.find((i) => i.key === active)
  const def = ICONS.find((i) => i.key === active)
  const c = def ? centre(def.box) : null

  return (
    <div className={`spw-conn ${className}`.trim()}>
      <div className="spw-stage">
        <Frame>
          {/* "subtle" rather than "dim-others": the unselected icons only
              step back a little, so activating one is a nudge not a spotlight. */}
          <Art mode="subtle" active={active} hover={hover} />
          <Hotspots
            active={active}
            onEnter={setHover}
            onLeave={() => setHover(null)}
            onPick={(k) => setActive(k === active ? null : k)}
          />

          <svg
            className="spw-conn__wire"
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <AnimatePresence>
              {cur && def && c && (
                <motion.line
                  key={cur.key}
                  x1={(c.x / 100) * VB.w} y1={def.box.y + def.box.h}
                  x2={(c.x / 100) * VB.w} y2={VB.h}
                  stroke={cur.colour} strokeWidth={2.5} strokeLinecap="round"
                  initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 1 }}
                  animate={reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0.15 : 0.42, ease: EASE }}
                />
              )}
            </AnimatePresence>
          </svg>
        </Frame>
      </div>

      <AnimatePresence initial={false}>
        {cur && (
          <motion.div
            key="strip" className="spw-strip"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.4, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div className="spw-strip__inner" style={{ borderTopColor: cur.colour }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={cur.key}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <h4 className="spw-strip__title">{cur.title}</h4>
                  {(Array.isArray(cur.body) ? cur.body : [cur.body]).map((line) => (
                    <p key={line} className="spw-strip__body">{line}</p>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
