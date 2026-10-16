// Copied from the-rsd-playbook src/pages/superpower/stage.tsx for the pattern library's record of the original build.
'use client'

import { useEffect, useRef, useState } from 'react'

/* ── Shared plumbing for the five executions ───────────────────────────────
   part2.svg is 62 loose paths with no classes. The 20 coloured ones all sit
   as flat siblings inside <g id="Icons">, four colours among them. We fetch
   the asset once, inject it, then wrap each colour's paths in a plain <g
   data-icon="…"> so each icon can be addressed and transformed as a unit.
   Wrapping is safe because the paths share one parent, so a transform-less
   <g> doesn't change how anything renders.                                */

export const VB = { w: 908, h: 279 }

export type IconKey = 'clay' | 'paleblue' | 'yellow' | 'palegrey'

export type IconDef = {
  key: IconKey
  colour: string
  title: string
  body: string
  /* bbox in viewBox units, measured from the live asset */
  box: { x: number; y: number; w: number; h: number }
}

export const ICONS: IconDef[] = [
  {
    key: 'clay',
    colour: '#D8B4A3',
    title: 'Invite people in',
    body: 'Participation starts with an open invitation. We bring people into the work rather than consulting them once the decisions are already made.',
    box: { x: 110, y: 48, w: 74, h: 106 },
  },
  {
    key: 'paleblue',
    colour: '#619CBA',
    title: 'Listen properly',
    body: 'Real dialogue, not a feedback form. We surface what people actually need — including the things they find hard to put into words.',
    box: { x: 322, y: 60, w: 135, h: 104 },
  },
  {
    key: 'yellow',
    colour: '#F1D46E',
    title: 'Make it together',
    body: 'Ideas get built alongside the people who will use and run the service. Making together is how understanding stops being ours and becomes shared.',
    box: { x: 564, y: 29, w: 137, h: 110 },
  },
  {
    key: 'palegrey',
    colour: '#CBD9DA',
    title: 'Let it take root',
    body: 'The aim is work that outlives us — embedded in the culture of a programme, so the change is one people actually want to sustain.',
    box: { x: 764, y: 27, w: 72, h: 106 },
  },
]

const FILL_TO_KEY: Record<string, IconKey> = {
  'rgb(216,180,163)': 'clay',
  'rgb(97,156,186)': 'paleblue',
  'rgb(241,212,110)': 'yellow',
  'rgb(203,217,218)': 'palegrey',
}

/* One fetch for the whole page, however many stages mount. */
let pending: Promise<string> | null = null
function loadAsset(): Promise<string> {
  if (!pending) {
    pending = fetch('/illustrations/part2.svg')
      .then((r) => r.text())
      // Drop the XML declaration and DOCTYPE — innerHTML wants markup only.
      .then((t) => t.slice(t.indexOf('<svg')))
  }
  return pending
}

function groupIcons(svg: SVGSVGElement) {
  const icons = svg.querySelector('#Icons')
  if (!icons || icons.querySelector('g[data-icon]')) return

  const buckets = new Map<IconKey, Element[]>()
  icons.querySelectorAll('path').forEach((p) => {
    const fill = getComputedStyle(p).fill.replace(/\s+/g, '')
    const key = FILL_TO_KEY[fill]
    if (!key) return
    const list = buckets.get(key) ?? []
    list.push(p)
    buckets.set(key, list)
  })

  buckets.forEach((paths, key) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.setAttribute('data-icon', key)
    icons.insertBefore(g, paths[0])
    paths.forEach((p) => g.appendChild(p))
  })
}

/** Injects the asset and reports when the icon groups exist. */
export function useIllustration() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    loadAsset().then((markup) => {
      const host = hostRef.current
      if (!alive || !host) return
      host.innerHTML = markup
      const svg = host.querySelector('svg')
      if (svg) {
        // Let CSS own the size; the viewBox keeps the aspect ratio.
        svg.removeAttribute('width')
        svg.removeAttribute('height')
        groupIcons(svg as SVGSVGElement)
      }
      setReady(true)
    })
    return () => { alive = false }
  }, [])

  return { hostRef, ready }
}

/** Percentage geometry for overlaying HTML on the illustration. */
export function pct(box: IconDef['box'], pad = 8) {
  return {
    left:   `${((box.x - pad) / VB.w) * 100}%`,
    top:    `${((box.y - pad) / VB.h) * 100}%`,
    width:  `${((box.w + pad * 2) / VB.w) * 100}%`,
    height: `${((box.h + pad * 2) / VB.h) * 100}%`,
  }
}

/** Centre of an icon, as page percentages. */
export function centre(box: IconDef['box']) {
  return {
    x: ((box.x + box.w / 2) / VB.w) * 100,
    y: ((box.y + box.h / 2) / VB.h) * 100,
  }
}
