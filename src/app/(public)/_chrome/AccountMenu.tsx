'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'

const noop = () => () => {}

/**
 * "Your account" in the top bar: a label and a small ambient circle that opens the account menu.
 * No reader accounts exist yet (they arrive with the access seam, build step 6), so the circle
 * holds a slow, soft colour drift instead of a person's initials, and the menu keeps the way in
 * to sign in. Without JavaScript the control is a plain link to sign in.
 */
export function AccountMenu() {
  const [open, setOpen] = useState(false)
  const enhanced = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
  const root = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Escape closes the menu, not the chapter behind it.
        e.stopImmediatePropagation()
        setOpen(false)
        root.current?.querySelector<HTMLButtonElement>('.account__trigger')?.focus()
      }
    }
    const onClick = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey, true)
    document.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  const face = (
    <>
      <span className="account__label">Your account</span>
      <span className="account__orb" aria-hidden="true" />
    </>
  )

  if (!enhanced) {
    return (
      <div className="account">
        <Link href="/admin" className="account__trigger">
          {face}
        </Link>
      </div>
    )
  }

  return (
    <div className="account" ref={root}>
      <button
        type="button"
        className="account__trigger"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        {face}
      </button>
      {open && (
        <div id={menuId} className="account__menu">
          <p className="account__heading">Your account</p>
          <p className="account__note">You are not signed in.</p>
          <Link href="/admin" className="account__item" onClick={() => setOpen(false)}>
            Sign in
          </Link>
        </div>
      )}
    </div>
  )
}
