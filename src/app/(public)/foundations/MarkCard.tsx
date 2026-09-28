'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

import type { ComponentProps } from 'react'

const MotionLink = motion.create(Link)

/** A Foundations card. Pointing at it or focusing it moves its mark through the "hover" variant. */
export function MarkCard(props: ComponentProps<typeof MotionLink>) {
  return (
    <MotionLink {...props} initial="rest" animate="rest" whileHover="hover" whileFocus="hover" />
  )
}
