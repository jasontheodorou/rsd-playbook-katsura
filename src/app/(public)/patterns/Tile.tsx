'use client'

import { useEffect, useRef, useState } from 'react'

import type { LibraryPattern } from './types'

/**
 * A card's thumbnail: the real pattern, laid out at its stage width and scaled to fit the tile.
 * It mounts only once the tile nears the window, so the index does not start fifty patterns at
 * once, and it is inert: out of the tab order and the accessibility tree.
 */
export function Tile({ pattern }: { pattern: LibraryPattern }) {
  const box = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [near, setNear] = useState(false)
  const Demo = pattern.cardDemo ?? pattern.demo
  const stage = pattern.stageWidth ?? 1200

  useEffect(() => {
    const el = box.current
    if (!el) return
    const size = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    size.observe(el)
    const view = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true)
          view.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )
    view.observe(el)
    return () => {
      size.disconnect()
      view.disconnect()
    }
  }, [])

  // A little inside the tile, so the tint shows round the pattern.
  const scale = width ? (width * 0.86) / stage : 0

  return (
    <div ref={box} className={`pl-tile pl-tint--${pattern.source}`} aria-hidden="true" inert>
      {near && scale > 0 && (
        <div className="pl-tile__scale" style={{ width: stage, transform: `translate(-50%, -50%) scale(${scale})` }}>
          <Demo />
        </div>
      )}
    </div>
  )
}
