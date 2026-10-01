'use client'

import {
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import { usePromptMemory } from '../page/once'

import './voices.css'

/**
 * Voices (chapter 05, What we care about): two people's quotes, explored one at a time. On the
 * chapter it is the Turntable, sketched in then highlighted, approved by Jason on 1 October 2026
 * ("It's great"); /quotes and /quotes/flourish keep the other treatments for comparison. Every version is one hairline card the data path's size: the sketches stay
 * ink on white, a slight 3D move carries one person away and brings the other in, and the quote
 * changes with them. The drawing is the one control: a click, Enter, Space or an arrow key moves
 * on to the other person. Without JavaScript both quotes show as a list.
 */

export type Voice = {
  /** The drawing, trimmed to its drawn edges. */
  src: string
  /** Width over height of the trimmed drawing. */
  ratio: number
  quote: string
  /** The words the highlighter sweeps behind (Highlighter sweep only). */
  mark?: string
}

export type Flourish = 'highlight' | 'plane' | 'shadow' | 'sketch'

export type Look = 'turntable' | 'cube' | 'shuffle' | 'facing' | 'popup'

const noop = () => () => {}
const useEnhanced = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
const nn = (i: number) => String(i + 1).padStart(2, '0')

/** A few hand-drawn hatch lines, cast back and to the right of the speaker on the floor. */
const HATCH = [
  'M8 30 L22 6',
  'M20 32 L36 5',
  'M33 33 L50 4',
  'M47 33 L63 5',
  'M61 32 L76 7',
  'M75 30 L88 9',
  'M89 27 L98 12',
]

export function Voices({
  look,
  voices,
  flourish,
  memoryKey = 'voices',
  bar = false,
  paper = false,
}: {
  look: Look
  voices: Voice[]
  /** One flourish, or several played together. */
  flourish?: Flourish | Flourish[]
  /** The prompt is remembered under this name on the page (see Prompt memory). */
  memoryKey?: string
  /** A thin bar in the tint box's yellow along the card's top (the chapter page). */
  bar?: boolean
  /** The card on watercolour paper: the speaker's lines on a white fill, the other's lines only. */
  paper?: boolean
}) {
  const enhanced = useEnhanced()
  // The speech bubble and the pulse on the first person's jumper show until the reader first
  // moves on, then never again on that page.
  const [used, remember] = usePromptMemory(memoryKey)
  const fl = new Set(flourish === undefined ? [] : ([] as Flourish[]).concat(flourish))
  // A count that only goes up, so a turn always carries on in the same direction.
  const [step, setStep] = useState(0)
  const n = voices.length
  const on = step % n
  const stage = useRef<HTMLDivElement>(null)

  const go = (d: number) => {
    setStep((s) => s + d + (s + d < 0 ? n : 0))
    remember()
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') go(1)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(-1)
    else return
    e.preventDefault()
  }

  // A slight lean towards the pointer, a few degrees at most.
  const lean = (e: PointerEvent) => {
    const el = stage.current
    if (!el || e.pointerType === 'touch') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--ly', `${(x * 8).toFixed(2)}deg`)
    el.style.setProperty('--lx', `${(-y * 5).toFixed(2)}deg`)
  }
  const rest = () => {
    stage.current?.style.removeProperty('--ly')
    stage.current?.style.removeProperty('--lx')
  }

  // The shuffle: the front print swings out to the side and tucks in behind as the back one comes
  // forward. Each print's resting pose is in the styles; this only plays the move between them.
  const last = useRef(step)
  useLayoutEffect(() => {
    if (look !== 'shuffle' || last.current === step) return
    last.current = step
    const el = stage.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const prints = [...el.querySelectorAll<HTMLElement>('.qv-sh__print')]
    const front = 'translate3d(-50%, -50%, 0) rotateZ(-2deg)'
    const back = 'translate3d(calc(-50% + 9%), calc(-50% - 7%), -90px) rotateZ(3deg)'
    prints.forEach((p, k) => {
      const coming = k === on
      p.animate(
        coming
          ? [
              { transform: back },
              { transform: 'translate3d(calc(-50% + 22%), calc(-50% - 4%), -40px) rotateZ(4deg)', offset: 0.45 },
              { transform: front },
            ]
          : [
              { transform: front },
              { transform: 'translate3d(calc(-50% - 58%), -50%, 60px) rotateZ(-9deg) rotateY(16deg)', offset: 0.45 },
              { transform: back },
            ],
        { duration: 900, easing: 'cubic-bezier(0.45, 0, 0.2, 1)' },
      )
    })
  }, [look, step, on])

  if (!enhanced) {
    return (
      <ul className="qv-static">
        {voices.map((v) => (
          <li key={v.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.src} alt="" width={120} />
            <blockquote>{v.quote}</blockquote>
          </li>
        ))}
      </ul>
    )
  }

  // Each person is a solid white shape with the lines on top. Only the lines fade, so a person
  // stepping back never shows the other through them.
  // On paper the lines come from the line-only copy, so the person stepping back shows no white.
  const lines = (v: Voice) => (paper ? v.src.replace('.svg', '-lines.svg') : v.src)
  const drawing = (v: Voice, pulse = false) => (
    <span className="qv__fig" style={{ aspectRatio: v.ratio }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="qv__fill" src={v.src.replace('.svg', '-fill.svg')} alt="" draggable={false} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="qv__img" src={lines(v)} alt="" draggable={false} />
      {fl.has('sketch') && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="qv__pen" src={lines(v)} alt="" draggable={false} />
      )}
      {pulse && !used && <span className="qv__pulse" />}
    </span>
  )

  const quoteText = (v: Voice) => {
    const at = fl.has('highlight') && v.mark ? v.quote.indexOf(v.mark) : -1
    if (at < 0) return v.quote
    return (
      <>
        {v.quote.slice(0, at)}
        <mark className="qv__hl">{v.mark}</mark>
        {v.quote.slice(at + v.mark!.length)}
      </>
    )
  }

  return (
    <figure className="qv" data-bar={bar || undefined} data-paper={paper || undefined} data-look={look} data-flourish={[...fl].join(' ') || undefined} style={{ ['--turn' as string]: step }}>
      <div
        ref={stage}
        className="qv__stage"
        role="button"
        tabIndex={0}
        aria-label="Next quote"
        onClick={() => go(1)}
        onKeyDown={onKey}
        onPointerMove={lean}
        onPointerLeave={rest}
      >
        <div className="qv__scene">
          {look === 'turntable' && (
            <div className="qv-tt__ring">
              <span className="qv-tt__floor" />
              {voices.map((v, k) => (
                <div key={v.src} className="qv-tt__seat" style={{ ['--k' as string]: k }} data-on={k === on}>
                  {fl.has('plane') && <span className="qv-fl__plane" />}
                  {fl.has('shadow') && (
                    <svg className="qv-fl__hatch" viewBox="0 0 100 36" preserveAspectRatio="none">
                      {HATCH.map((d, h) => (
                        <path key={d} d={d} pathLength={1} style={{ ['--h' as string]: h }} />
                      ))}
                    </svg>
                  )}
                  {drawing(v, k === 0)}
                </div>
              ))}
            </div>
          )}

          {look === 'cube' && (
            <>
              <span className="qv-cb__shadow" />
              <div className="qv-cb__cube">
                {[0, 1, 2, 3].map((f) => (
                  <div key={f} className="qv-cb__face" style={{ ['--f' as string]: f }}>
                    {drawing(voices[f % n], f === 0)}
                  </div>
                ))}
                <div className="qv-cb__cap qv-cb__cap--top" />
                <div className="qv-cb__cap qv-cb__cap--bottom" />
              </div>
            </>
          )}

          {look === 'shuffle' &&
            voices.map((v, k) => (
              <div key={v.src} className="qv-sh__print" data-on={k === on}>
                {drawing(v, k === 0)}
              </div>
            ))}

          {look === 'facing' &&
            voices.map((v, k) => (
              <div key={v.src} className="qv-fc__person" data-side={k === 0 ? 'right' : 'left'} data-on={k === on}>
                {drawing(v, k === 0)}
              </div>
            ))}

          {look === 'popup' &&
            voices.map((v, k) => (
              <div key={v.src} className="qv-pu__leaf" data-on={k === on}>
                <span className="qv-pu__shadow" />
                {drawing(v, k === 0)}
              </div>
            ))}
        </div>
        <p className="qv__bubble" data-gone={used} aria-hidden="true">
          <span>Alternate between the users to hear their stories</span>
        </p>
      </div>

      <div className="qv__side">
        <div className="qv__quotes" aria-live="polite">
          {voices.map((v, k) => (
            <blockquote key={v.src} className="qv__quote" data-on={k === on} aria-hidden={k !== on}>
              <span className="qv__mark" aria-hidden="true">
                “
              </span>
              <p>{quoteText(v)}</p>
            </blockquote>
          ))}
        </div>
        <div className="qv__foot">
          <span className="qv__count">
            {nn(on)} of {nn(n - 1)}
          </span>
        </div>
      </div>
    </figure>
  )
}
