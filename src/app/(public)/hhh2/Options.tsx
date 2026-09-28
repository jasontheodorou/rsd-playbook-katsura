'use client'

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'

import '../foundations/[chapter]/components/body-text.css'
import '../foundations/[chapter]/components/part-section.css'

/* The Head part from chapter 03, the same in every option, so only the image treatment changes. */
const HEAD = {
  eyebrow: 'Head',
  heading: 'Immersed in our clients’ world',
  accent: '#a94c00',
  mark: '/illustrations/hhh/head-scribble.png',
  photo: '/photos/wall-of-quotes.jpg',
  alt: 'Colleagues gathered at a wall of printed notes, one reaching up to point at a note.',
  paragraphs: [
    'We work to understand our clients, their context, their needs and their people, so that we can help them design for the future.',
    'We use human-centred frameworks to shape how we think about our approach. These help us to understand people and their context. After all, those who use, deliver and manage services don’t exist in a vacuum.',
    'We’re always working to understand and grow. We can extend our work with clients by putting our human-centred approach at the centre, redesigning and reimagining to address the systemic factors that can make or break services.',
  ],
}
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

function Head({ children }: { children?: ReactNode }) {
  return (
    <>
      <h2 className="part__heading">
        {HEAD.heading}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="part__mark" src={HEAD.mark} alt="" aria-hidden="true" />
      </h2>
      {children}
    </>
  )
}
function Text({ from = 0 }: { from?: number }) {
  return (
    <div className="body-text" style={{ marginTop: 48 }}>
      {HEAD.paragraphs.slice(from).map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  )
}

/* ── 1. Curtain: the photo opens from a slit to full width as it scrolls up the screen ── */

export function Curtain() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const side = useTransform(scrollYProgress, [0, 1], ['38%', '0%'])
  const clip = useTransform(side, (s) => `inset(0 ${s} 0 ${s} round 0px)`)
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1])
  return (
    <section className="part">
      <Head>
        <div ref={ref} className="h2-frame" style={{ marginTop: 48 }}>
          <motion.div className="h2-clip" style={reduce ? undefined : { clipPath: clip }}>
            <motion.img
              className="h2-img"
              src={HEAD.photo}
              alt={HEAD.alt}
              style={reduce ? undefined : { scale }}
            />
          </motion.div>
        </div>
      </Head>
      <Text />
    </section>
  )
}

/* ── 2. Drifting plane: the photo and its coloured plane move at different speeds as you scroll,
       so the frame seems to float behind the photo ── */

export function DriftingPlane() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const planeY = useTransform(scrollYProgress, [0, 1], [48, -48])
  const planeX = useTransform(scrollYProgress, [0, 1], [24, -24])
  const photoY = useTransform(scrollYProgress, [0, 1], [-16, 16])
  return (
    <section className="part">
      <Head>
        <figure
          ref={ref}
          className="part__media part__media--tl part__media--paleblue"
          style={{ marginTop: 48 }}
        >
          <motion.span
            className="part__plane"
            aria-hidden="true"
            style={reduce ? undefined : { y: planeY, x: planeX }}
          />
          <motion.img
            className="part__photo"
            src={HEAD.photo}
            alt={HEAD.alt}
            style={reduce ? undefined : { y: photoY }}
          />
        </figure>
      </Head>
      <Text />
    </section>
  )
}

/* ── 3. Spotlight: the photo rests in pencil grey, and a soft circle of colour follows the pointer.
       On first view the light sweeps across it once, so readers learn it is there ── */

export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [spot, setSpot] = useState({ x: -20, y: 50, r: 0 })
  const [touched, setTouched] = useState(false)
  useEffect(() => {
    if (!inView || reduce || touched) return
    let t = 0
    const id = setInterval(() => {
      t += 0.02
      if (t >= 1) {
        clearInterval(id)
        setSpot((s) => ({ ...s, r: 0 }))
        return
      }
      setSpot({ x: -10 + t * 120, y: 40 + Math.sin(t * Math.PI) * 20, r: 22 })
    }, 24)
    return () => clearInterval(id)
  }, [inView, reduce, touched])
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setTouched(true)
    setSpot({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
      r: 22,
    })
  }
  const mask = `radial-gradient(circle at ${spot.x}% ${spot.y}%, #000 0, #000 ${spot.r * 0.6}%, transparent ${spot.r}%)`
  return (
    <section className="part">
      <Head>
        <div
          ref={ref}
          className="h2-frame h2-spot"
          style={{ marginTop: 48 }}
          onPointerMove={move}
          onPointerLeave={() => setSpot((s) => ({ ...s, r: 0 }))}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="h2-img h2-spot__grey" src={HEAD.photo} alt={HEAD.alt} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h2-img h2-spot__colour"
            src={HEAD.photo}
            alt=""
            aria-hidden="true"
            style={reduce ? { opacity: 1 } : { WebkitMaskImage: mask, maskImage: mask }}
          />
        </div>
      </Head>
      <Text />
    </section>
  )
}

/* ── 4. Photo stack: three photos, loosely stacked like prints on a table. Choose the top one and
       it slides to the back, showing the next ── */

const STACK = [
  { src: '/photos/wall-of-quotes.jpg', alt: HEAD.alt },
  {
    src: '/photos/focused-work.jpg',
    alt: 'A designer in headphones working at a screen covered in sticky notes and sketches.',
  },
  {
    src: '/photos/pitching-idea.jpg',
    alt: 'A man explaining an idea to colleagues around a table of Lego bricks.',
  },
]
const TILT = [-2.5, 2, -1]

export function PhotoStack() {
  const [order, setOrder] = useState([0, 1, 2])
  const reduce = useReducedMotion()
  const next = () => setOrder((o) => [...o.slice(1), o[0]])
  return (
    <section className="part">
      <Head>
        <div className="h2-stack" style={{ marginTop: 56 }}>
          {order
            .map((idx, depth) => ({ idx, depth }))
            .reverse()
            .map(({ idx, depth }) => (
              <motion.button
                key={idx}
                type="button"
                className="h2-stack__print"
                aria-label={depth === 0 ? `${STACK[idx].alt} Show the next photo.` : undefined}
                tabIndex={depth === 0 ? 0 : -1}
                aria-hidden={depth !== 0}
                onClick={depth === 0 ? next : undefined}
                initial={false}
                animate={
                  reduce
                    ? { zIndex: 3 - depth, opacity: depth === 0 ? 1 : 0.9 }
                    : {
                        zIndex: 3 - depth,
                        rotate: TILT[(idx + depth) % 3],
                        x: depth * 18,
                        y: depth * -14,
                        scale: 1 - depth * 0.03,
                      }
                }
                transition={{ duration: 0.55, ease: EASE }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={STACK[idx].src} alt="" draggable={false} />
              </motion.button>
            ))}
        </div>
        <p className="h2-hint">Choose the photo to see the next one.</p>
      </Head>
      <Text />
    </section>
  )
}

/* ── 5. Moving photo: a short film in the photo's place, on its plane. It plays only while on
       screen, silently and on a loop; with reduced motion it stays on its first frame ── */

export function MovingPhoto() {
  const ref = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref, { amount: 0.5 })
  const reduce = useReducedMotion()
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (inView && !reduce) v.play().catch(() => {})
    else v.pause()
  }, [inView, reduce])
  return (
    <section className="part">
      <Head>
        <figure
          className="part__media part__media--tl part__media--paleblue"
          style={{ marginTop: 48 }}
        >
          <span className="part__plane" aria-hidden="true" />
          <video
            ref={ref}
            className="part__photo"
            src="/videos/postits.mp4"
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Hands placing sticky notes on a wall."
          />
        </figure>
      </Head>
      <Text />
    </section>
  )
}

/* ── 6. Photo per paragraph: the photo pins beside the text as you read, and changes to match
       each paragraph. This one breaks the one-column rule, as a comparison ── */

const PER_PARA = [
  { src: '/photos/wall-of-quotes.jpg', alt: HEAD.alt },
  {
    src: '/photos/participation-people.png',
    alt: 'Lego figures on a wall beside printed notes about the people they stand for.',
  },
  {
    src: '/photos/team-meeting.png',
    alt: 'Colleagues talking around a long table in a bright meeting room.',
  },
]

function Para({ text, onEnter }: { text: string; onEnter: () => void }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inView) onEnter()
  }, [inView, onEnter])
  return (
    <p ref={ref} className="h2-scrolly__para">
      {text}
    </p>
  )
}

export function PhotoPerParagraph() {
  const [k, setK] = useState(0)
  return (
    <section className="part h2-scrolly">
      <div className="h2-scrolly__text">
        <Head />
        <div className="body-text" style={{ marginTop: 48 }}>
          {HEAD.paragraphs.map((p, i) => (
            <Para key={p} text={p} onEnter={() => setK(i)} />
          ))}
        </div>
      </div>
      <div className="h2-scrolly__pin">
        <figure className="part__media part__media--br part__media--paleblue" style={{ margin: 0 }}>
          <span className="part__plane" aria-hidden="true" />
          <div className="h2-scrolly__photo">
            <AnimatePresence initial={false}>
              <motion.img
                key={k}
                src={PER_PARA[k].src}
                alt={PER_PARA[k].alt}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </AnimatePresence>
          </div>
        </figure>
      </div>
    </section>
  )
}

/* ── 7. Assembling tiles: the photo arrives as a grid of tiles that drift into place ── */

const COLS = 6
const ROWS = 3

export function Tiles() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const tiles = Array.from({ length: COLS * ROWS }, (_, i) => i)
  return (
    <section className="part">
      <Head>
        <div
          ref={ref}
          className="h2-tiles"
          style={{ marginTop: 48 }}
          role="img"
          aria-label={HEAD.alt}
        >
          {tiles.map((i) => {
            const c = i % COLS
            const r = Math.floor(i / COLS)
            const seed = ((i * 37) % 11) - 5
            return (
              <motion.span
                key={i}
                className="h2-tiles__tile"
                style={{
                  backgroundImage: `url(${HEAD.photo})`,
                  backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                  backgroundPosition: `${(c / (COLS - 1)) * 100}% ${(r / (ROWS - 1)) * 100}%`,
                }}
                initial={
                  reduce
                    ? false
                    : { opacity: 0, x: seed * 6, y: 24 + ((i * 13) % 5) * 8, rotate: seed * 1.2 }
                }
                animate={inView ? { opacity: 1, x: 0, y: 0, rotate: 0 } : undefined}
                transition={{ duration: 0.9, ease: EASE, delay: (c + r) * 0.05 }}
              />
            )
          })}
        </div>
      </Head>
      <Text />
    </section>
  )
}
