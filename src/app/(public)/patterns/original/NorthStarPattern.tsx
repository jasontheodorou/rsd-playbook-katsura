// Copied from the-rsd-playbook src/pathway1/NorthStarPattern.tsx for the pattern library's record of the original build.
'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import './NorthStarPattern.css'

type StarProps = {
  x: number
  y: number
  size: number
  colour: string
  rotation?: number
  rays?: number[]
  focal?: boolean
  delay?: number
}

const RAY_ANGLES = [-90, -30, 30, 90, 150, 210]

function Star({
  x,
  y,
  size,
  colour,
  rotation = 0,
  rays = [0, 1, 2, 3, 4, 5],
  focal = false,
  delay = 0,
}: StarProps) {
  const length = size * 0.48
  const inner = size * 0.10

  return (
    <motion.g
      style={{ transformOrigin: `${x}px ${y}px` }}
      initial={{ rotate: rotation }}
      animate={{ rotate: rotation }}
      variants={{
        aligned: {
          rotate: 0,
          transition: {
            type: 'spring',
            stiffness: 110,
            damping: 18,
            delay,
          },
        },
        resting: {
          rotate: rotation,
          transition: {
            type: 'spring',
            stiffness: 110,
            damping: 18,
          },
        },
      }}
    >
      {rays.map((rayIndex) => {
        const angle = (RAY_ANGLES[rayIndex] * Math.PI) / 180
        const x1 = x + Math.cos(angle) * inner
        const y1 = y + Math.sin(angle) * inner
        const x2 = x + Math.cos(angle) * length
        const y2 = y + Math.sin(angle) * length
        return (
          <line
            key={rayIndex}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={colour}
            strokeWidth={focal ? 3 : 2}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )
      })}
      <circle cx={x} cy={y} r={focal ? 5 : 3.5} fill={colour} />
    </motion.g>
  )
}

/**
 * A narrow horizontal Transform-branded star pattern. A field of small
 * incomplete stars aligns towards a shared, oversized focal star on hover
 * or focus, then relaxes back on leave. Reduced-motion users see the
 * aligned state without transitions.
 */
export function NorthStarPattern() {
  const [active, setActive] = useState(false)
  const reduceMotion = useReducedMotion()

  const state = reduceMotion ? 'aligned' : active ? 'aligned' : 'resting'

  return (
    <div
      className="north-star-pattern"
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={0}
      aria-label="A field of stars aligning towards a shared north star"
    >
      <motion.svg
        viewBox="0 0 1200 150"
        preserveAspectRatio="xMaxYMid slice"
        role="img"
        aria-hidden="true"
        initial="resting"
        animate={state}
      >
        <Star x={105}  y={49}  size={36}  colour="#619CBA" rotation={-11} rays={[0, 2, 3, 5]} delay={0} />
        <Star x={260}  y={93}  size={48}  colour="#CBD9DA" rotation={13}  rays={[0, 1, 3, 4]} delay={0.03} />
        <Star x={430}  y={51}  size={30}  colour="#D8B4A3" rotation={-18} rays={[0, 2, 4]}    delay={0.06} />
        <Star x={575}  y={99}  size={42}  colour="#F1D46E" rotation={9}   rays={[0, 1, 3, 5]} delay={0.09} />
        <Star x={735}  y={45}  size={34}  colour="#619CBA" rotation={-8}  rays={[0, 2, 3]}    delay={0.12} />
        <Star x={850}  y={102} size={28}  colour="#D8B4A3" rotation={14}  rays={[0, 1, 4]}    delay={0.15} />
        <Star x={1110} y={72}  size={210} colour="#213D59" rotation={0}   focal delay={0.18} />
        <circle cx="956" cy="42" r="4" fill="#F1D46E" />
      </motion.svg>

      <span className="north-star-pattern__label">Shared direction</span>
    </div>
  )
}
