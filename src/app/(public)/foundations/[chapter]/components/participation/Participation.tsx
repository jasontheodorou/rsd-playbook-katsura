'use client'

import { Inter } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'

import { usePromptMemory } from '../../page/once'
import type { JourneyStep } from '../Journey'
import '../landscape-3d/landscape-3d.css'
import { RollCall } from '../landscape-3d/RollCall'
import './participation.css'
import type { ParticipationScene } from './scene'
import { drawWash } from './wash'

/** The names that pop up over the drawings are set in Inter (Jason, 2 October 2026). */
const inter = Inter({ subsets: ['latin'], weight: '800', display: 'swap' })

/*
 * The participation model in 2.5D (approved by Jason, 2 October 2026). Four rings lie as white bands
 * on the page, one inside the next, and the hand, speech bubbles, pencils and flower stand up on them
 * as white cut-outs with orange accents, over a soft yellow wash centred on the model, which stays
 * still while the model tilts. It tilts a
 * little up and down when dragged, and never draws outside its box. Clicking a drawing lifts it a
 * little and its step's name pops up over it as an orange word in Inter, with a few small hollow
 * orange bubbles.
 * Until the first click, Roll call speaks above it and soft blue pulses rise under each drawing, as
 * on the Design Landscape (prompt memory: gone for good on this page after the first click).
 * Its explainer tabs are a separate block, ParticipationSteps, further down the page.
 * The drawings are made in ~/svg/landscape (tools/prepare-tpm.mjs; participation.html there).
 */
export function Participation({
  prompt,
  lead,
  steps,
}: {
  /** What to do, for screen readers, until the first drawing is clicked. */
  prompt: string
  /** Roll call's words, standing still (no names cycle through). */
  lead: string
  steps: JourneyStep[]
}) {
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const wash = useRef<SVGSVGElement>(null)
  const cue = useRef<HTMLDivElement>(null)
  const scene = useRef<ParticipationScene | null>(null)
  const [clicked, setClicked] = useState(false)
  const [remembered, remember] = usePromptMemory('participation')
  const touched = clicked || remembered
  const rememberedRef = useRef(remembered)
  const rememberRef = useRef(remember)
  useEffect(() => {
    rememberedRef.current = remembered
    rememberRef.current = remember
    if (remembered) scene.current?.setCue(false)
  })

  useEffect(() => {
    let live = true
    let resize: ResizeObserver | null = null
    let view: IntersectionObserver | null = null
    void import('./scene').then(({ ParticipationScene }) => {
      if (!live || !canvas.current || !stage.current) return
      const box = stage.current
      const s = new ParticipationScene(canvas.current)
      s.names = Object.fromEntries(steps.map((st) => [st.id, st.name]))
      s.nameFont = `${inter.style.fontFamily}, system-ui, sans-serif`
      void document.fonts.load(`800 96px ${inter.style.fontFamily}`)
      // Room round the rings for the wash, all inside the box, the same above and below so the model
      // sits centred, with room at the top for a name popping up over the tallest drawings.
      const fit = () => {
        const w = box.clientWidth
        s.margin.side = Math.round(w * 0.06)
        s.margin.top = s.margin.bottom = Math.round(w * 0.11)
        s.fit()
      }
      const place = () => {
        const b = s.restBoxes()
        if (wash.current) drawWash(wash.current, { w: box.clientWidth, h: box.clientHeight }, b.all)
        // Roll call speaks from the band above the drawings: its tail's tip 10px above the outer ring
        const c = cue.current
        if (c) c.style.top = `${Math.max(c.offsetHeight + 26, b.ring.y0 - 10)}px`
      }
      s.onHeight = (h) => {
        box.style.height = `${h}px`
        requestAnimationFrame(place)
      }
      // the first click puts the prompt away for good on this page
      s.onPlay = () => {
        setClicked(true)
        rememberRef.current()
        s.setCue(false)
      }
      resize = new ResizeObserver(fit)
      resize.observe(box)
      fit()
      // the pulses start once the model is in view
      view = new IntersectionObserver(
        (entries, obs) => {
          if (entries.some((e) => e.isIntersecting) && !rememberedRef.current) {
            s.setCue(true)
            obs.disconnect()
          }
        },
        { threshold: 0.4 },
      )
      view.observe(box)
      scene.current = s
    })
    return () => {
      live = false
      resize?.disconnect()
      view?.disconnect()
      scene.current?.destroy()
      scene.current = null
    }
  }, [steps])

  return (
    <div className="pm">
      <div className="pm-stage" ref={stage}>
        <svg className="pm-wash" ref={wash} aria-hidden="true" />
        <div className="pm-canvas" ref={canvas} />
        <div className="pm-cue" ref={cue} data-gone={touched} aria-hidden={touched}>
          <RollCall names={[]} prompt={prompt} lead={lead} />
        </div>
      </div>
    </div>
  )
}
