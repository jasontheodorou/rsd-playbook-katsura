'use client'

import { useEffect, useRef, useState } from 'react'

const KEY = 'katsura:demo-started'

/**
 * The demo's opening screen (13 October 2026): black, with one white "Start demo" button in the
 * middle. It covers the first full load of the site in a tab, and fades away to the page beneath
 * when the button is pressed. It is part of the layout, so moving around the site never brings it
 * back; it shows again in a new tab, or with `?demo` in the address. Rendered with the page, so
 * nothing shows before it; a small script hides it before the first paint once it has been used in
 * this tab. Without JavaScript it is never shown.
 */
export function DemoGate() {
  const [state, setState] = useState<'shown' | 'leaving' | 'gone'>('shown')
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(KEY) === '1' && !new URLSearchParams(location.search).has('demo')
    } catch {
      // Storage unavailable: show the screen.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads this tab's memory once
    if (seen) setState('gone')
    // Focus for keyboard users, without the focus ring showing on a mouse user's first view.
    else button.current?.focus({ focusVisible: false } as FocusOptions)
  }, [])

  if (state === 'gone') return null

  const start = () => {
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      // Storage unavailable: it still opens for this load.
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setState('gone')
    else setState('leaving')
  }

  return (
    <div
      className="demo-gate"
      data-leaving={state === 'leaving' || undefined}
      role="dialog"
      aria-modal="true"
      aria-label="The RSD Playbook demo"
      suppressHydrationWarning
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && state === 'leaving') setState('gone')
      }}
    >
      <script
        // Hide the screen before the first paint once it has been used in this tab.
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem('${KEY}')==='1'&&!/[?&]demo\\b/.test(location.search))document.currentScript.parentElement.style.display='none'}catch(e){}`,
        }}
      />
      <noscript>
        <style>{'.demo-gate{display:none!important}'}</style>
      </noscript>
      <button ref={button} type="button" className="demo-gate__start" onClick={start}>
        Start demo
      </button>
    </div>
  )
}
