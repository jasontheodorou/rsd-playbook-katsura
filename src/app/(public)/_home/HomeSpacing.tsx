'use client'

import { useLayoutEffect, useRef } from 'react'

import { SpacingOverlay, type Space } from '../foundations/[chapter]/components/SpacingOverlay'

/** The home page's named gaps (13 October 2026), for the spacing overlay. */
const SPACES: Space[] = [
  {
    id: 'V0',
    label: 'Top bar to MVP tag',
    from: '.topbar',
    fromEdge: 'bottom',
    to: '.home__tag',
    toEdge: 'top',
    span: '.home__headline',
  },
  {
    id: 'V1',
    label: 'MVP tag to title',
    from: '.home__tag',
    fromEdge: 'bottom',
    to: '.home__headline',
    toEdge: 'top',
  },
  {
    id: 'V2',
    label: 'Title to the line below it',
    from: '.home__headline',
    fromEdge: 'bottom',
    to: '.home__lede',
    toEdge: 'top',
  },
  {
    id: 'V3',
    label: 'Line below the title to "Select a pathway"',
    from: '.home__lede',
    fromEdge: 'bottom',
    to: '.home__pathways .eyebrow--lg',
    toEdge: 'top',
  },
  {
    id: 'V4',
    label: '"Select a pathway" to the cards',
    from: '.home__pathways .eyebrow--lg',
    fromEdge: 'bottom',
    to: '.pathway-card',
    toEdge: 'top',
  },
  {
    id: 'H1',
    label: 'Card to card',
    from: '.pathway-card:first-child',
    fromEdge: 'right',
    to: '.pathway-card:last-child',
    toEdge: 'left',
  },
]

/**
 * The spacing overlay on the home page (the "Spacing" button, bottom right). The page itself is a
 * server component, so this finds the page's root once it is in the document. Never shown in a
 * production build.
 */
export function HomeSpacing() {
  const root = useRef<HTMLElement | null>(null)
  // A layout effect runs before the overlay's own effects, so the root is set when it measures.
  useLayoutEffect(() => {
    root.current = document.querySelector<HTMLElement>('.home')
  }, [])
  return <SpacingOverlay root={root} spaces={SPACES} />
}
