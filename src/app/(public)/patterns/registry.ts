'use client'

import { FOUNDATIONS_PATTERNS, MARKS_PATTERN } from './foundations/registry'
import { PRACTICE_PATTERNS } from './practice/registry'
import type { Category, LibraryPattern, Source, Status } from './types'

/**
 * The pattern library's single list: every graphical and interactive pattern on a page of the
 * Playbook now, worked out from the pages' own content. Patterns not on a page are left out.
 */
export const PATTERNS: LibraryPattern[] = [
  ...FOUNDATIONS_PATTERNS,
  MARKS_PATTERN,
  ...PRACTICE_PATTERNS,
].filter((p) => p.status === 'live')

export const findPattern = (id: string) => PATTERNS.find((p) => p.id === id)

export const SOURCES: { id: Source; label: string; description: string }[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    description: 'Patterns used in the Foundations chapters.',
  },
  {
    id: 'practice',
    label: 'Shape your practice',
    description: 'Patterns used in the Shape your practice courses.',
  },
]

export const CATEGORY_LABEL: Record<Category, string> = {
  motion: 'Motion',
  image: 'Image',
  editorial: 'Editorial',
  interactive: 'Interactive',
  layout: 'Layout',
}

export const STATUS_LABEL: Record<Status, string> = {
  live: 'In the Playbook',
  built: 'Not yet placed',
  superseded: 'Kept as a record',
}
