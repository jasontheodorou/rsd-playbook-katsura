'use client'

import { useEffect, useRef, useState } from 'react'

import type { Layer } from '../landscape-map/Landscape'
import '../landscape-map/landscape.css'
import './landscape-3d.css'
import { RollCall } from './RollCall'
import type { EcoScene, ZoneId } from './scene'

/*
 * The Design Landscape map in 2.5D (approved by Jason, 29 September 2026). The same map as
 * Focus, rebuilt as a pop-up model: the ground lines lie on a white board, and the buildings,
 * trees, people and the five lines stand up on it. It opens facing forwards, with the table's
 * front corners on the tint box's edges, drifts very slightly when a region is chosen and
 * returns when the region is let go.
 * The drawings and their positions are made in ~/svg/landscape (tools/prepare-eco.mjs) and
 * copied here by its tools/export-katsura.mjs.
 */

/** Roll call's tail height and width, as in landscape-3d.css. */
const TAIL = 26

/** Inside out, which is also the order the arrow keys move in. */
const ORDER: ZoneId[] = ['individual', 'service', 'organisation', 'community', 'environment']

/** The page colour behind the block, so the space around the board matches it. */
function pageColour(el: HTMLElement): number {
  for (let n: HTMLElement | null = el; n; n = n.parentElement) {
    const m = getComputedStyle(n).backgroundColor.match(/\d+(\.\d+)?/g)
    if (m && (m.length < 4 || Number(m[3]) > 0))
      return (Number(m[0]) << 16) | (Number(m[1]) << 8) | Number(m[2])
  }
  return 0xfcfbf8
}

export function Landscape3D({
  label,
  restTitle,
  restBody,
  prompt,
  layers,
  cue,
}: {
  /** What the set of regions is, for screen readers. */
  label: string
  restTitle: string
  restBody: string
  /** What to do, for screen readers, above the table until a region is chosen. */
  prompt: string
  layers: Layer[]
  /** A message box in place of Roll call, in the same place (the /hover options). */
  cue?: React.ReactNode
}) {
  const [chosen, setChosen] = useState<ZoneId | null>(null)
  const [touched, setTouched] = useState(false)
  const [focusZone, setFocusZone] = useState<ZoneId | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const promptRef = useRef<HTMLElement | null>(null)
  const setPrompt = (el: HTMLElement | null) => {
    promptRef.current = el
  }
  const caps = useRef(new Map<ZoneId, HTMLSpanElement>())
  const radios = useRef(new Map<ZoneId, HTMLButtonElement>())
  const scene = useRef<EcoScene | null>(null)
  const chosenRef = useRef<ZoneId | null>(null)
  const byId = new Map(layers.map((l) => [l.id, l]))

  const choose = (z: ZoneId | null) => {
    chosenRef.current = z
    setChosen(z)
    if (z) setTouched(true)
  }

  // The 3D scene lives outside React; it is made once and freed when the block leaves the page.
  useEffect(() => {
    let cancelled = false
    let observer: IntersectionObserver | null = null
    let textObserver: ResizeObserver | null = null
    void import('./scene').then(({ EcoScene }) => {
      if (cancelled || !canvasRef.current || !root.current) return
      const s = new EcoScene(
        canvasRef.current,
        { onChoose: (z) => choose(z === chosenRef.current ? null : z), onHover: () => {} },
        pageColour(root.current),
      )
      scene.current = s
      // The table's front corners line up with the tint box's edges; the map takes the height
      // that then holds the board, its buildings and every line with its name.
      const text = root.current.querySelector<HTMLElement>('.lm-text')
      s.onHeight = (h) => {
        if (!mapRef.current) return
        mapRef.current.style.aspectRatio = 'auto'
        mapRef.current.style.height = `${h}px`
      }
      const alignToText = () => {
        if (!text || !canvasRef.current) return
        const c = canvasRef.current.getBoundingClientRect()
        const t = text.getBoundingClientRect()
        // Measured as a share of the canvas, so a scroll-in animation that scales the block does not skew it.
        const k = canvasRef.current.clientWidth / c.width
        // The map's top is the top of the highest name, so the page tells the scene how tall a name is.
        s.labelHeight = caps.current.values().next().value?.offsetHeight ?? 0
        s.setAlign((t.left - c.left) * k, (t.right - c.left) * k)
      }
      textObserver = new ResizeObserver(alignToText)
      if (text) textObserver.observe(text)
      alignToText()
      void document.fonts.ready.then(() => {
        if (!cancelled) alignToText()
      })
      s.onFrame = () => {
        if (mapRef.current && promptRef.current && chosenRef.current === null) {
          // The message sits in the empty band above the table, centred between the block's
          // top and the table's back-left corner.
          const r = mapRef.current.getBoundingClientRect()
          const el = promptRef.current
          const corner = s.cornersOnPage()[0]
          if (el.classList.contains('l3d-cue--left')) {
            // Roll call speaks from the table: its tail leans right and its tip sits 10px above
            // the table's back edge, 48px in from the back-left corner. The box rises from its bottom edge.
            const box = el.getBoundingClientRect()
            // Where the band above the table is too short for the box, the stage grows at its
            // top by just enough, so the box never reaches into the gap above the block.
            const stage = mapRef.current.parentElement!
            const room = Math.max(0, Math.ceil(box.height + TAIL + 10 - (corner.y - r.top)))
            if (stage.style.paddingTop !== `${room}px`) stage.style.paddingTop = `${room}px`
            const parent = (el.offsetParent ?? mapRef.current).getBoundingClientRect()
            el.style.top = `${corner.y - parent.top - 10 - TAIL}px`
            el.style.setProperty('--tail-x', `${corner.x + 48 - TAIL - box.left}px`)
          } else {
            mapRef.current.parentElement!.style.paddingTop = ''
            el.style.top = `${(corner.y - r.top) / 2}px`
          }
        }
        for (const [z, p] of s.lineTops()) {
          const c = caps.current.get(z)
          if (c) {
            c.style.left = `${p.x}px`
            c.style.top = `${p.y}px`
          }
        }
      }
      // The pulses start once the map is in view, and stop at the first choice.
      observer = new IntersectionObserver(
        (entries, obs) => {
          if (entries.some((e) => e.isIntersecting) && chosenRef.current === null) {
            s.setCue(true)
            obs.disconnect()
          }
        },
        { threshold: 0.4 },
      )
      observer.observe(mapRef.current!)
    })
    return () => {
      cancelled = true
      observer?.disconnect()
      textObserver?.disconnect()
      scene.current?.dispose()
      scene.current = null
    }
  }, [])

  useEffect(() => {
    scene.current?.choose(chosen)
  }, [chosen])
  useEffect(() => {
    if (touched) scene.current?.setCue(false)
  }, [touched])
  useEffect(() => {
    scene.current?.showFocus(focusZone)
  }, [focusZone])

  // A click anywhere outside the map and the text box lets the region go. Clicks on the map are
  // handled by the scene (the space above the table also lets it go).
  useEffect(() => {
    if (chosen === null) return
    const away = (e: PointerEvent) => {
      const t = e.target as Element | null
      if (t?.closest('.l3d-map') || t?.closest('.lm-text')) return
      choose(null)
    }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [chosen])

  // Escape lets the region go. It is caught first, so on a chapter page it does not also close
  // the chapter.
  useEffect(() => {
    if (chosen === null) return
    const onEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopImmediatePropagation()
      choose(null)
    }
    window.addEventListener('keydown', onEscape, true)
    return () => window.removeEventListener('keydown', onEscape, true)
  }, [chosen])

  const onKey = (z: ZoneId) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const i = ORDER.indexOf(z)
    const to =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? ORDER[Math.min(i + 1, ORDER.length - 1)]
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? ORDER[Math.max(i - 1, 0)]
          : e.key === 'Home'
            ? ORDER[0]
            : e.key === 'End'
              ? ORDER[ORDER.length - 1]
              : null
    if (!to) return
    e.preventDefault()
    choose(to)
    radios.current.get(to)?.focus()
  }

  const tabZone = chosen ?? 'individual'

  return (
    <div className="lm l3d" data-fit="corner" ref={root}>
      <div className="lm-stage">
        {/* The message box: Roll call unless a page passes its own (the /hover options). */}
        <div
          className={`lm-prompt l3d-cue${cue ? '' : ' l3d-cue--left'}`}
          ref={setPrompt}
          data-gone={touched}
          aria-hidden={touched}
        >
          {cue ?? <RollCall names={ORDER.map((z) => byId.get(z)?.name ?? z)} prompt={prompt} />}
        </div>
        <div className="l3d-map" ref={mapRef}>
          <div className="l3d-canvas" ref={canvasRef} />
          <div className="lm-caps" aria-hidden="true">
            {ORDER.map((z) => (
              <span
                key={z}
                className="lm-cap"
                data-on={chosen === z}
                ref={(el) => {
                  if (el) caps.current.set(z, el)
                  else caps.current.delete(z)
                }}
              >
                <span className="lm-cap__name">{byId.get(z)?.name}</span>
              </span>
            ))}
          </div>
          <noscript>
            {/* Without JavaScript, the flat drawing and every region's text show. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="l3d-flat" src="/illustrations/landscape/landscape1.svg" alt="" />
          </noscript>
        </div>
        <div className="l3d-radios" role="radiogroup" aria-label={label}>
          {ORDER.map((z) => (
            <button
              key={z}
              type="button"
              role="radio"
              aria-checked={chosen === z}
              tabIndex={tabZone === z ? 0 : -1}
              ref={(el) => {
                if (el) radios.current.set(z, el)
                else radios.current.delete(z)
              }}
              onClick={() => choose(chosen === z ? null : z)}
              onKeyDown={onKey(z)}
              onFocus={() => setFocusZone(z)}
              onBlur={() => setFocusZone(null)}
            >
              {byId.get(z)?.name}
            </button>
          ))}
        </div>
      </div>

      {/* The tint box under the drawing. Every state in one grid cell, so its height never changes. */}
      <div className="lm-text" aria-live="polite">
        <div className="lm-entry" data-on={chosen === null}>
          <h3 className="lm-entry__name">{restTitle}</h3>
          <p className="lm-entry__body">{restBody}</p>
        </div>
        {ORDER.map((z) => {
          const l = byId.get(z)
          if (!l) return null
          return (
            <div key={z} className="lm-entry" data-on={chosen === z}>
              <h3 className="lm-entry__name">{l.name}</h3>
              <p className="lm-entry__body">{l.text}</p>
            </div>
          )
        })}
      </div>

      <noscript>
        <style>{`.lm-text{display:block}.lm-entry{visibility:visible;opacity:1}.lm-entry+.lm-entry{margin-top:32px}.lm-prompt{display:none}`}</style>
      </noscript>
    </div>
  )
}
