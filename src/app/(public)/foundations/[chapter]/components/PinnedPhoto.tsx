'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useState, useSyncExternalStore, type ReactNode } from 'react'

import './pinned-photo.css'

const noop = () => () => {}
const useEnhanced = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )

/**
 * Pinned photo, after the original build's PinnedPhoto: a square photograph with a yellow plane
 * behind it that settles from 0 to -3 degrees as it scrolls into view. It can carry a quotation,
 * hidden until asked for: a quote tab on the photograph's corner slides the quote out from behind
 * it as a yellow card. Without JavaScript the quote shows under the photograph.
 */
export function PinnedPhoto({
  src,
  alt,
  quote,
  className = '',
}: {
  src: string
  alt: string
  quote?: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  const enhanced = useEnhanced()
  const [open, setOpen] = useState(false)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open])

  return (
    <div className={`pin ${quote ? 'pin--quote' : ''} ${className}`.trim()} data-open={open}>
      <figure className="pin__figure">
        <motion.span
          className="pin__plane"
          aria-hidden="true"
          initial={{ rotate: reduce ? -3 : 0 }}
          whileInView={reduce ? undefined : { rotate: -3 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 2.4, ease: [0.22, 0.9, 0.2, 1] }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pin__img" src={src} alt={alt} loading="lazy" />
        {quote && enhanced && (
          <button
            type="button"
            className="pin__tab"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="pin__tab-mark" aria-hidden="true">
              {open ? '×' : '“'}
            </span>
            <span className="pin__tab-label">{open ? 'Close quote' : 'Read the quote'}</span>
          </button>
        )}
      </figure>

      {quote && !enhanced && (
        <blockquote className="pin__quote pin__quote--static">
          <p>{quote}</p>
        </blockquote>
      )}

      {quote && enhanced && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.blockquote
              id={id}
              className="pin__quote"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: -40, rotate: -3, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, rotate: -1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24, rotate: -3, scale: 0.97 }}
              transition={{ duration: reduce ? 0.15 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="pin__quote-mark" aria-hidden="true">
                &ldquo;
              </span>
              <p>{quote}</p>
            </motion.blockquote>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
