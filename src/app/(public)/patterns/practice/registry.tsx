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
    description: 'A short piece of advice, set apart from the text, with a lightbulb icon.',
    whatItDoes:
      'A pale box with a small lightbulb icon. It holds one or two sentences of advice.',
    file: 'Boxes.tsx',
    builtWith: ['Phosphor icons'],
    packages: ['@phosphor-icons/react'],
  },
  {
    id: 'resource',
    component: 'resource',
    name: 'Useful resource',
    category: 'editorial',
    description: 'A link to useful guidance outside the Playbook.',
    whatItDoes:
      'A white card with the name of the source, the title as a link and a one-line summary.',
    file: 'Boxes.tsx',
    builtWith: ['Phosphor icons'],
    packages: ['@phosphor-icons/react'],
  },
  {
    id: 'image',
    component: 'image',
    name: 'Photo or photo brief',
    category: 'image',
    description: 'A photo, or a description of the photo needed if none has been chosen yet.',
    whatItDoes:
      'Shows the planned photo in a soft frame. If no photo has been chosen yet, the frame describes the photo needed, so the gap is easy to spot.',
    file: 'Boxes.tsx',
    builtWith: ['figure'],
    packages: ['@phosphor-icons/react'],
  },
  {
    id: 'slider',
    component: 'slider',
    name: 'Slider',
    category: 'interactive',
    description: 'Move the slider to change a picture made from real figures.',
    whatItDoes:
      'Each position shows a label and updates the picture and the number. The lesson shows when you reach the end. Depending on the figures, the picture is a crowd of people or a letter with a count.',
    file: 'Slider.tsx',
    builtWith: ['native range input', 'SVG', 'live region'],
    packages: [],
  },
  {
    id: 'step',
    component: 'step',
    name: 'Step through',
    category: 'interactive',
    description: 'Press Next to add each step under the last, so a chain builds up.',
    whatItDoes:
      'Next adds the next step and Previous removes the last one. It suits steps where each one leads to the next.',
    file: 'StepThrough.tsx',
    builtWith: ['live region'],
    packages: [],
  },
  {
    id: 'flip',
    component: 'flip',
    name: 'Flip cards',
    category: 'interactive',
    description: 'Cards that turn over to show more.',
    whatItDoes:
      'The front of each card has an icon and a name. Press it to turn it over and see the text and an example. Press again to turn it back.',
    file: 'FlipCards.tsx',
    builtWith: ['CSS 3D transforms', 'Mantine ThemeIcon', 'Phosphor duotone icons'],
    packages: ['@mantine/core', '@phosphor-icons/react'],
  },
  {
    id: 'match',
    component: 'match',
    name: 'Match',
    category: 'interactive',
    description: 'Match each item on the left with its pair on the right.',
    whatItDoes:
      'A correct pair stays together and shows why it matches. A wrong pair shakes and clears. When everything is matched, a summary shows, and the order is the same on every visit.',
    file: 'Match.tsx',
    builtWith: ['live region'],
    packages: [],
  },
  {
    id: 'spot',
    component: 'spot',
    name: 'Spot the problem',
    category: 'interactive',
    description: 'A mock screen with real mistakes in it for you to find.',
    whatItDoes:
      'Press any part of the screen you think is wrong. If it is a mistake, it is marked and a note explains it. A count shows how many you have found, and Show all reveals the rest.',
    file: 'SpotProblem.tsx',
    builtWith: ['HTML mock form', 'live region'],
    packages: [],
  },
  {
    id: 'before',
    component: 'before',
    name: 'Before and after',
    category: 'interactive',
    description: 'Switch between a poor and a better version of the same form field.',
    whatItDoes:
      'Two options switch between the versions. Screen readers read out the real messages from each, so everyone can compare them. The notes on the difference stay in place.',
    file: 'BeforeAfter.tsx',
    builtWith: ['radio group', 'real form fields'],
    packages: [],
  },
  {
    id: 'map',
    component: 'map',
    name: 'Map explorer',
    category: 'interactive',
    description: 'A central point with linked points around it. Choose one to see what it asks for and shares.',
    whatItDoes:
      'Choosing a point shows what it needs and highlights anything other points also ask for. After you have looked at three points, the main insight shows.',
    file: 'MapExplorer.tsx',
    builtWith: ['SVG', 'live region'],
    packages: [],
  },
  {
    id: 'check',
    component: 'check',
    name: 'Quick check',
    category: 'interactive',
    description: 'A short question with one or more answers to choose.',
    whatItDoes:
      'Choose your answer and press Check. Each answer shows feedback with a word and an icon, so it does not rely on colour alone. Try again clears it, and a follow-up shows after a correct answer.',
    file: 'QuickCheck.tsx',
    builtWith: ['radio or checkbox group', 'live region'],
    packages: [],
  },
  {
    id: 'choose',
    component: 'choose',
    name: 'Choose and see',
    category: 'interactive',
    description: 'Pick an option and see what happens.',
    whatItDoes:
      'You can try any option, and each one shows what would happen as a result. The lesson shows once you have seen the best option.',
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
  description: 'Six ways to show a photo in a course card.',
  whatItDoes:
    'Framed, in a pair, in a card, in tabs, behind text, and with a label. Each photo appears in only one place in the Playbook.',
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
