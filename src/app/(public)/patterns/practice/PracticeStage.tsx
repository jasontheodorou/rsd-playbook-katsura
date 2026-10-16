'use client'

import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles/default-css-variables.css'
import type { CSSProperties, ReactNode } from 'react'

import '../../modular/two-zones.css'
import '../../modular/two-zones-mantine.css'
import type { Course } from '../../practice/content'
import '../../practice/practice.css'

/** The course's colours, as CardPage sets them on .sp-course. */
export function themeStyle(course: Course): CSSProperties {
  const [a, b] = course.theme.wash.at.split(', ')
  return {
    ['--pc-accent' as string]: course.theme.accent,
    ['--pc-deep' as string]: course.theme.deep,
    ['--pc-tint' as string]: course.theme.tint,
    ['--w-base' as string]: course.theme.wash.base,
    ['--w-a' as string]: course.theme.wash.a,
    ['--w-b' as string]: course.theme.wash.b,
    ['--w-at-a' as string]: a,
    ['--w-at-b' as string]: b,
  }
}

/**
 * A Shape your practice asset in the card's white zone, in its course's colours: the same
 * wrappers, Mantine provider and styles the course page gives it.
 */
export function PracticeStage({ course, children }: { course: Course; children: ReactNode }) {
  return (
    <MantineProvider>
      <div className="sp-course pl-sp" style={themeStyle(course)}>
        <div className="cp-card pl-sp__card">{children}</div>
      </div>
    </MantineProvider>
  )
}
