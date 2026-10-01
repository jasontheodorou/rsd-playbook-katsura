'use client'

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react'
import { useRef, useState, useSyncExternalStore } from 'react'

/*
 * Four ways to show "Data-driven decision-making" (chapter 04, How we think) as data, not prose.
 * Every figure is example data for one made-up service measure, and each chart says so. One hue
 * (the section's pale blue plane, deepened to #2f77a6 for marks) on white, ink for text. Motion
 * happens on choice or scroll only, eases with no bounce, and reduced motion shows the end state.
 */
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
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* ── Example data: one service measure, the share of online applications completed ───────── */
const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
const TODAY = [52, 55, 51, 58, 56, 60, 57, 61, 59, 62, 60, 63]
const BASELINE = Math.round(TODAY.reduce((a, b) => a + b, 0) / TODAY.length)
const AFTER = [61, 64, 66, 69, 71, 73]
const AFTER_MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

/* ── Chart frame: a 600 by 300 drawing, the y axis 40% to 80% ───────────────────────────── */
const W = 600
const H = 300
const PAD = { l: 44, r: 20, t: 20, b: 36 }
const Y0 = 40
const Y1 = 80
const y = (v: number) => PAD.t + ((Y1 - v) / (Y1 - Y0)) * (H - PAD.t - PAD.b)
const xAt = (i: number, n: number) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r)
const line = (vals: number[], x: (i: number) => number) =>
  vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')

function Axes({
  months,
  every = 1,
  ticks = [40, 60, 80],
  at = y,
  ax = (i: number) => xAt(i, months.length),
}: {
  months: string[]
  every?: number
  ticks?: number[]
  at?: (v: number) => number
  ax?: (i: number) => number
}) {
  return (
    <g className="dd-axes" aria-hidden="true">
      {ticks.map((v) => (
        <g key={v}>
          <line x1={PAD.l} x2={W - PAD.r} y1={at(v)} y2={at(v)} />
          <text x={PAD.l - 10} y={at(v)} dy="0.35em" textAnchor="end">
            {v}%
          </text>
        </g>
      ))}
      {months.map((m, i) =>
        i % every === 0 ? (
          <text key={m + i} x={ax(i)} y={H - 10} textAnchor="middle">
            {m}
          </text>
        ) : null,
      )}
    </g>
  )
}

/** Bars start at zero, so their lengths stay honest, and sit clear of the axis labels. */
const yb = (v: number) => PAD.t + ((80 - v) / 80) * (H - PAD.t - PAD.b)
const BW = 26
const xb = (i: number) => PAD.l + 12 + BW / 2 + (i / 11) * (W - PAD.l - PAD.r - 12 - BW)

/* ── 1. One chart in three steps ────────────────────────────────────────────────────────── */
const STEPS = [
  {
    id: 'analytics',
    name: 'Data analytics',
    say: 'Start with the client’s own data: every month’s result, as it is.',
  },
  {
    id: 'baseline',
    name: 'Performance metrics and baselines',
    say: `Draw the baseline. Today the service completes ${BASELINE}% of applications, so that is what change is measured against.`,
  },
  {
    id: 'future',
    name: 'Future analysis sketches',
    say: 'Sketch where the service could go, as a range, so the plan can be tested against it.',
  },
] as const

export function ThreeSteps() {
  const reduce = useReduced()
  const [step, setStep] = useState(0)
  const t = reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }
  // The sketch runs six months past March, from the last result towards 72%.
  const n = TODAY.length + 6
  const fx = (i: number) => xAt(i, n)
  const proj = [63, 65, 67, 69, 70, 71, 72]
  const band = proj.map((v, i) => [v - i * 0.9, v + i * 0.9])
  const bandPath =
    band.map(([, hi], i) => `${i ? 'L' : 'M'}${fx(11 + i)} ${y(hi)}`).join(' ') +
    band
      .slice()
      .reverse()
      .map(([lo], i) => `L${fx(17 - i)} ${y(lo)}`)
      .join(' ') +
    'Z'
  return (
    <div className="dd-card">
      <div className="dd-card__control" role="radiogroup" aria-label="Understanding data includes">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={step === i}
            className="dd-step"
            onClick={() => setStep(i)}
          >
            <span className="dd-step__n">{i + 1}</span>
            {s.name}
          </button>
        ))}
      </div>
      <div className="dd-card__result">
        <svg viewBox={`0 0 ${W} ${H}`} className="dd-svg" role="img" aria-label={STEPS[step].say}>
          <Axes months={[...MONTHS, ...AFTER_MONTHS]} every={2} />
          <motion.path
            d={bandPath}
            className="dd-band"
            initial={false}
            animate={{ opacity: step >= 2 ? 1 : 0 }}
            transition={t}
          />
          <motion.path
            d={line(proj, (i) => fx(11 + i))}
            className="dd-proj"
            initial={false}
            animate={{ pathLength: step >= 2 ? 1 : 0, opacity: step >= 2 ? 1 : 0 }}
            transition={t}
          />
          <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={t}>
            <line x1={PAD.l} x2={fx(11)} y1={y(BASELINE)} y2={y(BASELINE)} className="dd-base" />
            <text x={PAD.l + 8} y={y(BASELINE) - 10} className="dd-label">
              Baseline {BASELINE}%
            </text>
          </motion.g>
          <motion.path
            d={line(TODAY, fx)}
            className="dd-line"
            initial={false}
            animate={{ pathLength: step >= 1 ? 1 : 0, opacity: step >= 1 ? 1 : 0 }}
            transition={t}
          />
          {TODAY.map((v, i) => (
            <circle key={i} cx={fx(i)} cy={y(v)} r={5} className="dd-dot">
              <title>{`${MONTHS[i]}: ${v}%`}</title>
            </circle>
          ))}
          <motion.text
            x={fx(17)}
            y={y(72) - 14}
            textAnchor="end"
            className="dd-label"
            initial={false}
            animate={{ opacity: step >= 2 ? 1 : 0 }}
            transition={t}
          >
            Sketch: up to 72%
          </motion.text>
        </svg>
        <div className="dd-says">
          {STEPS.map((s, i) => (
            <p key={s.id} data-on={step === i}>
              {s.say}
            </p>
          ))}
        </div>
        <p className="dd-note">Example data</p>
      </div>
    </div>
  )
}

/* ── 2. Same data, two ways ─────────────────────────────────────────────────────────────── */
export function TwoWays() {
  const reduce = useReduced()
  const [chart, setChart] = useState(false)
  const t = reduce ? { duration: 0 } : { duration: 0.45, ease: EASE }
  return (
    <div className="dd-card">
      <div className="dd-card__control" role="radiogroup" aria-label="Show the data as">
        {['As a table', 'As a chart'].map((label, i) => (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={chart === (i === 1)}
            className="dd-step"
            onClick={() => setChart(i === 1)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="dd-card__result">
        <div className="dd-cell">
          <AnimatePresence initial={false}>
            {chart ? (
              <motion.svg
                key="chart"
                viewBox={`0 0 ${W} ${H}`}
                className="dd-svg"
                role="img"
                aria-label="Completed applications by month, rising from 52% in April to 63% in March."
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={t}
              >
                <Axes months={MONTHS} ticks={[0, 40, 80]} at={yb} ax={xb} />
                {TODAY.map((v, i) => (
                  <motion.rect
                    key={i}
                    x={xb(i) - BW / 2}
                    width={BW}
                    y={yb(v)}
                    height={yb(0) - yb(v)}
                    rx={4}
                    className="dd-bar"
                    style={{ originY: 1 }}
                    initial={{ scaleY: reduce ? 1 : 0 }}
                    animate={{ scaleY: 1 }}
                    transition={
                      reduce ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: i * 0.04 }
                    }
                  >
                    <title>{`${MONTHS[i]}: ${v}%`}</title>
                  </motion.rect>
                ))}
                <text x={xb(11)} y={yb(63) - 12} textAnchor="middle" className="dd-label">
                  63%
                </text>
                <text x={xb(0)} y={yb(52) - 12} textAnchor="middle" className="dd-label">
                  52%
                </text>
              </motion.svg>
            ) : (
              <motion.table
                key="table"
                className="dd-table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={t}
              >
                <caption>Applications completed online, by month</caption>
                <thead>
                  <tr>
                    <th scope="col">Month</th>
                    <th scope="col">Started</th>
                    <th scope="col">Completed</th>
                    <th scope="col">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {TODAY.map((v, i) => {
                    const started = 4200 + ((i * 373) % 900)
                    return (
                      <tr key={i}>
                        <th scope="row">{MONTHS[i]}</th>
                        <td>{started.toLocaleString('en-GB')}</td>
                        <td>{Math.round((started * v) / 100).toLocaleString('en-GB')}</td>
                        <td>{v}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </motion.table>
            )}
          </AnimatePresence>
        </div>
        <div className="dd-says">
          <p data-on={!chart}>Twelve months of figures. The story is in there, somewhere.</p>
          <p data-on={chart}>
            The same figures as a chart: completion has climbed 11 points in a year.
          </p>
        </div>
        <p className="dd-note">Example data</p>
      </div>
    </div>
  )
}

/* ── 3. Measure from the start ──────────────────────────────────────────────────────────── */
export function FromTheStart() {
  const reduce = useReduced()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const n = TODAY.length + AFTER.length
  const fx = (i: number) => xAt(i, n)
  // The baseline is drawn first; each later month's result then arrives above it as you scroll.
  const baseLen = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const shown = useTransform(scrollYProgress, [0.25, 0.9], [0, AFTER.length])
  const [count, setCount] = useState(0)
  useMotionValueEvent(shown, 'change', (v) => setCount(Math.floor(v + 0.001)))
  const k = reduce ? AFTER.length : count
  const last = k > 0 ? AFTER[k - 1] : null
  return (
    <div className="dd-solo" ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="dd-svg"
        role="img"
        aria-label={`Against a baseline of ${BASELINE}%, completion rose to ${AFTER[AFTER.length - 1]}% in the six months after the change.`}
      >
        <Axes months={[...MONTHS, ...AFTER_MONTHS]} every={2} />
        <line x1={fx(11.5)} x2={fx(11.5)} y1={PAD.t} y2={H - PAD.b} className="dd-change" />
        <text x={fx(11.5) + 8} y={PAD.t + 12} className="dd-label dd-label--muted">
          Change goes live
        </text>
        <motion.line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={y(BASELINE)}
          y2={y(BASELINE)}
          className="dd-base"
          style={{ pathLength: reduce ? 1 : baseLen }}
        />
        <text x={W - PAD.r} y={y(BASELINE) + 22} textAnchor="end" className="dd-label">
          Baseline {BASELINE}%<tspan className="dd-wide">, set before anything changed</tspan>
        </text>
        {TODAY.map((v, i) => (
          <circle key={i} cx={fx(i)} cy={y(v)} r={4} className="dd-dot dd-dot--quiet">
            <title>{`${MONTHS[i]}: ${v}%`}</title>
          </circle>
        ))}
        {AFTER.map((v, i) => (
          <motion.g
            key={i}
            initial={false}
            animate={{ opacity: i < k ? 1 : 0, y: i < k || reduce ? 0 : 8 }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
          >
            <line
              x1={fx(12 + i)}
              x2={fx(12 + i)}
              y1={y(BASELINE)}
              y2={y(v) + 6}
              className="dd-lift"
            />
            <circle cx={fx(12 + i)} cy={y(v)} r={6} className="dd-dot">
              <title>{`${AFTER_MONTHS[i]}: ${v}%`}</title>
            </circle>
          </motion.g>
        ))}
      </svg>
      <p className="dd-headline" aria-live="polite">
        {last === null ? (
          <>Scroll to see the months after the change.</>
        ) : (
          <>
            <strong>+{last - BASELINE} points</strong> against the baseline by {AFTER_MONTHS[k - 1]}
          </>
        )}
      </p>
      <p className="dd-note">Example data</p>
    </div>
  )
}
