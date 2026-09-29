'use client'

import {
  animate,
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from 'react'

/*
 * Ten subtle sketches for chapters 04 to 06, each built on Motion and using real content from
 * those pages. Every one moves only when the reader scrolls, points or chooses, uses soft springs
 * or ease-out curves with no bounce, and shows its finished state under reduced motion.
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
const STILL = { duration: 0 } as const

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const SOFT = { type: 'spring', bounce: 0, duration: 0.7 } as const
const VIEW = { once: true, amount: 0.5 } as const
const PH = {
  wall: '/photos/wall-of-quotes.jpg',
  focus: '/photos/focused-work.jpg',
  hands: '/photos/audience-hands.jpg',
  lego: '/photos/participation-people.png',
  pitch: '/photos/pitching-idea.jpg',
  team: '/photos/team-meeting.png',
  flip: '/photos/head-flipchart.jpg',
  build: '/photos/lego-trees.png',
  journey: '/photos/journey-map-group.jpg',
  insight: '/photos/insight-wall-sticky.png',
}

/* ── Images ─────────────────────────────────────────────────────────────────────────────── */

/** 1. Arrive in focus: the photo comes into view from a soft blur and settles. */
export function ArriveInFocus() {
  const reduce = useReduced()
  return (
    <figure className="s-photo">
      <motion.img
        src={PH.wall}
        alt="A wall covered in printed quotations from research."
        initial={reduce ? false : { filter: 'blur(10px)', scale: 1.04, opacity: 0.6 }}
        whileInView={{ filter: 'blur(0px)', scale: 1, opacity: 1 }}
        viewport={VIEW}
        transition={reduce ? STILL : { duration: 1.1, ease: EASE }}
      />
    </figure>
  )
}

/** 2. Aperture: the photo opens from a circle at its centre, like the chapter marks' bloom. */
export function Aperture() {
  const reduce = useReduced()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, VIEW)
  const radius = useMotionValue(6)
  const clipPath = useMotionTemplate`circle(${radius}% at 50% 50%)`
  useEffect(() => {
    if (!inView) return
    const controls = animate(radius, 75, reduce ? STILL : { duration: 1.4, ease: EASE })
    return () => controls.stop()
  }, [inView, reduce, radius])
  return (
    <figure ref={ref} className="s-photo">
      <motion.img src={PH.hands} alt="An audience with many hands raised." style={{ clipPath }} />
    </figure>
  )
}

/** 3. Slow pan: a wide photo's crop travels gently sideways as the page scrolls. */
export function SlowPan() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReduced()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useSpring(useTransform(scrollYProgress, [0, 1], ['-4%', '4%']), {
    stiffness: 60,
    damping: 20,
  })
  return (
    <figure ref={ref} className="s-photo s-photo--pan">
      <motion.img
        src={PH.journey}
        alt="A group standing around a long journey map."
        style={reduce ? undefined : { x, scale: 1.1 }}
      />
    </figure>
  )
}

/** 4. Gentle tilt: the photo leans a few degrees towards the pointer and springs back. */
export function GentleTilt() {
  const reduce = useReduced()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-3, 3]), { stiffness: 120, damping: 20 })
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [3, -3]), { stiffness: 120, damping: 20 })
  const move = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const leave = () => {
    px.set(0)
    py.set(0)
  }
  return (
    <div className="s-tilt" onPointerMove={reduce ? undefined : move} onPointerLeave={leave}>
      <motion.figure className="s-photo" style={reduce ? undefined : { rotateX, rotateY }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PH.pitch} alt="A designer pitching an idea to a small group." />
      </motion.figure>
    </div>
  )
}

/* ── Text ───────────────────────────────────────────────────────────────────────────────── */

/** 5. Lines rise: each line of the statement slides up out of its own mask, in turn. */
export function LinesRise() {
  const reduce = useReduced()
  const lines = [
    'Every aspect of the way we live is changing:',
    'our economies, our jobs, our communities',
    'and our relationships.',
  ]
  return (
    <motion.p
      className="s-statement"
      aria-label={lines.join(' ')}
      initial={reduce ? false : 'hidden'}
      whileInView="shown"
      viewport={VIEW}
    >
      {lines.map((l, i) => (
        <span key={l} className="s-line" aria-hidden="true">
          <motion.span
            variants={{ hidden: { y: '105%' }, shown: { y: '0%' } }}
            transition={reduce ? STILL : { duration: 0.8, ease: EASE, delay: i * 0.08 }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </motion.p>
  )
}

/** 6. Type settles: a heading arrives slightly spaced and soft, and draws itself together. */
export function TypeSettles() {
  const reduce = useReduced()
  return (
    <motion.h3
      className="s-heading"
      initial={reduce ? false : { letterSpacing: '0.06em', opacity: 0, filter: 'blur(4px)' }}
      whileInView={{ letterSpacing: '-0.02em', opacity: 1, filter: 'blur(0px)' }}
      viewport={VIEW}
      transition={reduce ? STILL : { duration: 1.2, ease: EASE }}
    >
      Design is for everyone
    </motion.h3>
  )
}

/** 7. Glide: three topics as words; a soft pill glides to the chosen one and its text eases in. */
export function Glide() {
  const topics = [
    {
      name: 'Zoom in and out',
      text: 'Helping teams “zoom in” on human detail and “zoom out” to see the big picture.',
    },
    {
      name: 'Make it tangible',
      text: 'Using narratives, maps, personas and prototypes to make abstract concepts tangible and persuadable.',
    },
    {
      name: 'Show the moments',
      text: 'Translating research into artefacts that visualise how people interact with services, the moments of delight and the barriers they face.',
    },
  ]
  const [on, setOn] = useState(0)
  const reduce = useReduced()
  return (
    <div className="s-glide">
      <div className="s-glide__tabs" role="tablist" aria-label="How our designers tell stories">
        {topics.map((t, i) => (
          <button
            key={t.name}
            role="tab"
            aria-selected={on === i}
            className="s-glide__tab"
            onClick={() => setOn(i)}
            onPointerEnter={() => setOn(i)}
          >
            {on === i && (
              <motion.span
                layoutId="s-glide-pill"
                className="s-glide__pill"
                transition={reduce ? { duration: 0 } : SOFT}
              />
            )}
            <span className="s-glide__label">{t.name}</span>
          </button>
        ))}
      </div>
      <div className="s-glide__panel" role="tabpanel">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={on}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {topics[on]!.text}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

/** 8. Word preview: pointing at a named method floats a small photo of it beside the pointer. */
export function WordPreview() {
  const reduce = useReduced()
  const [shown, setShown] = useState<string | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 30 })
  const sy = useSpring(y, { stiffness: 260, damping: 30 })
  const box = useRef<HTMLParagraphElement>(null)
  const track = (e: PointerEvent) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    x.set(e.clientX - r.left + 16)
    y.set(e.clientY - r.top + 28)
  }
  const word = (w: string, src: string) => (
    <span
      key={w}
      className="s-word"
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return
        track(e)
        sx.jump(x.get())
        sy.jump(y.get())
        setShown(src)
      }}
      onPointerLeave={() => setShown(null)}
    >
      {w}
    </span>
  )
  return (
    <p ref={box} className="s-body s-preview" onPointerMove={track}>
      Using {word('narratives', PH.flip)}, {word('maps', PH.journey)},{' '}
      {word('personas', PH.insight)} and {word('prototypes', PH.build)} to make abstract concepts
      tangible and persuadable.
      <AnimatePresence>
        {shown && (
          <motion.img
            key={shown}
            src={shown}
            alt=""
            className="s-preview__img"
            style={{ x: sx, y: sy }}
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
        )}
      </AnimatePresence>
    </p>
  )
}

/* ── Text and image together ────────────────────────────────────────────────────────────── */

/** 9. Photo travels: choose one of the four ways and its photo glides into that row. */
export function PhotoTravels() {
  const ways = [
    {
      lead: 'Connecting people and ideas.',
      text: 'Making connections and proactively involving all stakeholders.',
      src: PH.team,
    },
    {
      lead: 'Encouraging collaboration.',
      text: 'Drawing out insights and enabling one-team collaboration.',
      src: PH.lego,
    },
    {
      lead: 'Bringing visions to life.',
      text: 'Facilitating teamwork to bring shared visions to reality.',
      src: PH.build,
    },
    {
      lead: 'Growing our clients’ capabilities.',
      text: 'Building communities of practice in research, design, product, data delivery and technology.',
      src: PH.focus,
    },
  ]
  const [on, setOn] = useState(0)
  const reduce = useReduced()
  const t = reduce ? { duration: 0 } : SOFT
  return (
    <LayoutGroup>
      <ul className="s-travel">
        {ways.map((w, i) => (
          <motion.li
            key={w.lead}
            layout
            transition={t}
            className="s-travel__row"
            data-on={on === i}
          >
            <button className="s-travel__lead" aria-expanded={on === i} onClick={() => setOn(i)}>
              {w.lead}
            </button>
            {on === i && (
              <>
                <motion.img
                  layoutId="s-travel-photo"
                  transition={t}
                  src={w.src}
                  alt=""
                  className="s-travel__img"
                />
                <motion.p
                  className="s-travel__text"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: reduce ? 0 : 0.15 }}
                >
                  {w.text}
                </motion.p>
              </>
            )}
          </motion.li>
        ))}
      </ul>
    </LayoutGroup>
  )
}

/** 10. Scroll captions: one photo holds still while the three ways of working pass over it. */
export function ScrollCaptions() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReduced()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.3', 'end 0.7'] })
  const stages = [
    'With designers, consumers, frontline staff and the organisation to explore hypotheses and reveal hidden assumptions.',
    'Participation with cross-functional teams to ideate and prioritise solutions, identify unintended consequences and build legitimacy.',
    'Intensive, short cycles leading multidisciplinary teams to explore, prototype and test ideas together.',
  ]
  const o0 = useTransform(scrollYProgress, [0, 0.28, 0.36], [1, 1, 0])
  const o1 = useTransform(scrollYProgress, [0.3, 0.38, 0.62, 0.7], [0, 1, 1, 0])
  const o2 = useTransform(scrollYProgress, [0.64, 0.72, 1], [0, 1, 1])
  const y0 = useTransform(scrollYProgress, [0.28, 0.36], [0, -12])
  const y1 = useTransform(scrollYProgress, [0.3, 0.38, 0.62, 0.7], [12, 0, 0, -12])
  const y2 = useTransform(scrollYProgress, [0.64, 0.72], [12, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1])
  const motionFor = [
    { opacity: o0, y: y0 },
    { opacity: o1, y: y1 },
    { opacity: o2, y: y2 },
  ]
  if (reduce)
    return (
      <div ref={ref} className="s-captions s-captions--still">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PH.lego} alt="People building a model together from Lego." />
        <ol>
          {stages.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>
    )
  return (
    <div ref={ref} className="s-captions">
      <div className="s-captions__stick">
        <motion.img
          src={PH.lego}
          alt="People building a model together from Lego."
          style={{ scale }}
        />
        <ol className="s-captions__list">
          {stages.map((s, i) => (
            <motion.li key={s} style={motionFor[i]}>
              <span className="s-captions__n">{String(i + 1).padStart(2, '0')}</span>
              {s}
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  )
}
