'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { usePromptMemory } from '../page/once'

import './stories.css'

/**
 * Stories (chapter 05, How we tell stories): the three ways our designers tell stories, each with
 * its photograph and its words on or beside it. It replaces the fanned sticky notes in "How our
 * designers tell stories" with something that holds the full width. Four looks, for comparison on
 * /stories (1 October 2026). Every look renders every item's text in the page, so screen readers
 * and readers without JavaScript get all of it.
 */

export type Story = {
  label: string
  text: string
  photo: string
  alt: string
  /** object-position for the photograph, when the crop needs it. */
  focus?: string
}

export type StoriesLook = 'panels' | 'split' | 'scroll' | 'hero'

/** The message box on Panels until the reader first opens another photograph. New copy, for sign-off. */
export const STORIES_PROMPT = 'Hover over a photo to see each way we tell stories'

const nn = (i: number) => String(i + 1).padStart(2, '0')

/** Arrow keys, Home and End move the choice along a row or list of controls. */
function useRoving(count: number, set: (i: number) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKeyDown = (e: KeyboardEvent, i: number) => {
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % count
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + count) % count
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = count - 1
    if (next < 0) return
    e.preventDefault()
    set(next)
    refs.current[next]?.focus()
  }
  return { refs, onKeyDown }
}

function Photo({ s, on, className }: { s: Story; on: boolean; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={s.photo}
      alt={s.alt}
      data-on={on}
      style={s.focus ? { objectPosition: s.focus } : undefined}
    />
  )
}

export function Stories({
  look,
  label,
  stories,
  prompt = STORIES_PROMPT,
  memoryKey = 'stories',
  bar = false,
}: {
  look: StoriesLook
  label: string
  stories: Story[]
  /** Panels only: the message box's words. */
  prompt?: string
  /** Panels only: the prompt is remembered under this name on the page (see Prompt memory). */
  memoryKey?: string
  /** Panels only: the voices card's thin warm grey strip along the top (the chapter page). */
  bar?: boolean
}) {
  if (look === 'panels')
    return <Panels label={label} stories={stories} prompt={prompt} memoryKey={memoryKey} bar={bar} />
  if (look === 'split') return <Split label={label} stories={stories} />
  if (look === 'scroll') return <Scroll label={label} stories={stories} />
  return <Hero label={label} stories={stories} />
}

/* ── 01 Panels: three photographs side by side; the chosen one opens wide with its words on it ── */

function Panels({
  label,
  stories,
  prompt,
  memoryKey,
  bar,
}: {
  label: string
  stories: Story[]
  prompt: string
  memoryKey: string
  bar: boolean
}) {
  const [on, setOn] = useState(0)
  // The message box and the pulses on the closed photographs show until the reader first opens
  // another photograph, then never again on that page.
  const [used, remember] = usePromptMemory(memoryKey)
  const choose = (i: number) => {
    if (i !== on) remember()
    setOn(i)
  }
  const { refs, onKeyDown } = useRoving(stories.length, choose)
  // The closed photographs pulse in turn, 0.35 seconds apart.
  const closed = stories.map((_, i) => i).filter((i) => i !== on)
  return (
    <div className="st st--panels" role="group" aria-label={label} data-bar={bar || undefined}>
      {stories.map((s, i) => (
        <div
          key={s.label}
          className="st-panel"
          data-on={i === on}
          onPointerEnter={(e) => e.pointerType === 'mouse' && choose(i)}
        >
          <Photo s={s} on className="st-panel__img" />
          {!used && i !== on && (
            <span
              className="st-panel__pulse"
              aria-hidden="true"
              style={{ ['--d' as string]: `${0.6 + closed.indexOf(i) * 0.35}s` }}
            />
          )}
          <button
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            className="st-panel__hit"
            aria-pressed={i === on}
            tabIndex={i === on ? 0 : -1}
            onClick={() => choose(i)}
            onFocus={() => choose(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <span className="st-panel__tag">
              <span className="st__count">{nn(i)}</span>
              <span className="st-panel__name">{s.label}</span>
            </span>
          </button>
          <div className="st-panel__card" aria-hidden={i !== on}>
            <p className="st__count">
              {nn(i)} of {nn(stories.length - 1)}
            </p>
            <h3 className="st__title">{s.label}</h3>
            <p className="st__text">{s.text}</p>
          </div>
        </div>
      ))}
      <p className="st__bubble" data-gone={used} aria-hidden="true">
        <span>{prompt}</span>
      </p>
    </div>
  )
}

/* ── 02 Split: the photograph on the left, the three ways and the chosen one's words on the right ── */

function Split({ label, stories }: { label: string; stories: Story[] }) {
  const [on, setOn] = useState(0)
  const { refs, onKeyDown } = useRoving(stories.length, setOn)
  return (
    <div className="st st--split" role="group" aria-label={label}>
      <div className="st-split__photo">
        {stories.map((s, i) => (
          <Photo key={s.label} s={s} on={i === on} className="st-fade" />
        ))}
      </div>
      <div className="st-split__side">
        <div className="st-split__list" role="tablist" aria-orientation="vertical">
          {stories.map((s, i) => (
            <button
              key={s.label}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="tab"
              className="st-split__item"
              aria-selected={i === on}
              tabIndex={i === on ? 0 : -1}
              onClick={() => setOn(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span className="st__count">{nn(i)}</span>
              <span className="st-split__name">{s.label}</span>
            </button>
          ))}
        </div>
        <div className="st-split__reading">
          {stories.map((s, i) => (
            <div key={s.label} className="st-split__pane" role="tabpanel" data-on={i === on}>
              <h3 className="st__title">{s.label}</h3>
              <p className="st__text">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── 03 Scroll: the words scroll past on the left while the photograph holds still and changes ── */

function Scroll({ label, stories }: { label: string; stories: Story[] }) {
  const [on, setOn] = useState(0)
  const steps = useRef<(HTMLDivElement | null)[]>([])
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setOn(Number((e.target as HTMLElement).dataset.i))
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    steps.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])
  return (
    <section className="st st--scroll" aria-label={label}>
      <div className="st-scroll__steps">
        {stories.map((s, i) => (
          <div
            key={s.label}
            ref={(el) => {
              steps.current[i] = el
            }}
            data-i={i}
            data-on={i === on}
            className="st-scroll__step"
          >
            <p className="st__count">
              {nn(i)} of {nn(stories.length - 1)}
            </p>
            <h3 className="st__title">{s.label}</h3>
            <p className="st__text">{s.text}</p>
            <Photo s={s} on className="st-scroll__inline" />
          </div>
        ))}
      </div>
      <div className="st-scroll__photo" aria-hidden="true">
        {stories.map((s, i) => (
          <Photo key={s.label} s={{ ...s, alt: '' }} on={i === on} className="st-fade" />
        ))}
      </div>
    </section>
  )
}

/* ── 04 Hero: one wide photograph, its words on a frosted card, the other two as thumbnails ── */

function Hero({ label, stories }: { label: string; stories: Story[] }) {
  const [on, setOn] = useState(0)
  const { refs, onKeyDown } = useRoving(stories.length, setOn)
  return (
    <div className="st st--hero" role="group" aria-label={label}>
      <div className="st-hero__photo">
        {stories.map((s, i) => (
          <Photo key={s.label} s={s} on={i === on} className="st-fade" />
        ))}
      </div>
      <div className="st-hero__card">
        {stories.map((s, i) => (
          <div key={s.label} className="st-hero__pane" data-on={i === on} role="tabpanel">
            <p className="st__count">
              {nn(i)} of {nn(stories.length - 1)}
            </p>
            <h3 className="st__title">{s.label}</h3>
            <p className="st__text">{s.text}</p>
          </div>
        ))}
      </div>
      <div className="st-hero__thumbs" role="tablist" aria-label="Choose a way">
        {stories.map((s, i) => (
          <button
            key={s.label}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="tab"
            className="st-hero__thumb"
            aria-selected={i === on}
            tabIndex={i === on ? 0 : -1}
            onClick={() => setOn(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.photo} alt="" style={s.focus ? { objectPosition: s.focus } : undefined} />
            <span className="st-hero__thumbname">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
