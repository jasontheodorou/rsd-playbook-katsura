// Copied from the-rsd-playbook src/pathway1/KenBurnsImage.tsx for the pattern library's record of the original build.
'use client'

import { motion, useReducedMotion } from 'motion/react'

/**
 * Ken Burns image — slow zoom + subtle pan toward a focal point, once
 * the image scrolls into view. Meant to be dropped inside an existing
 * clipped container (e.g. `.p1v2__media`) so the container owns width
 * and aspect ratio; this component just adds motion to the img.
 */

type Focal =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

const PAN: Record<Focal, { x: string; y: string }> = {
  center:         { x: '0%',    y: '0%'    },
  top:            { x: '0%',    y: '-1.5%' },
  bottom:         { x: '0%',    y: '1.5%'  },
  left:           { x: '-1.5%', y: '0%'    },
  right:          { x: '1.5%',  y: '0%'    },
  'top-left':     { x: '-1%',   y: '-1%'   },
  'top-right':    { x: '1%',    y: '-1%'   },
  'bottom-left':  { x: '-1%',   y: '1%'    },
  'bottom-right': { x: '1%',    y: '1%'    },
}

type Props = {
  src: string
  alt: string
  /** Focal point the camera drifts toward. Defaults to center. */
  focal?: Focal
  /** Zoom-and-pan duration in seconds. Default 8s. */
  duration?: number
  /** Final zoom factor. Default 1.05. */
  scale?: number
}

export function KenBurnsImage({
  src,
  alt,
  focal = 'center',
  duration = 8,
  scale = 1.05,
}: Props) {
  const reduceMotion = useReducedMotion()
  const pan = PAN[focal]

  if (reduceMotion) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" />
  }

  return (
    <motion.img
      src={src}
      alt={alt}
      loading="lazy"
      initial={{ scale: 1, x: '0%', y: '0%' }}
      whileInView={{ scale, x: pan.x, y: pan.y }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration, ease: 'easeOut' }}
      style={{ transformOrigin: 'center center' }}
    />
  )
}
