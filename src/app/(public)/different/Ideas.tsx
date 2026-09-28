'use client'

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from 'react'

/*
 * Twenty sketches of image, text and interactive ideas for chapters 04 to 06, each using real
 * content from those pages. They are proofs of idea, not finished components.
 */
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const PH = {
  wall: '/photos/wall-of-quotes.jpg',
  focus: '/photos/focused-work.jpg',
  hands: '/photos/audience-hands.jpg',
  lego: '/photos/participation-people.png',
  pitch: '/photos/pitching-idea.jpg',
  team: '/photos/team-meeting.png',
  flip: '/photos/head-flipchart.jpg',
  build: '/photos/lego-trees.png',
}

/* ── Images ─────────────────────────────────────────────────────────────────────────────── */

/** 1. Polaroid scatter: prints pinned at angles; pointing at one straightens and lifts it. */
export function PolaroidScatter() {
  const prints = [
    { src: PH.wall, r: -6, x: 0, cap: 'Insight wall' },
    { src: PH.pitch, r: 4, x: 30, cap: 'Show and tell' },
    { src: PH.hands, r: -2, x: 60, cap: 'Everyone in the room' },
  ]
  return (
    <div className="d-polaroids">
      {prints.map((p, i) => (
        <motion.figure
          key={p.src}
          className="d-polaroid"
          style={{ left: `${p.x}%`, zIndex: i }}
          initial={{ rotate: p.r }}
          whileHover={{ rotate: 0, y: -12, scale: 1.04, zIndex: 9 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.src} alt="" />
          <figcaption>{p.cap}</figcaption>
        </motion.figure>
      ))}
    </div>
  )
}

/** 2. Sketch to real: drag the divider between a pencil version of a photo and the photo. */
export function SketchToReal() {
  const [x, setX] = useState(50)
  return (
    <div className="d-compare">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="d-compare__img d-compare__sketch" src={PH.build} alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="d-compare__img"
        src={PH.build}
        alt="Hands placing a Lego figure on a model."
        style={{ clipPath: `inset(0 0 0 ${x}%)` }}
      />
      <span className="d-compare__line" style={{ left: `${x}%` }} aria-hidden="true" />
      <span className="d-compare__tag d-compare__tag--l">Prototype</span>
      <span className="d-compare__tag d-compare__tag--r">Pilot</span>
      <input
        className="d-compare__range"
        type="range"
        min={0}
        max={100}
        value={x}
        onChange={(e) => setX(+e.target.value)}
        aria-label="Compare the prototype and the pilot"
      />
    </div>
  )
}

/** 3. Zoom in, zoom out: the photo moves from the human detail to the big picture on scroll. */
export function ZoomInOut() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0.1, 0.9], [2.2, 1])
  const label = useTransform(scrollYProgress, (v) =>
    v < 0.5 ? 'Zoom in: the human detail' : 'Zoom out: the big picture',
  )
  const [text, setText] = useState('Zoom in: the human detail')
  useEffect(() => label.on('change', setText), [label])
  return (
    <div ref={ref} className="d-zoom">
      <motion.img
        src={PH.hands}
        alt=""
        style={reduce ? undefined : { scale, originX: 0.62, originY: 0.35 }}
      />
      <span className="d-zoom__label">{text}</span>
    </div>
  )
}

/** 4. Filmstrip: a horizontal strip of photos that snaps, like contact prints. */
export function Filmstrip() {
  const shots = [PH.team, PH.lego, PH.pitch, PH.build, PH.wall, PH.focus]
  return (
    <div className="d-strip" tabIndex={0} aria-label="Photos from our work, scroll sideways">
      {shots.map((s, i) => (
        <figure key={s} className="d-strip__frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s} alt="" />
          <span>{String(i + 1).padStart(2, '0')}</span>
        </figure>
      ))}
    </div>
  )
}

/** 5. Duotone in the part's colour: the photo recoloured in the chapter's own ink. */
export function Duotone() {
  return (
    <div className="d-duo">
      {(['#a94c00', '#c4121f', '#a61448'] as const).map((c, i) => (
        <figure key={c} className="d-duo__f" style={{ '--c': c } as CSSProperties}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={[PH.focus, PH.hands, PH.lego][i]} alt="" />
          <figcaption>{['Head', 'Heart', 'Hands'][i]}</figcaption>
        </figure>
      ))}
    </div>
  )
}

/** 6. Photo in the scribble: a photo seen through the shape of the chapter's scribble. */
export function ScribbleMask() {
  return (
    <div className="d-mask">
      {(['head', 'heart', 'hands'] as const).map((id, i) => (
        <div
          key={id}
          className="d-mask__shape"
          style={{
            WebkitMaskImage: `url(/illustrations/hhh/${id}-scribble.png)`,
            maskImage: `url(/illustrations/hhh/${id}-scribble.png)`,
            backgroundImage: `url(${[PH.flip, PH.hands, PH.build][i]})`,
          }}
          role="img"
          aria-label={`A photo seen through the ${id} scribble`}
        />
      ))}
    </div>
  )
}

/* ── Text ───────────────────────────────────────────────────────────────────────────────── */

/** 7. Big numbers: the page's counts set huge, with a line each. */
export function BigNumbers() {
  const items = [
    { n: '5', t: 'layers in the Design Landscape' },
    { n: '3', t: 'ways we tell stories' },
    { n: '4', t: 'steps from engage to grow' },
  ]
  return (
    <div className="d-nums">
      {items.map((it, i) => (
        <motion.div
          key={it.t}
          className="d-num"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
        >
          <span className="d-num__n">{it.n}</span>
          <span className="d-num__t">{it.t}</span>
        </motion.div>
      ))}
    </div>
  )
}

/** 8. Margin note: a key line lifted into the empty columns beside the text, in handwriting. */
export function MarginNote() {
  return (
    <div className="d-margin">
      <p className="d-body">
        To make decisions about future change, we need to fully and honestly understand where our
        clients are today. We’ll start with our clients’ data and add our own capabilities to enrich
        and analyse the evidence.
      </p>
      <aside className="d-margin__note">
        <svg viewBox="0 0 60 30" aria-hidden="true">
          <path d="M58 4 C 40 2, 20 10, 4 26 M4 26 l 2 -9 M4 26 l 9 -1" />
        </svg>
        Start with their data, not ours.
      </aside>
    </div>
  )
}

/** 9. Hand-drawn circle: a key phrase gets circled in ink as it scrolls into view. */
export function DrawnCircle() {
  const reduce = useReducedMotion()
  return (
    <p className="d-body">
      Understanding how a service will exist in this ecosystem is{' '}
      <span className="d-circled">
        essential
        <svg viewBox="0 0 200 70" preserveAspectRatio="none" aria-hidden="true">
          <motion.path
            d="M10 38 C 10 8, 190 4, 192 34 C 194 64, 20 70, 12 40 C 8 24, 40 14, 70 12"
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
          />
        </svg>
      </span>{' '}
      when designing end-to-end and front-to-back services.
    </p>
  )
}

/** 10. Words that light up: the statement brightens word by word as the reader scrolls. */
export function WordReveal() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'start 35%'] })
  const words =
    'Great design is built on great collaboration. That’s why participatory design is our default.'.split(
      ' ',
    )
  return (
    <p ref={ref} className="d-reveal">
      {words.map((w, i) => (
        <Word key={i} p={scrollYProgress} i={i} n={words.length}>
          {w}
        </Word>
      ))}
    </p>
  )
}
function Word({
  p,
  i,
  n,
  children,
}: {
  p: MotionValue<number>
  i: number
  n: number
  children: ReactNode
}) {
  const o = useTransform(p, [i / n, (i + 1) / n], [0.18, 1])
  return <motion.span style={{ opacity: o }}>{children} </motion.span>
}

/** 11. Question cards: desirability, feasibility and viability as cards that turn over. */
export function QuestionCards() {
  const qs = [
    { k: 'Desirability', q: 'Is it solving a problem or filling a gap for users?' },
    { k: 'Feasibility', q: 'Can it be done?' },
    { k: 'Viability', q: 'Is the size of the prize right?' },
  ]
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="d-qcards">
      {qs.map((q, i) => (
        <button
          key={q.k}
          type="button"
          className="d-qcard"
          aria-pressed={open === i}
          onClick={() => setOpen(open === i ? null : i)}
        >
          <motion.span
            className="d-qcard__in"
            animate={{ rotateY: open === i ? 180 : 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="d-qcard__front">{q.k}?</span>
            <span className="d-qcard__back">{q.q}</span>
          </motion.span>
        </button>
      ))}
    </div>
  )
}

/** 12. Inline definition: a term with a dotted underline opens its meaning in the line. */
export function InlineDefinition() {
  return (
    <div className="d-body">
      Design-driven approaches make services more efficient by eliminating duplication and
      preventing{' '}
      <details className="d-term">
        <summary>failure demand.</summary>
        <span className="d-term__def">
          Demand caused by a failure to do something, or do it right, first time, such as people
          calling back to chase or correct.
        </span>
      </details>
    </div>
  )
}

/* ── Interaction ────────────────────────────────────────────────────────────────────────── */

/** 13. Zoom switch: one toggle moves the same scene between human detail and big picture. */
export function ZoomSwitch() {
  const [out, setOut] = useState(false)
  return (
    <div className="d-zswitch">
      <div className="d-zswitch__view">
        <motion.img
          src={PH.team}
          alt=""
          animate={{ scale: out ? 1 : 2.4 }}
          style={{ originX: 0.55, originY: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </div>
      <div className="d-zswitch__controls" role="group" aria-label="Zoom">
        <button type="button" aria-pressed={!out} onClick={() => setOut(false)}>
          Zoom in
        </button>
        <button type="button" aria-pressed={out} onClick={() => setOut(true)}>
          Zoom out
        </button>
      </div>
      <p className="d-caption">
        {out ? '“Zoom out” to see the big picture.' : 'Helping teams “zoom in” on human detail.'}
      </p>
    </div>
  )
}

/** 14. Persona card: a user's own words on the front; turn it to see what they need. */
export function PersonaCard() {
  const [turned, setTurned] = useState(false)
  return (
    <button
      type="button"
      className="d-persona"
      aria-pressed={turned}
      onClick={() => setTurned((t) => !t)}
    >
      <motion.span
        className="d-persona__in"
        animate={{ rotateY: turned ? 180 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <span className="d-persona__front">
          <span className="d-persona__who">In their words</span>
          <q>
            I speak a little English but I struggle with reading and writing, especially legal
            words.
          </q>
          <span className="d-persona__hint">Turn over</span>
        </span>
        <span className="d-persona__back">
          <span className="d-persona__who">What this means for design</span>
          <ul>
            <li>Plain language, short sentences</li>
            <li>No legal terms without meaning</li>
            <li>Pictures and spoken help</li>
          </ul>
        </span>
      </motion.span>
    </button>
  )
}

/** 15. Put them in order: tap the participation steps in the right order. */
export function PutInOrder() {
  const steps = ['Collaborate', 'Engage', 'Grow', 'Involve']
  const right = ['Engage', 'Involve', 'Collaborate', 'Grow']
  const [picked, setPicked] = useState<string[]>([])
  const done = picked.length === 4
  const ok = done && picked.every((p, i) => p === right[i])
  return (
    <div className="d-order">
      <div className="d-order__pool">
        {steps.map((s) => (
          <button
            key={s}
            type="button"
            disabled={picked.includes(s)}
            onClick={() => setPicked((p) => [...p, s])}
          >
            {s}
          </button>
        ))}
      </div>
      <ol className="d-order__line">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} data-filled={Boolean(picked[i])}>
            {picked[i] ?? '·'}
          </li>
        ))}
      </ol>
      <p className="d-caption" aria-live="polite">
        {done
          ? ok
            ? 'Yes: from engage to grow.'
            : 'Not quite. It runs from engage to grow.'
          : 'Tap the steps in the order they happen.'}{' '}
        {done && (
          <button type="button" className="d-link" onClick={() => setPicked([])}>
            Try again
          </button>
        )}
      </p>
    </div>
  )
}

/** 16. Consequence map: choose a decision and its knock-on effects branch out. */
export function ConsequenceMap() {
  const [open, setOpen] = useState(false)
  const effects = [
    'Fewer calls back',
    'Staff time freed',
    'Older users left behind',
    'New support needed',
  ]
  return (
    <div className="d-conseq">
      <button
        type="button"
        className="d-conseq__root"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        Move the form online
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className="d-conseq__branches"
            initial="h"
            animate="s"
            exit="h"
            variants={{ s: { transition: { staggerChildren: 0.08 } } }}
          >
            {effects.map((e, i) => (
              <motion.li
                key={e}
                data-bad={i > 1}
                variants={{ h: { opacity: 0, x: -10 }, s: { opacity: 1, x: 0 } }}
              >
                {e}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <p className="d-caption">
        Consequence mapping: exploring the unintended outcomes of our work.
      </p>
    </div>
  )
}

/** 17. Systems map: people, policies, place and service; point at one to light its links. */
export function SystemsMap() {
  const nodes = [
    { id: 'People', x: 20, y: 30 },
    { id: 'Policies', x: 78, y: 22 },
    { id: 'Place', x: 26, y: 78 },
    { id: 'Service', x: 74, y: 74 },
  ]
  const [on, setOn] = useState<string | null>(null)
  return (
    <div className="d-sys" onPointerLeave={() => setOn(null)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {nodes.flatMap((a, i) =>
          nodes
            .slice(i + 1)
            .map((b) => (
              <line
                key={a.id + b.id}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                data-on={on === a.id || on === b.id}
              />
            )),
        )}
      </svg>
      {nodes.map((n) => (
        <button
          key={n.id}
          type="button"
          className="d-sys__node"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          data-on={on === n.id}
          onPointerEnter={() => setOn(n.id)}
          onFocus={() => setOn(n.id)}
        >
          {n.id}
        </button>
      ))}
      <p className="d-caption d-sys__cap">Systems mapping makes the inter-connections visible.</p>
    </div>
  )
}

const noop = () => () => {}
const readNote = () => {
  try {
    return localStorage.getItem('katsura:reflect') ?? ''
  } catch {
    return ''
  }
}

/** 18. Your turn: a short reflection prompt with a private note that stays in this browser. */
export function YourTurn() {
  // The saved note, read once from the browser; typing then takes over.
  const stored = useSyncExternalStore(noop, readNote, () => '')
  const [typed, setV] = useState<string | null>(null)
  const v = typed ?? stored
  return (
    <div className="d-turn">
      <p className="d-turn__q">
        Think of a service you worked on. Which layer did you design for, and which did you miss?
      </p>
      <textarea
        value={v}
        onChange={(e) => {
          setV(e.target.value)
          try {
            localStorage.setItem('katsura:reflect', e.target.value)
          } catch {}
        }}
        placeholder="A private note. It stays in this browser."
        aria-label="Your note"
        rows={3}
      />
    </div>
  )
}

/** 19. Quick poll: one tap, then how the choice compares (a local stand-in for real results). */
export function QuickPoll() {
  const opts = ['Individual', 'Service', 'Organisation', 'Community', 'Environment']
  const base = [34, 28, 18, 12, 8]
  const [pick, setPick] = useState<number | null>(null)
  return (
    <div className="d-poll">
      <p className="d-turn__q">Which layer do you design for most?</p>
      <ul>
        {opts.map((o, i) => (
          <li key={o}>
            <button
              type="button"
              aria-pressed={pick === i}
              onClick={() => setPick(i)}
              disabled={pick !== null}
            >
              <span
                className="d-poll__bar"
                style={{ width: pick === null ? 0 : `${base[i] + (pick === i ? 4 : 0)}%` }}
              />
              <span className="d-poll__name">{o}</span>
              {pick !== null && (
                <span className="d-poll__pc">{base[i] + (pick === i ? 4 : 0)}%</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** 20. Build the wall: drag the uses of stories onto a board, like sticky notes. */
export function BuildTheWall() {
  const uses = [
    'uncover hidden challenges',
    'describe the case for change',
    'share visions for the future',
  ]
  return (
    <div className="d-board">
      {uses.map((u, i) => (
        <Draggable key={u} i={i}>
          {u}
        </Draggable>
      ))}
      <p className="d-caption d-board__cap">Drag the notes. We use stories to…</p>
    </div>
  )
}
function Draggable({ children, i }: { children: ReactNode; i: number }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [dragging, setDragging] = useState(false)
  const start = useRef<{ px: number; py: number; x: number; y: number } | null>(null)
  const down = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = { px: e.clientX, py: e.clientY, x: x.get(), y: y.get() }
    setDragging(true)
  }
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!start.current) return
    x.set(start.current.x + e.clientX - start.current.px)
    y.set(start.current.y + e.clientY - start.current.py)
  }
  const up = () => {
    start.current = null
    setDragging(false)
  }
  return (
    <motion.div
      className="d-board__note"
      style={{ x, y, left: `${8 + i * 30}%`, top: `${14 + (i % 2) * 18}%`, rotate: [-3, 2, -1][i] }}
      animate={{
        scale: dragging ? 1.06 : 1,
        boxShadow: dragging
          ? '0 18px 30px -14px rgba(33,26,18,0.4)'
          : '0 8px 16px -12px rgba(33,26,18,0.3)',
      }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      {children}
    </motion.div>
  )
}
