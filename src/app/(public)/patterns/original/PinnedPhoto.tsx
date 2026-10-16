// Copied from the-rsd-playbook src/pathway1/PinnedPhoto.tsx for the pattern library's record of the original build.
'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Media } from '@/app/(public)/foundations/[chapter]/hhh/Media'

/**
 * PinnedPhoto — L50-style square photo with a yellow plane behind it.
 * When the photo scrolls into view, the plane settles from 0° into its
 * resting rotation (~-3°) over ~2.4s — the visual metaphor of pinning
 * the print to the wall. Left-aligned within its container.
 */

type Props = {
  src: string
  alt: string
  /** Max width of the photo. Default 480px. */
  maxWidth?: number
  /** Final rotation of the plane in degrees. Default -3. */
  rotate?: number
}

export function PinnedPhoto({ src, alt, maxWidth = 480, rotate = -3 }: Props) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className="ly-layered ly-layered--tl ly-layered--yellow"
      style={{ maxWidth }}
    >
      <motion.span
        className="ly-layered__plane"
        aria-hidden="true"
        initial={{ rotate: reduceMotion ? rotate : 0 }}
        whileInView={reduceMotion ? undefined : { rotate }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 2.4, ease: [0.22, 0.9, 0.2, 1] }}
        style={{ transformOrigin: 'center' }}
      />
      <Media shape="square" src={src} alt={alt} />
    </div>
  )
}
