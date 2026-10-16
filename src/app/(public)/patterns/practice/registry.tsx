'use client'

import { Fragment } from 'react'

import { Asset } from '../../practice/components/Asset'
import { PhotoBlock } from '../../practice/components/Photos'
import { COURSES, type Course, type DemoAsset } from '../../practice/content'
import { PHOTOS, type PhotoAsset } from '../../practice/content/photos'
import type { Accessibility, Category, LibraryPattern, WhereUsed } from '../types'
import { PracticeStage } from './PracticeStage'

/**
 * The Shape your practice patterns: the tips, resources and nine interactives a card can hold,
 * and the six photo formats. Each demo is the first real asset of its kind in the courses, in that
 * course's colours, and "where it's used" is worked out from the courses' content.
 */

const COMPONENTS = 'src/app/(public)/practice/components'

type Use = { course: Course; asset: DemoAsset; where: WhereUsed }

const ALL: Use[] = COURSES.flatMap((course) =>
  course.cards.flatMap((card) =>
    card.assets.map((asset) => ({
      course,
      asset,
      where: {
        label: `${course.title}, card ${card.n}: ${card.title}`,
        href: `/practice/${course.slug}/${card.n}`,
        ref: 'content/myp-demo.json',
      },
    })),
  ),
)

const DONE: Accessibility = { reducedMotion: 'supported', keyboard: true, hoverOnly: false, autoplay: false }
const STILL: Accessibility = { reducedMotion: 'supported', keyboard: null, hoverOnly: false, autoplay: false }

type Entry = {
  id: string
  /** The asset's component id in the plan. */
  component: string
  name: string
  category: Category
  description: string
  whatItDoes: string
  file: string
  builtWith: string[]
  packages: string[]
}

const ENTRIES: Entry[] = [
  {
    id: 'tip',
    component: 'tip',
    name: 'Top tip',
    category: 'editorial',
    description: 'A short tip set aside on a flat tonal fill, with an icon in the course’s colour.',
    whatItDoes:
      'An aside on the pale warm surface, led by a small lightbulb icon in the course’s colour. It holds one or two sentences of advice beside the card’s words.',
    file: 'Boxes.tsx',
    builtWith: ['Phosphor icons'],
    packages: ['@phosphor-icons/react'],
  },
  {
    id: 'resource',
    component: 'resource',
    name: 'Useful resource',
    category: 'editorial',
    description: 'A lifted card for a link: the source as a badge, the title as the link, and a summary.',
    whatItDoes:
      'An elevated white card with an icon, the source in a small badge, the resource’s title as the link and one line on what it is. It points readers to guidance outside the Playbook.',
    file: 'Boxes.tsx',
    builtWith: ['Phosphor icons'],
    packages: ['@phosphor-icons/react'],
  },
  {
    id: 'image',
    component: 'image',
    name: 'Image with brief',
    category: 'image',
    description: 'A photograph in a tonal frame, or a placeholder showing its brief until a photo is chosen.',
    whatItDoes:
      'Shows the photograph the plan names, cropped to 3:2 in a tonal frame. Where no photo fits yet, the frame shows the photo’s brief instead, so the gap is visible and the brief is not lost.',
    file: 'Boxes.tsx',
    builtWith: ['figure'],
    packages: ['@phosphor-icons/react'],
  },
  {
    id: 'slider',
    component: 'slider',
    name: 'Slider',
    category: 'interactive',
    description: 'One position per stop; moving it changes a picture drawn from the data.',
    whatItDoes:
      'Moving the slider shows each stop’s label and state, updates the picture and the value, and shows the lesson once the last stop is reached. Out of 100, the picture is a crowd of figures; per 1,000 letters, it is a letter and a counter.',
    file: 'Slider.tsx',
    builtWith: ['native range input', 'SVG', 'live region'],
    packages: [],
  },
  {
    id: 'step',
    component: 'step',
    name: 'Step through',
    category: 'interactive',
    description: 'Each press adds the next step under the last, so a chain builds.',
    whatItDoes:
      'Next adds the following step under the ones already shown; Previous removes the last. It suits a sequence where each step follows from the one before.',
    file: 'StepThrough.tsx',
    builtWith: ['live region'],
    packages: [],
  },
  {
    id: 'flip',
    component: 'flip',
    name: 'Flip cards',
    category: 'interactive',
    description: 'Cards with an icon and a name that turn over to show the text and what it looks like.',
    whatItDoes:
      'Each card’s front has a round tinted icon and a name. Pressing it turns it to its back, with the manual’s text and what it looks like in practice; pressing again turns it back. Each face hides halfway through the turn, so Safari never shows it mirrored.',
    file: 'FlipCards.tsx',
    builtWith: ['CSS 3D transforms', 'Mantine ThemeIcon', 'Phosphor duotone icons'],
    packages: ['@mantine/core', '@phosphor-icons/react'],
  },
  {
    id: 'match',
    component: 'match',
    name: 'Match',
    category: 'interactive',
    description: 'Choose an item on the left, then its partner on the right.',
    whatItDoes:
      'A correct pair locks and shows why; a wrong pair shakes once and clears. When everything is matched, a summary line appears. The shuffle is fixed, so the order is the same on every visit.',
    file: 'Match.tsx',
    builtWith: ['live region'],
    packages: [],
  },
  {
    id: 'spot',
    component: 'spot',
    name: 'Spot the problem',
    category: 'interactive',
    description: 'A mock screen built in HTML with its faults really present, to find one by one.',
    whatItDoes:
      'Each fault is a button over its part of the screen. Pressing one marks it found and opens its note under the scene, and a count says how many are found. Show all reveals the rest at any point.',
    file: 'SpotProblem.tsx',
    builtWith: ['HTML mock form', 'live region'],
    packages: [],
  },
  {
    id: 'before',
    component: 'before',
    name: 'Before and after',
    category: 'interactive',
    description: 'Two options swap a real example form field; the notes stay put.',
    whatItDoes:
      'A two-option radio group swaps between the poor and the better version of a real form field, so screen readers hear the actual messages. The notes explaining the difference stay in place.',
    file: 'BeforeAfter.tsx',
    builtWith: ['radio group', 'real form fields'],
    packages: [],
  },
  {
    id: 'map',
    component: 'map',
    name: 'Map explorer',
    category: 'interactive',
    description: 'A centre with nodes around it; each node shows what it asks for and what it shares.',
    whatItDoes:
      'Selecting a node shows its moments and what it asks for, and marks anything another node also asks for. After three nodes have been looked at, the insight appears.',
    file: 'MapExplorer.tsx',
    builtWith: ['SVG', 'live region'],
    packages: [],
  },
  {
    id: 'check',
    component: 'check',
    name: 'Quick check',
    category: 'interactive',
    description: 'Choose one option or several, then Check; feedback shows by word and icon.',
    whatItDoes:
      'Each chosen option shows its feedback with a word and an icon, never colour alone. Try again clears the answer. After a correct answer, a short follow-up appears.',
    file: 'QuickCheck.tsx',
    builtWith: ['radio or checkbox group', 'live region'],
    packages: [],
  },
  {
    id: 'choose',
    component: 'choose',
    name: 'Choose and see',
    category: 'interactive',
    description: 'Each option plays out its outcome; the lesson appears once the best one is seen.',
    whatItDoes:
      'The reader picks an option and sees what happens as a result. Any option can be tried. Once the best one has been seen, the lesson appears.',
    file: 'ChooseSee.tsx',
    builtWith: ['live region'],
    packages: [],
  },
]

function assetDemo(use: Use | undefined) {
  function Demo() {
    if (!use) return null
    return (
      <PracticeStage course={use.course}>
        <Asset asset={use.asset} />
      </PracticeStage>
    )
  }
  return Demo
}

const assetPatterns: LibraryPattern[] = ENTRIES.map((e) => {
  const uses = ALL.filter((u) => u.asset.component === e.component)
  const interactive = e.category === 'interactive'
  return {
    id: e.id,
    name: e.name,
    source: 'practice',
    category: e.category,
    status: uses.length ? 'live' : 'built',
    description: e.description,
    whatItDoes: e.whatItDoes,
    whereUsed: uses.map((u) => u.where),
    trigger: interactive ? 'press' : 'mount',
    weight: 'light',
    accessibility: interactive ? DONE : STILL,
    builtWith: e.builtWith,
    files: [`${COMPONENTS}/${e.file}`, ...(interactive ? [`${COMPONENTS}/Frame.tsx`] : []), 'src/app/(public)/practice/practice.css'],
    packages: e.packages,
    demo: assetDemo(uses[0]),
    stageWidth: 880,
  }
})

/* ── Photo formats ── */

const FORMAT_NAMES: Record<PhotoAsset['format'], string> = {
  frame: 'Tonal frame',
  pair: 'Pair',
  card: 'Card with image',
  tabs: 'Tabbed photos',
  background: 'Background image',
  badged: 'Badged image',
}

const placedPhotos = PHOTOS.map((p) => ({
  ...p,
  course: COURSES.find((c) => c.n === p.course),
})).filter((p): p is typeof p & { course: Course } => Boolean(p.course))

function PhotoFormatsDemo() {
  const course = placedPhotos[0]?.course
  if (!course) return null
  return (
    <PracticeStage course={course}>
      {placedPhotos.map((p, i) => (
        <Fragment key={i}>
          <p className="pl-demo-label">{FORMAT_NAMES[p.asset.format]}</p>
          <PhotoBlock asset={p.asset} />
        </Fragment>
      ))}
    </PracticeStage>
  )
}

function PhotoFormatsCard() {
  const p = placedPhotos.find((x) => x.asset.format === 'background') ?? placedPhotos[0]
  if (!p) return null
  return (
    <PracticeStage course={p.course}>
      <PhotoBlock asset={p.asset} />
    </PracticeStage>
  )
}

const photoPattern: LibraryPattern = {
  id: 'photo-formats',
  name: 'Photo formats',
  source: 'practice',
  category: 'image',
  status: placedPhotos.length ? 'live' : 'built',
  description: 'Six ways to show a photograph in a card, chosen from twenty Mantine formats.',
  whatItDoes:
    'Tonal frame, pair, card with image, tabbed photos, background image and badged image, each built from Mantine in the cards’ Transform palette and elevation. Every photo is used in exactly one place in the build.',
  whereUsed: placedPhotos.map((p) => {
    const card = p.course.cards.find((c) => c.n === p.card)
    return {
      label: `${p.course.title}, card ${p.card}${card ? `: ${card.title}` : ''} (${FORMAT_NAMES[p.asset.format].toLowerCase()})`,
      href: `/practice/${p.course.slug}/${p.card}`,
      ref: 'content/photos.ts',
    }
  }),
  trigger: 'mount',
  weight: 'light',
  accessibility: { reducedMotion: 'supported', keyboard: true, hoverOnly: false, autoplay: false },
  builtWith: ['Mantine Card, BackgroundImage, Overlay, Badge, Image, SimpleGrid, Tabs, Paper'],
  files: [`${COMPONENTS}/Photos.tsx`, 'src/app/(public)/practice/content/photos.ts'],
  packages: ['@mantine/core'],
  demo: PhotoFormatsDemo,
  cardDemo: PhotoFormatsCard,
  stageWidth: 880,
}

export const PRACTICE_PATTERNS: LibraryPattern[] = [...assetPatterns, photoPattern]
