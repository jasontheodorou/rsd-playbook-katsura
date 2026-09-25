'use client'

import type { PointerEvent, ReactNode } from 'react'

/**
 * Material press ripple: a warm circle grows from the pointer inside the pressed row's summary.
 * Purely decorative; the details element underneath works without it.
 */
export function RippleSet({ className, children }: { className: string; children: ReactNode }) {
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const summary = (e.target as HTMLElement).closest('summary')
    if (!summary || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = summary.getBoundingClientRect()
    const size = Math.hypot(r.width, r.height) * 2
    const dot = document.createElement('span')
    dot.className = 'md-ripple'
    dot.style.width = dot.style.height = `${size}px`
    dot.style.left = `${e.clientX - r.left - size / 2}px`
    dot.style.top = `${e.clientY - r.top - size / 2}px`
    summary.appendChild(dot)
    dot.addEventListener('animationend', () => dot.remove())
  }
  return (
    <div className={className} onPointerDown={onPointerDown}>
      {children}
    </div>
  )
}
