// Copied from the-rsd-playbook src/pathway1/GoodDesignCollab.tsx for the pattern library's record of the original build.
'use client'

import { motion, useAnimationControls, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import './GoodDesignCollab.css'

/**
 * Collaborative sticky-board.
 *
 * Every element (cursor + sticky) uses `left`/`top` as a percentage of
 * the board so cursors and stickies live in the same coordinate system.
 * "Grip" beats put the cursor and the sticky it's dragging on matched
 * coordinates (with a small offset so the arrow tip sits at the sticky's
 * top-right corner). All positions are tunable in the POS constant below.
 */

const sleep = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms))

// Cursor sits INSIDE the sticky's top-left area so the arrow tip
// visibly holds the note during a drag. Board-relative percentages.
const GRIP_X = 3   // arrow tip 3% right of sticky's left edge (inside)
const GRIP_Y = 4   // arrow tip 4% below sticky's top edge (inside)

const gripOf = (p: { left: number; top: number }) => ({
  left: `${p.left + GRIP_X}%`,
  top: `${p.top + GRIP_Y}%`,
})

// Watch position — cursor slides just past the sticky's right edge and
// sits mid-height, so the text on the sticky reads clean while the
// person "watches" what's being typed. Sticky is roughly 16% × 25% of
// the board, so these offsets clear the right edge.
const WATCH_X = 17
const WATCH_Y = 6

const watchOf = (p: { left: number; top: number }) => ({
  left: `${p.left + WATCH_X}%`,
  top: `${p.top + WATCH_Y}%`,
})

// All board-relative positions in one place — easy to nudge.
// Final sticky positions spread horizontally across the board so the
// finished layout uses the full width; perches (ease-aside positions,
// which also seed the idle wanders) are spaced upper-left / centre /
// right so idle cursors don't cluster.
const POS = {
  blankStart:    { left: 74, top: 30, rotate: 1.7 },
  blankFinal:    { left: 3,  top: 42, rotate: -1.2 },   // Marianne writes (far left)
  evidenceStack: { left: 80, top: 62, rotate: 1.6 },
  evidenceFinal: { left: 36, top: 68, rotate: -0.8 },   // David writes (centre, low)
  testStack:     { left: 84, top: 66, rotate: -1.4 },
  testFinal:     { left: 68, top: 38, rotate: 0.6 },    // Ian writes (far right)
  stackPoint:    { left: 72, top: 62 },

  ianEnter:      { left: -12, top: 82 },
  ianPerch:      { left: 20,  top: 20 },                // ease-aside + wander seed
  ianReview:     { left: 30,  top: 12 },
  ianExit:       { left: -22, top: 108 },

  davidEnter:    { left: 110, top: 92 },
  davidPerch:    { left: 78,  top: 25 },                // ease-up + wander seed
  davidExit:     { left: -22, top: 108 },

  marianneEnter: { left: 110, top: -14 },
  mariannePerch: { left: 50,  top: 18 },                // after-write + wander seed
  marianneReview: { left: 54, top: 10 },
  marianneExit:  { left: 112, top: -18 },
} as const

type TypingKey = 'boundaries' | 'evidence' | 'test' | null
type Controls = ReturnType<typeof useAnimationControls>
type StopFlag = { done: boolean }

function Cursor({
  label,
  className,
  controls,
}: {
  label: string
  className: string
  controls: ReturnType<typeof useAnimationControls>
}) {
  return (
    <motion.div
      className={`gdc-cursor ${className}`}
      animate={controls}
      initial={false}
      aria-hidden="true"
    >
      <svg viewBox="0 0 18 22">
        <path
          d="M1 1 L16 11 L9.5 12.5 L6 20 Z"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <span>{label}</span>
    </motion.div>
  )
}

export function GoodDesignCollab() {
  const rootRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(rootRef, { once: true, amount: 0.35 })
  const reduceMotion = useReducedMotion()

  const ian = useAnimationControls()
  const david = useAnimationControls()
  const marianne = useAnimationControls()

  const boardBlank = useAnimationControls()
  const evidenceNote = useAnimationControls()
  const testNote = useAnimationControls()

  const [boundaries, setBoundaries] = useState('')
  const [evidence, setEvidence] = useState('')
  const [test, setTest] = useState('')
  const [typing, setTyping] = useState<TypingKey>(null)
  const [stackCount, setStackCount] = useState(3)

  useEffect(() => {
    if (!isInView) return
    let cancelled = false

    async function typeDraft(
      key: Exclude<TypingKey, null>,
      steps: string[],
      setter: (v: string) => void
    ) {
      setTyping(key)
      setter('')
      for (let s = 0; s < steps.length; s++) {
        const phrase = steps[s]
        for (let i = 1; i <= phrase.length; i++) {
          if (cancelled) return
          setter(phrase.slice(0, i))
          await sleep(42)
        }
        if (s < steps.length - 1) {
          await sleep(650)
          for (let i = phrase.length; i >= 0; i--) {
            if (cancelled) return
            setter(phrase.slice(0, i))
            await sleep(16)
          }
          await sleep(240)
        }
      }
      await sleep(360)
      setTyping(null)
    }

    const percent = (p: { left: number; top: number }) => ({
      left: `${p.left}%`,
      top: `${p.top}%`,
    })

    // Idle drift: keeps a cursor gently moving around a center point
    // until stop.done goes true. Small radius, long durations — reads
    // like a hand resting on a trackpad.
    async function wander(
      control: Controls,
      center: { left: number; top: number },
      radius: number,
      stop: StopFlag
    ) {
      while (!stop.done && !cancelled) {
        const dx = (Math.random() - 0.5) * 2 * radius
        const dy = (Math.random() - 0.5) * 2 * radius
        await control.start({
          left: `${center.left + dx}%`,
          top: `${center.top + dy}%`,
          transition: { duration: 1.2 + Math.random() * 0.6, ease: 'easeInOut' as const },
        })
        if (stop.done || cancelled) return
        await sleep(120 + Math.random() * 220)
      }
    }

    // Run `work()` with a set of idle wanderers alongside. Wanderers
    // stop when the work resolves; we await them so their last
    // transition completes cleanly before the next phase moves anyone.
    async function withIdleWander(
      wanderers: Array<{ control: Controls; center: { left: number; top: number }; radius: number }>,
      work: () => Promise<void>
    ) {
      const stop: StopFlag = { done: false }
      const promises = wanderers.map((w) => wander(w.control, w.center, w.radius, stop))
      await work()
      stop.done = true
      await Promise.all(promises)
    }

    async function run() {
      if (reduceMotion) {
        setBoundaries('Work across boundaries.')
        setEvidence('Evidence over assumptions.')
        setTest('Test, learn, improve.')
        setStackCount(1)
        boardBlank.set({ ...percent(POS.blankFinal), rotate: POS.blankFinal.rotate, opacity: 1 })
        evidenceNote.set({ ...percent(POS.evidenceFinal), rotate: POS.evidenceFinal.rotate, opacity: 1 })
        testNote.set({ ...percent(POS.testFinal), rotate: POS.testFinal.rotate, opacity: 1 })
        ian.set({ opacity: 0 })
        david.set({ opacity: 0 })
        marianne.set({ opacity: 0 })
        return
      }

      // Initial state
      boardBlank.set({ ...percent(POS.blankStart), rotate: POS.blankStart.rotate, opacity: 1 })
      evidenceNote.set({ ...percent(POS.evidenceStack), rotate: POS.evidenceStack.rotate, opacity: 0 })
      testNote.set({ ...percent(POS.testStack), rotate: POS.testStack.rotate, opacity: 0 })
      ian.set({ ...percent(POS.ianEnter), opacity: 1 })
      david.set({ ...percent(POS.davidEnter), opacity: 1 })
      marianne.set({ ...percent(POS.marianneEnter), opacity: 1 })

      const move = { duration: 1.4, ease: [0.22, 0.9, 0.2, 1] as [number, number, number, number] }
      const drag = { duration: 1.6, ease: [0.22, 0.9, 0.2, 1] as [number, number, number, number] }
      const arrive = { duration: 1.15, ease: [0.22, 0.9, 0.2, 1] as [number, number, number, number] }

      // ── Phase 1: Ian moves toward the blank sticky, grips it, drags it
      await ian.start({ ...gripOf(POS.blankStart), transition: move })
      if (cancelled) return
      await sleep(400)

      await Promise.all([
        ian.start({ ...gripOf(POS.blankFinal), transition: drag }),
        boardBlank.start({
          ...percent(POS.blankFinal),
          rotate: POS.blankFinal.rotate,
          transition: drag,
        }),
      ])
      if (cancelled) return
      await sleep(500)

      // Ian eases aside to his upper-left perch; Marianne arrives above
      // the placed sticky, then slides off to the right so the text
      // reads unobstructed while she types.
      const marianneAtBlank = gripOf(POS.blankFinal)
      await Promise.all([
        ian.start({ ...percent(POS.ianPerch), transition: arrive }),
        marianne.start({ ...marianneAtBlank, transition: { ...move, duration: 1.6 } }),
      ])
      if (cancelled) return
      await sleep(400)
      await marianne.start({ ...watchOf(POS.blankFinal), transition: { duration: 0.55, ease: [0.22, 0.9, 0.2, 1] as [number, number, number, number] } })
      if (cancelled) return
      await sleep(200)

      // ── Phase 2: Marianne types draft → revise → final. Ian wanders
      //     around his upper-left perch.
      await withIdleWander(
        [{ control: ian, center: POS.ianPerch, radius: 6 }],
        () => typeDraft('boundaries', ['Across teams.', 'Work across boundaries.'], setBoundaries)
      )
      if (cancelled) return
      await sleep(500)

      await marianne.start({ ...percent(POS.mariannePerch), transition: arrive })
      if (cancelled) return
      await sleep(400)

      // ── Phase 3: David arrives, grips, drags, then types the evidence
      //     sticky. Ian + Marianne wander throughout — David's entire
      //     journey is wrapped so the idle motion never pauses.
      await withIdleWander(
        [
          { control: ian, center: POS.ianPerch, radius: 6 },
          { control: marianne, center: POS.mariannePerch, radius: 6 },
        ],
        async () => {
          await david.start({ ...gripOf(POS.stackPoint), transition: { ...move, duration: 1.7 } })
          if (cancelled) return
          await sleep(400)

          setStackCount(2)
          evidenceNote.set({ ...percent(POS.evidenceStack), rotate: POS.evidenceStack.rotate, opacity: 1 })

          await Promise.all([
            david.start({ ...gripOf(POS.evidenceFinal), transition: drag }),
            evidenceNote.start({
              ...percent(POS.evidenceFinal),
              rotate: POS.evidenceFinal.rotate,
              transition: drag,
            }),
          ])
          if (cancelled) return
          await sleep(350)

          // David steps off the sticky before typing.
          await david.start({ ...watchOf(POS.evidenceFinal), transition: { duration: 0.55, ease: [0.22, 0.9, 0.2, 1] as [number, number, number, number] } })
          if (cancelled) return
          await sleep(200)

          await typeDraft('evidence', ['Use evidence.', 'Evidence over assumptions.'], setEvidence)
        }
      )
      if (cancelled) return
      await sleep(500)

      // David eases up to his upper-right perch as Ian returns to the stack.
      david.start({ ...percent(POS.davidPerch), transition: arrive })
      await sleep(200)

      // ── Phase 4: Ian returns to the stack, grips, drags, and types the
      //     test sticky. David + Marianne wander throughout.
      await withIdleWander(
        [
          { control: david, center: POS.davidPerch, radius: 6 },
          { control: marianne, center: POS.mariannePerch, radius: 6 },
        ],
        async () => {
          await ian.start({ ...gripOf(POS.stackPoint), transition: { ...move, duration: 1.6 } })
          if (cancelled) return
          await sleep(400)

          setStackCount(1)
          testNote.set({ ...percent(POS.testStack), rotate: POS.testStack.rotate, opacity: 1 })

          await Promise.all([
            ian.start({ ...gripOf(POS.testFinal), transition: drag }),
            testNote.start({
              ...percent(POS.testFinal),
              rotate: POS.testFinal.rotate,
              transition: drag,
            }),
          ])
          if (cancelled) return
          await sleep(300)

          // Ian steps off the sticky before typing.
          await ian.start({ ...watchOf(POS.testFinal), transition: { duration: 0.55, ease: [0.22, 0.9, 0.2, 1] as [number, number, number, number] } })
          if (cancelled) return
          await sleep(200)

          await typeDraft('test', ['Try things.', 'Test, learn, improve.'], setTest)
        }
      )
      if (cancelled) return
      await sleep(1000)

      // ── Phase 5: brief multi-person review moment
      await Promise.all([
        ian.start({ ...percent(POS.ianReview), transition: arrive }),
        marianne.start({ ...percent(POS.marianneReview), transition: arrive }),
      ])
      if (cancelled) return
      await sleep(1300)

      // ── Phase 6: everyone leaves
      await Promise.all([
        ian.start({ ...percent(POS.ianExit), opacity: 0, transition: { duration: 1.3 } }),
        david.start({ ...percent(POS.davidExit), opacity: 0, transition: { duration: 1.3 } }),
        marianne.start({ ...percent(POS.marianneExit), opacity: 0, transition: { duration: 1.4 } }),
      ])
    }

    run()
    return () => {
      cancelled = true
    }
  }, [isInView, reduceMotion, ian, david, marianne, boardBlank, evidenceNote, testNote])

  return (
    <section
      ref={rootRef}
      className="gdc"
      aria-label="Collaborative board showing qualities of good design"
    >
      <div className="gdc-board">
        <div className="gdc-note gdc-lavender gdc-one">
          Start with real user needs.
        </div>
        <div className="gdc-note gdc-mint gdc-two">
          Make the problem visible.
        </div>
        <div className="gdc-note gdc-pink gdc-three">
          Design with people, not for them.
        </div>

        <motion.div
          className="gdc-note gdc-green gdc-animated"
          animate={boardBlank}
          initial={false}
        >
          <span>{boundaries}</span>
          {typing === 'boundaries' && <span className="gdc-caret" aria-hidden="true" />}
        </motion.div>

        <motion.div
          className="gdc-note gdc-yellow gdc-animated"
          animate={evidenceNote}
          initial={false}
        >
          <span>{evidence}</span>
          {typing === 'evidence' && <span className="gdc-caret" aria-hidden="true" />}
        </motion.div>

        <motion.div
          className="gdc-note gdc-mint gdc-animated"
          animate={testNote}
          initial={false}
        >
          <span>{test}</span>
          {typing === 'test' && <span className="gdc-caret" aria-hidden="true" />}
        </motion.div>

        <div className="gdc-stack" aria-hidden="true">
          {Array.from({ length: stackCount }).map((_, index) => (
            <div key={index} className={`gdc-stack-note gdc-stack-${index + 1}`} />
          ))}
        </div>

        <Cursor label="Ian" className="gdc-ian" controls={ian} />
        <Cursor label="David" className="gdc-david" controls={david} />
        <Cursor label="Marianne" className="gdc-marianne" controls={marianne} />
      </div>
    </section>
  )
}
