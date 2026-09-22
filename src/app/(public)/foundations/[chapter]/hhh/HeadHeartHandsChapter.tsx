'use client'

import { motion, useReducedMotion, useScroll, type Variants } from 'motion/react'
import { useRef, useState, type ReactNode } from 'react'

import HeadHeartHandsPattern from './HeadHeartHandsPattern'
import { Media } from './Media'
import { QuoteCard } from './QuoteCard'
import './pathway.css'

/**
 * The Head, Heart and Hands chapter, carried over from the reference build's Pathway 1 (page s9)
 * with its shell: warm paper, left rail with a scroll-progress ribbon, and the square hamburger.
 * Two changes from the original: the hamburger returns to the Foundations grid instead of
 * opening a page list, and the chapter-read applet (passed in as `end`) replaces the Continue footer.
 *
 * Opening is a short choreography: the paper fades in, the rail and its control slide in from the
 * left, then the heading, text and artwork rise one after another. The hamburger plays it in
 * reverse, then leaves. Under reduced motion everything is instant.
 */

// One easing for every entrance (a long, settling ease-out) and a quicker one for exits.
const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number]
const EASE_IN = [0.4, 0, 0.7, 0.2] as [number, number, number, number]

const root: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: EASE_OUT } },
  leave: { opacity: 0, transition: { duration: 0.4, ease: EASE_IN, delay: 0.28 } },
}
const rail: Variants = {
  hidden: { x: -48, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.65, ease: EASE_OUT, delay: 0.12 } },
  leave: { x: -48, opacity: 0, transition: { duration: 0.45, ease: EASE_IN, delay: 0.12 } },
}
const control: Variants = {
  hidden: { x: -48, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.6, ease: EASE_OUT, delay: 0.3 } },
  leave: { x: -48, opacity: 0, transition: { duration: 0.4, ease: EASE_IN, delay: 0.06 } },
}
const article: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: EASE_OUT,
      delay: 0.18,
      when: 'beforeChildren',
      staggerChildren: 0.09,
    },
  },
  leave: { opacity: 0, y: 12, transition: { duration: 0.38, ease: EASE_IN } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE_OUT } },
  leave: { opacity: 0, transition: { duration: 0.3, ease: EASE_IN } },
}
export function HeadHeartHandsChapter({ number, end }: { number: string; end: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [leaving, setLeaving] = useState(false)
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const state = leaving ? 'leave' : 'show'

  const accent = '#D8B4A3'
  const accentHover = '#C69A87'
  const accentTrack = 'rgba(216, 180, 163, 0.28)'

  // A full navigation, so the grid's own page transition runs when we land there.
  const goToGrid = () => window.location.assign('/foundations') // eslint-disable-line @next/next/no-location-assign-relative-destination

  const leave = () => {
    if (leaving) return
    setLeaving(true)
    if (reduce) goToGrid()
  }

  const headItems = [
    'Individual needs, capability, motivation and opportunity.',
    'The service context, including barriers, technology and implementation.',
    'Organisational goals, commercial priorities, capability and culture.',
    'Community influence and relationships.',
    'The wider environmental context influencing adoption and scale.',
  ]
  const heartItems = [
    'Solve the right problem. A product or service can only ever be as good as the understanding of the problem it addresses.',
    'Co-location underpins collaboration. When we are together, we can design better, deliver quicker and adapt as new insight emerges.',
    'We are human first. As technological and physical worlds converge, people must stay at the centre of our work.',
  ]
  const handsItems = [
    'Proof of concept: testing whether an idea can become a real service or product.',
    'Prototype: testing the broader end-to-end journey and simulating real interactions.',
    'Pilot: testing a feature-rich service in an environment that mirrors the real world, with clearly defined outcomes for evaluation.',
  ]

  return (
    <motion.div
      className="pilot-root"
      variants={root}
      initial={reduce ? false : 'hidden'}
      animate={state}
      onAnimationComplete={(definition) => {
        if (definition === 'leave') goToGrid()
      }}
      style={
        {
          '--pilot-accent': accent,
          '--pilot-accent-hover': accentHover,
          '--pilot-accent-track': accentTrack,
          '--pilot-bg': '#FCFBF8',
        } as React.CSSProperties
      }
    >
      {/* Square hamburger on the left edge. Here it is the way back to the Foundations grid. */}
      <motion.div
        className="pilot-hamburger-wrap"
        variants={control}
        initial={reduce ? false : 'hidden'}
        animate={state}
      >
        <button
          type="button"
          className="pilot-hamburger"
          aria-label="Back to the foundations"
          onClick={leave}
        >
          <span
            className="pilot-hamburger__lines"
            data-leaving={leaving ? 'true' : 'false'}
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </span>
        </button>
      </motion.div>

      {/* Left rail: progress ribbon on the left, hairline divider on the right. */}
      <motion.div
        className="pilot-rail"
        aria-hidden="true"
        variants={rail}
        initial={reduce ? false : 'hidden'}
        animate={state}
      >
        <div className="pilot-vribbon">
          <motion.div
            className="pilot-vribbon__fill"
            style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
          />
        </div>
      </motion.div>

      <div ref={scrollRef} className="pilot-scroll">
        <motion.article
          className="p1v2"
          variants={article}
          initial={reduce ? false : 'hidden'}
          animate={state}
        >
          <section className="p1v2__hero">
            <div className="p1v2__hero-text">
              <motion.span className="pilot-marker p1v2__marker" variants={item}>
                <span className="pilot-marker__num">{number}</span>
                <span className="pilot-marker__rule" aria-hidden="true" />
                <span>Our philosophy</span>
              </motion.span>
              <motion.h1 className="p1v2__headline" variants={item}>
                Head, heart and hands.
              </motion.h1>
              <motion.p className="p1v2__lede" variants={item}>
                Our Head, Heart, Hands philosophy brings together clear thinking, genuine care and
                practical action.
              </motion.p>
              <motion.p className="p1v2__lede" variants={item}>
                It helps organisations build better cultures and create services that make a real
                difference to people&rsquo;s lives.
              </motion.p>
            </div>
            <motion.div className="p1v2__hero-art" variants={item}>
              <picture>
                <img src="/illustrations/head_heart_hands.png" alt="" />
              </picture>
            </motion.div>
          </section>

          <motion.div className="p1v2__body" variants={item}>
            <p className="p1v2__prose">
              We are passionate about building services that truly transform lives and make the
              world a better place through design.
            </p>
            <p className="p1v2__prose">
              That is captured in our research and design philosophy:{' '}
              <strong>Head, Heart, Hands.</strong>
            </p>
            <HeadHeartHandsPattern initialActive="head" />
            <p className="p1v2__prose">
              Together, they help organisations establish cultures of expert and empathic
              problem-solving.
            </p>

            <h2 className="p1v2__subhead">Head</h2>
            <p className="p1v2__prose">Head is how we think and frame our work.</p>
            <p className="p1v2__prose">
              We work to understand you, your context and your people, so we can help you design for
              the future.
            </p>
            <p className="p1v2__prose">
              Those who use, deliver and manage services do not exist in a vacuum. That means taking
              a whole-system view.
            </p>
            <div className="p1v2__cinema">
              <div className="ly-layered ly-layered--tl ly-layered--paleblue">
                <span className="ly-layered__plane" aria-hidden="true" />
                <Media
                  shape="21-9"
                  src="/photos/head-flipchart.jpg"
                  alt="Three colleagues sketching a diagram together at a flipchart. Thinking made visible."
                />
              </div>
            </div>
            <aside className="p1v2__card">
              <span className="p1v2__card-label">We consider</span>
              <ul className="p1v2__card-list">
                {headItems.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </aside>
            <p className="p1v2__prose">
              Understanding how a service exists within this ecosystem is essential when designing
              end-to-end.
            </p>
            <p className="p1v2__prose">
              To make decisions about future change, we need to fully and honestly understand where
              you are today.
            </p>
            <p className="p1v2__prose">
              We start with your data, enriching, analysing and visualising it so the story behind
              the numbers is accessible to everyone.
            </p>

            <h2 className="p1v2__subhead">Heart</h2>
            <p className="p1v2__prose">
              Heart is the &ldquo;why&rdquo; behind what we do, the things that get us out of bed in
              the morning.
            </p>
            <p className="p1v2__prose">
              It comes down to making an impact: improving lives, supporting people and making the
              world better.
            </p>
            <p className="p1v2__prose">Our approach is built around three core principles.</p>
            <div className="p1v2__paired">
              <div className="ly-layered ly-layered--br ly-layered--terracotta">
                <span className="ly-layered__plane" aria-hidden="true" />
                <Media
                  shape="16-9"
                  src="/photos/journey-map-group.jpg"
                  alt="A diverse group sharing a hand-drawn journey map. Warm and engaged."
                />
              </div>
            </div>
            <aside className="p1v2__card">
              <span className="p1v2__card-label">Three core principles</span>
              <ul className="p1v2__card-list">
                {heartItems.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </aside>
            <p className="p1v2__prose">
              Stories are how we bring Heart into practice: uncovering hidden challenges, describing
              the case for change, and sharing visions for the future.
            </p>
            <p className="p1v2__prose">
              We tell them through videos, insight visualisations, personas and journey maps.
            </p>

            <h2 className="p1v2__subhead">Hands</h2>
            <p className="p1v2__prose">Hands is how we deliver and get the job done.</p>
            <p className="p1v2__prose">
              Working alongside colleagues, clients and partners, we incrementally turn ideas,
              service concepts and prototypes into real working services.
            </p>
            <p className="p1v2__prose">
              We focus relentlessly on what delivers the greatest value. We test assumptions, learn
              and enhance designs throughout the process.
            </p>
            <div className="p1v2__paired">
              <div className="ly-layered ly-layered--tl ly-layered--blue">
                <span className="ly-layered__plane" aria-hidden="true" />
                <span
                  className="ly-layered__plane ly-layered__plane--yellow ly-layered__plane--br"
                  aria-hidden="true"
                />
                <Media
                  shape="landscape"
                  src="/photos/lego-prototyping.jpg"
                  alt="Hands sorting Lego bricks. Physical prototyping, turning ideas into things."
                />
              </div>
            </div>
            <aside className="p1v2__card">
              <span className="p1v2__card-label">Levels of experimentation</span>
              <ul className="p1v2__card-list">
                {handsItems.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </aside>
            <p className="p1v2__prose">
              Where assumptions or hypotheses fall short, we can pivot, returning to the research
              and insight, and changing direction.
            </p>

            <QuoteCard
              text="Head, heart, hands: think clearly, care deeply, deliver together."
              attribution="Our philosophy"
              tone="blue"
            />
          </motion.div>

          <motion.div className="p1v2__end" variants={item}>
            {end}
          </motion.div>
        </motion.article>
      </div>
    </motion.div>
  )
}
