'use client'

import {
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import { usePromptMemory } from '../page/once'
import type { Voice } from './Voices'

import './voices-new.css'

/**
 * Voices, rebuilt with some ambience (1 October 2026, for Jason on /quotes). The approved split:
 * the people on the warm tint with its paper grain, standing on a soft floor in the chapter's
 * colour, and the speaker's quote on white. The turn, the pen, the highlighter, the prompt and
 * the pulse are the Turntable's. The drawing is the one control: a click, Enter, Space or an
 * arrow key moves on. Without JavaScript both quotes show as a list.
 */

const noop = () => () => {}
const useEnhanced = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
const nn = (i: number) => String(i + 1).padStart(2, '0')

export function VoicesNew({
  voices,
  label = 'In their words',
  prompt = 'Alternate between the users to hear their stories',
  memoryKey = 'voices',
}: {
  voices: Voice[]
  /** The small label in the tinted bar along the card's top. */
  label?: string
  prompt?: string
  /** The prompt is remembered under this name on the page (see Prompt memory). */
  memoryKey?: string
}) {
  const enhanced = useEnhanced()
  const [used, remember] = usePromptMemory(memoryKey)
  // A count that only goes up, so the floor always turns the same way.
  const [step, setStep] = useState(0)
  const n = voices.length
  const on = step % n

  const go = (d: number) => {
    setStep((s) => s + d + (s + d < 0 ? n : 0))
    remember()
  }
  const onKey = (e: KeyboardEvent) => {
    if (['ArrowRight', 'ArrowDown', 'Enter', ' '].includes(e.key)) go(1)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(-1)
    else return
    e.preventDefault()
  }

  // A slight lean towards the pointer, a few degrees at most.
  const lean = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--ly', `${(((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(2)}deg`)
    el.style.setProperty('--lx', `${(-((e.clientY - r.top) / r.height - 0.5) * 5).toFixed(2)}deg`)
  }
  const rest = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.removeProperty('--ly')
    e.currentTarget.style.removeProperty('--lx')
  }

  if (!enhanced) {
    return (
      <ul className="vn-static">
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

  const quoteText = (v: Voice) => {
    const at = v.mark ? v.quote.indexOf(v.mark) : -1
    if (at < 0) return v.quote
    return (
      <>
        {v.quote.slice(0, at)}
        <mark className="vn__hl">{v.mark}</mark>
        {v.quote.slice(at + v.mark!.length)}
      </>
    )
  }

  return (
    <figure className="vn" style={{ '--turn': step } as CSSProperties}>
      <figcaption className="vn__bar">{label}</figcaption>
      <div
        className="vn__stage"
        role="button"
        tabIndex={0}
        aria-label="Next quote"
        onClick={() => go(1)}
        onKeyDown={onKey}
        onPointerMove={lean}
        onPointerLeave={rest}
      >
        <div className="vn__scene">
          <div className="vn__ring">
            <span className="vn__floor" />
            {voices.map((v, k) => (
              <div key={v.src} className="vn__seat" style={{ '--k': k } as CSSProperties} data-on={k === on}>
                {/* Each person is a solid shape in the tint with the lines on top, so a person
                    standing back never shows the other through them. */}
                <span className="vn__fig" style={{ aspectRatio: v.ratio }}>
                  <span
                    className="vn__fill"
                    style={{ '--fill': `url(${v.src.replace('.svg', '-fill.svg')})` } as CSSProperties}
                  />
                  {/* The lines alone: the drawings' own white fill would show on the tint. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="vn__img" src={v.src.replace('.svg', '-lines.svg')} alt="" draggable={false} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="vn__pen" src={v.src.replace('.svg', '-lines.svg')} alt="" draggable={false} />
                  {k === 0 && !used && <span className="vn__pulse" />}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="vn__bubble" data-gone={used} aria-hidden="true">
          <span>{prompt}</span>
        </p>
      </div>

      <div className="vn__side">
        <div className="vn__quotes" aria-live="polite">
          {voices.map((v, k) => (
            <blockquote key={v.src} className="vn__quote" data-on={k === on} aria-hidden={k !== on}>
              <span className="vn__mark" aria-hidden="true">
                “
              </span>
              <p>{quoteText(v)}</p>
            </blockquote>
          ))}
        </div>
        <span className="vn__count">
          {nn(on)} of {nn(n - 1)}
        </span>
      </div>
    </figure>
  )
}
