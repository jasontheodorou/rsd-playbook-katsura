import type { ComponentType } from 'react'

/**
 * The pattern library's entry shape. Carried over from the original build's library
 * (the-rsd-playbook, src/patterns-library/registry.ts, August 2026) and extended for katsura:
 * a pattern now says which part of the Playbook it belongs to, and an original pattern that has
 * been rebuilt points at the pattern that replaced it.
 */

/** Which part of the Playbook a pattern belongs to. */
export type Source = 'foundations' | 'practice' | 'home' | 'original'

/** What kind of thing it is. */
export type Category = 'motion' | 'image' | 'editorial' | 'interactive' | 'layout'

/**
 * Where a pattern stands.
 *  'live'       rendering on a page of the Playbook now.
 *  'built'      finished and working, but not yet placed on a page.
 *  'superseded' from the original build; kept as a record, replaced or retired in katsura.
 */
export type Status = 'live' | 'built' | 'superseded'

/** How much work the pattern does at run time. */
export type Weight = 'light' | 'medium' | 'heavy'

/** What starts it. Drives the "Play again" control on the pattern page. */
export type Trigger = 'mount' | 'inView' | 'scroll' | 'press'

export type Accessibility = {
  /** Does it render a complete, readable state under prefers-reduced-motion? */
  reducedMotion: 'supported' | 'partial' | 'none'
  /** Can it be operated from the keyboard? Null where there is nothing to operate. */
  keyboard: boolean | null
  /** Does any content depend on hover alone? */
  hoverOnly: boolean
  /** Does it animate without being asked? */
  autoplay: boolean
}

export type WhereUsed = {
  /** The page, in the reader's language. */
  label: string
  /** A link to the page, where it has one. */
  href?: string
  /** Source reference, such as 'content/who-we-are.tsx'. */
  ref?: string
}

export type Alternative = {
  name: string
  note: string
  demo?: ComponentType
}

export type LibraryPattern = {
  id: string
  name: string
  source: Source
  category: Category
  status: Status
  /** One line, on the card and under the title. */
  description: string
  /** Prose, two or three sentences, on the pattern page. */
  whatItDoes: string
  whereUsed: WhereUsed[]
  trigger: Trigger
  weight: Weight
  accessibility: Accessibility
  builtWith: string[]
  /** Files a developer would need. The first entry is the pattern itself. */
  files: string[]
  packages: string[]
  alsoConsidered?: Alternative[]
  /** For a superseded pattern: the id of the katsura pattern that replaced it, if any. */
  replacedBy?: string
  /** The live pattern, mounted from the same component the page uses. */
  demo: ComponentType
  /** A thumbnail version, for patterns whose page demo does not read small. */
  cardDemo?: ComponentType
  /** The width, in pixels, the demo is laid out at before it is scaled into a card. Default 1200. */
  stageWidth?: number
}
