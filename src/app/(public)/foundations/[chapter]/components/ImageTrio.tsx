'use client'

import { useRef, type PointerEvent } from 'react'

import './image-trio.css'

/**
 * Three portrait photographs in equal cells. Pointing at a cell fills it with its colour and a
 * small label follows the pointer; keyboard focus does the same, with the label centred. The
 * labels are also figure captions, so screen readers get them without the hover.
 */
export type TrioItem = { id: string; src: string; alt: string; label: string; tone: string }

export function ImageTrio({ items, className = '' }: { items: TrioItem[]; className?: string }) {
  const refs = useRef<(HTMLElement | null)[]>([])

  const move = (i: number) => (e: PointerEvent<HTMLElement>) => {
    const el = refs.current[i]
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - r.left}px`)
    el.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  return (
    <div className={`trio ${className}`.trim()}>
      {items.map((it, i) => (
        <figure
          key={it.id}
          ref={(el) => {
            refs.current[i] = el
          }}
          className="trio__cell"
          style={{ '--tone': it.tone } as React.CSSProperties}
          tabIndex={0}
          onPointerMove={move(i)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="trio__img" src={it.src} alt={it.alt} loading="lazy" />
          <figcaption className="trio__label">{it.label}</figcaption>
        </figure>
      ))}
    </div>
  )
}
