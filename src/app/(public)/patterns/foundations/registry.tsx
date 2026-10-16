'use client'

import { useState, type ComponentType } from 'react'

import { chapters } from '../../foundations/chapters'
import { Accordion } from '../../foundations/[chapter]/components/Accordion'
import { FrameworkPill } from '../../foundations/[chapter]/components/FrameworkPill'
import { CHAPTER_CONTENT } from '../../foundations/[chapter]/content'
import type { Block } from '../../foundations/[chapter]/page/types'
import type { Accessibility, LibraryPattern, WhereUsed } from '../types'
import { BlockStage } from './BlockStage'

/**
 * The Foundations patterns. Each demo is the first real block of its kind in the chapters, so it
 * shows the words and photographs the page shows; "where it's used" is worked out from the
 * chapters' content, so it cannot go out of date. Behaviour and rules come from
 * docs/DESIGN-RULES.md.
 */

const COMPONENTS = 'src/app/(public)/foundations/[chapter]/components'

type Use = { block: Block; where: WhereUsed }

/** Every block in every built chapter, with the chapter it sits in. */
const ALL: Use[] = chapters.flatMap((c) =>
  (CHAPTER_CONTENT[c.slug]?.blocks ?? []).map((block) => ({
    block,
    where: {
      label: c.title,
      href: `/foundations/${c.slug}`,
      ref: `content/${c.slug}.tsx`,
    },
  })),
)

/** The chapters that use blocks matching `test`, each named once. */
function whereUsed(test: (b: Block) => boolean): WhereUsed[] {
  const seen = new Set<string>()
  return ALL.filter((u) => test(u.block))
    .map((u) => u.where)
    .filter((w) => (seen.has(w.label) ? false : (seen.add(w.label), true)))
}

/** The first block matching `test`, for the demo. */
function first(test: (b: Block) => boolean): Block | undefined {
  return ALL.find((u) => test(u.block))?.block
}

/** A demo that renders `block` on the chapter grid, or nothing if no chapter has one. */
function stage(block: Block | undefined) {
  function Demo() {
    return block ? <BlockStage block={block} /> : null
  }
  return Demo
}

const is =
  <K extends Block['kind']>(kind: K) =>
  (b: Block): b is Extract<Block, { kind: K }> =>
    b.kind === kind

const isPart = is('part')

const STILL: Accessibility = { reducedMotion: 'supported', keyboard: null, hoverOnly: false, autoplay: false }
const CHOOSE: Accessibility = { reducedMotion: 'supported', keyboard: true, hoverOnly: false, autoplay: false }
const PROMPTED: Accessibility = { reducedMotion: 'supported', keyboard: true, hoverOnly: false, autoplay: true }

type Entry = Omit<LibraryPattern, 'source' | 'whereUsed' | 'demo' | 'status'> & {
  test: (b: Block) => boolean
  /** The block to show when no chapter uses one (a pattern built but not placed). */
  fallback?: () => Block | undefined
  /** A demo of its own, for a pattern that is not a whole block. */
  demo?: ComponentType
}

/** Blocks from the chapters, reshaped for patterns that are built but no longer placed. */
const diagramBlock = first(is('diagram')) as Extract<Block, { kind: 'diagram' }> | undefined
const mapBlock = first(is('landscapeMap')) as Extract<Block, { kind: 'landscapeMap' }> | undefined
const stepsBlock = first(is('participationSteps')) as
  | Extract<Block, { kind: 'participationSteps' }>
  | undefined

const ENTRIES: Entry[] = [
  /* ── Image ── */
  {
    id: 'photo',
    name: 'Photo with coloured panel',
    category: 'image',
    description: 'A wide photo with a pale blue panel set just behind it.',
    whatItDoes:
      'A pale blue panel sits behind the photo, a little down and to the right. It frames the photo without a border.',
    test: is('photo'),
    trigger: 'mount',
    weight: 'light',
    accessibility: STILL,
    builtWith: ['CSS grid'],
    files: [`${COMPONENTS}/PhotoWithPlane.tsx`, `${COMPONENTS}/photo-with-plane.css`],
    packages: [],
  },
  {
    id: 'part',
    name: 'Section with photo',
    category: 'image',
    description: 'A heading, a wide photo and text. The panel behind the photo moves slightly as you scroll.',
    whatItDoes:
      'Each section of a chapter has a heading, a wide photo and text. As you scroll, the coloured panel behind the photo moves a little. Its colour and position change from section to section, so pages do not look the same.',
    test: (b) => isPart(b) && Boolean(b.photo),
    trigger: 'scroll',
    weight: 'medium',
    accessibility: STILL,
    builtWith: ['motion useScroll', 'ChapterScrollContext'],
    files: [`${COMPONENTS}/PartSection.tsx`, `${COMPONENTS}/PartMedia.tsx`, `${COMPONENTS}/part-section.css`],
    packages: ['motion'],
  },
  {
    id: 'pinned',
    name: 'Photo with hidden quote',
    category: 'image',
    description: 'A square photo that tilts slightly as you reach it, with a quote you can pull out.',
    whatItDoes:
      'The photo sits on a yellow panel that tilts slightly as you scroll to it. Pressing “Read the quote” slides a quote out from behind the photo. The button pulses until someone uses it.',
    test: is('pinned'),
    trigger: 'inView',
    weight: 'light',
    accessibility: CHOOSE,
    builtWith: ['motion', 'usePromptMemory'],
    files: [`${COMPONENTS}/PinnedPhoto.tsx`, `${COMPONENTS}/pinned-photo.css`],
    packages: ['motion'],
  },
  {
    id: 'trio',
    name: 'Three photos',
    category: 'image',
    description: 'Three photos side by side. Each one fills with colour and shows a label when you point at it.',
    whatItDoes:
      'Three tall photos in a row. When you point at one, it fills with colour and shows its label.',
    test: is('trio'),
    trigger: 'press',
    weight: 'light',
    accessibility: { reducedMotion: 'supported', keyboard: true, hoverOnly: false, autoplay: false },
    builtWith: ['CSS'],
    files: [`${COMPONENTS}/ImageTrio.tsx`, `${COMPONENTS}/image-trio.css`],
    packages: [],
  },
  {
    id: 'polaroids',
    name: 'Polaroids',
    category: 'image',
    description: 'Up to three photos shown as tilted prints with handwritten captions.',
    whatItDoes:
      'The photos overlap at slight angles, like prints on a table. Pointing at one straightens it and brings it to the front.',
    test: is('polaroids'),
    trigger: 'press',
    weight: 'light',
    accessibility: { reducedMotion: 'supported', keyboard: true, hoverOnly: false, autoplay: false },
    builtWith: ['motion'],
    files: [`${COMPONENTS}/Polaroids.tsx`, `${COMPONENTS}/polaroids.css`],
    packages: ['motion'],
  },
  {
    id: 'stack',
    name: 'Stacking cards',
    category: 'motion',
    description: 'Cards that stack on top of each other as you scroll.',
    whatItDoes:
      'As you scroll, each card stops near the top of the screen and the next one slides over it. Each card has a short title and a photo. On small screens the cards sit one under another.',
    test: is('stack'),
    trigger: 'scroll',
    weight: 'medium',
    accessibility: STILL,
    builtWith: ['position: sticky', 'motion useScroll', 'ChapterScrollContext'],
    files: [`${COMPONENTS}/StackCards.tsx`, `${COMPONENTS}/stack-cards.css`],
    packages: ['motion'],
  },
  {
    id: 'hhh-wall',
    name: 'Wall that builds itself',
    category: 'motion',
    description: 'The head, heart and hands drawing, built up piece by piece as you reach it.',
    whatItDoes:
      'The drawing is cut into three posters and seven notes. When you reach it, the posters drop into place one by one, then the notes follow. Pointing at a poster makes it swing gently.',
    test: is('hhhWall'),
    trigger: 'inView',
    weight: 'medium',
    accessibility: { reducedMotion: 'supported', keyboard: null, hoverOnly: false, autoplay: true },
    builtWith: ['motion springs', 'hhh-pieces.ts'],
    files: [`${COMPONENTS}/HhhWall.tsx`, `${COMPONENTS}/hhh-wall.css`, `${COMPONENTS}/hhh-pieces.ts`],
    packages: ['motion'],
  },
  {
    id: 'illustration',
    name: 'Illustration',
    category: 'image',
    description: 'A drawing trimmed to its edge, on the page’s own paper, with no frame.',
    whatItDoes:
      'A transparent drawing trimmed to what is drawn, so the gaps above and below are measured from the drawing. It sits at 74% of the content width. Chapter 03 replaced it with the self-building wall.',
    test: is('illustration'),
    fallback: () => ({
      kind: 'illustration',
      src: '/illustrations/head-heart-hands.png',
      alt: 'A sketch of head, heart and hands.',
    }),
    trigger: 'mount',
    weight: 'light',
    accessibility: STILL,
    builtWith: ['img'],
    files: [`src/app/(public)/foundations/[chapter]/page/FoundationsChapter.tsx`],
    packages: [],
  },

  /* ── Editorial ── */
  {
    id: 'quote',
    name: 'Quote card',
    category: 'editorial',
    description: 'One quote on a yellow card.',
    whatItDoes:
      'A yellow card with a large speech mark and the quote in bold.',
    test: is('quote'),
    trigger: 'mount',
    weight: 'light',
    accessibility: STILL,
    builtWith: ['CSS grid'],
    files: [`${COMPONENTS}/QuoteCard.tsx`, `${COMPONENTS}/quote-card.css`],
    packages: [],
  },
  {
    id: 'boxout',
    name: 'Boxout',
    category: 'editorial',
    description: 'A white box that sets a few key points apart from the text.',
    whatItDoes:
      'A white box with a small coloured bar, a short label and a list of points. It breaks up long stretches of text.',
    test: (b) => b.kind === 'boxout' || (isPart(b) && Boolean(b.boxout)),
    trigger: 'mount',
    weight: 'light',
    accessibility: STILL,
    builtWith: ['CSS'],
    files: [`${COMPONENTS}/Boxout.tsx`, `${COMPONENTS}/boxout.css`],
    packages: [],
  },
  {
    id: 'fan',
    name: 'Sticky notes',
    category: 'motion',
    description: 'Two or three points on a stack of sticky notes that spread out when you point at them.',
    whatItDoes:
      'The notes sit in a stack with the top one readable. Pointing at the stack, or selecting it, spreads the notes into a row. On the first stack on a page, a speech bubble prompts you to try it.',
    test: (b) => isPart(b) && Boolean(b.fan),
    trigger: 'press',
    weight: 'light',
    accessibility: PROMPTED,
    builtWith: ['CSS transforms', 'usePromptMemory'],
    files: [`${COMPONENTS}/NoteFan.tsx`, `${COMPONENTS}/note-fan.css`],
    packages: [],
  },
  {
    id: 'framework',
    name: 'Head, heart and hands marks',
    category: 'editorial',
    description: 'Three small drawings under a chapter title. They show which of head, heart and hands the chapter covers.',
    whatItDoes:
      'The chapter’s own mark is in colour and the other two are grey. They are decoration and do not link anywhere.',
    test: () => false,
    trigger: 'mount',
    weight: 'light',
    accessibility: STILL,
    builtWith: ['inline SVG'],
    files: [`${COMPONENTS}/FrameworkPill.tsx`, `${COMPONENTS}/framework-pill.css`],
    packages: [],
  },

  /* ── Interactive ── */
  {
    id: 'accordion',
    name: 'Accordion',
    category: 'interactive',
    description: 'Sections that open and close.',
    whatItDoes:
      'Each row has a title and a round button, and open rows are a shade darker. All the text loads with the page, so nothing is lost if the interactive parts fail.',
    test: is('accordion'),
    trigger: 'press',
    weight: 'light',
    accessibility: CHOOSE,
    builtWith: ['details and summary'],
    files: [`${COMPONENTS}/Accordion.tsx`, `${COMPONENTS}/accordion.css`],
    packages: [],
  },
  {
    id: 'accordion-small',
    name: 'Small accordion',
    category: 'interactive',
    description: 'A short list inside a written part, one line per row, each lead-in as its title.',
    whatItDoes:
      'The quiet accordion at reading width: one 56px row per point, its lead-in as the title. It sits 32px under a written part’s text. No chapter uses it now, so the demo shows Who we are’s accordion sections in it.',
    test: (b) => isPart(b) && Boolean(b.items?.length),
    demo: SmallAccordionDemo,
    trigger: 'press',
    weight: 'light',
    accessibility: CHOOSE,
    builtWith: ['details and summary'],
    files: [`${COMPONENTS}/Accordion.tsx`, `${COMPONENTS}/PartSection.tsx`],
    packages: [],
  },
  {
    id: 'tabs',
    name: 'Tabs',
    category: 'interactive',
    description: 'Roles or options side by side in one card, each with a drawing or photo.',
    whatItDoes:
      'Choose a tab to see its panel. Each panel has a drawing and text. The card stays the same height whichever tab is open, so the page does not jump.',
    test: is('tabs'),
    trigger: 'press',
    weight: 'light',
    accessibility: CHOOSE,
    builtWith: ['ARIA tabs', 'motion'],
    files: [`${COMPONENTS}/TShapedTabs.tsx`, `${COMPONENTS}/t-shaped-tabs.css`],
    packages: ['motion'],
  },
  {
    id: 'diagram',
    name: 'Benefits card',
    category: 'interactive',
    description: 'Five items around one central idea. Choose an item to read about it.',
    whatItDoes:
      'Five circles sit around the central idea. Choosing one shows its text and photo alongside. A speech bubble and pulsing circles prompt you until you make your first choice.',
    test: (b) => b.kind === 'diagram' && b.items.some((it) => it.photo),
    trigger: 'press',
    weight: 'medium',
    accessibility: PROMPTED,
    builtWith: ['SVG connectors', 'usePromptMemory'],
    files: [`${COMPONENTS}/BenefitsCard.tsx`, `${COMPONENTS}/benefits-card.css`],
    packages: ['motion'],
  },
  {
    id: 'diagram-refined',
    name: 'Refined diagram',
    category: 'interactive',
    description: 'The first refined component: five frosted tiles round a centre, a reading panel beside.',
    whatItDoes:
      'The gold standard for refined components: frosted surfaces, hairlines, light line icons and one slate accent for the chosen line. It was replaced on Why design matters by the benefits card, which adds photographs and a clearer prompt.',
    test: (b) => b.kind === 'diagram' && !b.items.some((it) => it.photo),
    fallback: () =>
      diagramBlock && {
        ...diagramBlock,
        items: diagramBlock.items.map(({ photo: _photo, ...it }) => it),
      },
    trigger: 'press',
    weight: 'medium',
    accessibility: CHOOSE,
    builtWith: ['SVG connectors', 'Phosphor icons'],
    files: [`${COMPONENTS}/Diagram.tsx`, `${COMPONENTS}/diagram.css`],
    packages: ['@phosphor-icons/react', 'motion'],
  },
  {
    id: 'balance',
    name: 'Balance sliders',
    category: 'interactive',
    description: 'Sliders that move between a bad habit and good practice.',
    whatItDoes:
      'Each row has a slider between two opposite ends. Move it past the middle and the row shows the full text. A count shows how many rows are in balance, and a speech bubble prompts you until you first move a slider.',
    test: is('balance'),
    trigger: 'press',
    weight: 'medium',
    accessibility: PROMPTED,
    builtWith: ['native range inputs', 'usePromptMemory'],
    files: [`${COMPONENTS}/Balance.tsx`, `${COMPONENTS}/balance.css`],
    packages: ['@phosphor-icons/react', 'motion'],
  },
  {
    id: 'data-path',
    name: 'Data path',
    category: 'interactive',
    description: 'Five points rising along a line. Choose one to read about it.',
    whatItDoes:
      'The points rise like a line on a chart. Choosing one fills the line up to that point and shows its text alongside.',
    test: is('dataPath'),
    trigger: 'press',
    weight: 'medium',
    accessibility: PROMPTED,
    builtWith: ['SVG', 'measured layout', 'usePromptMemory'],
    files: [`${COMPONENTS}/DataPath.tsx`, `${COMPONENTS}/data-path.css`],
    packages: ['motion'],
  },
  {
    id: 'landscape-map',
    name: 'Design Landscape map',
    category: 'interactive',
    description: 'The hand-drawn Design Landscape. Choose an area to read about it.',
    whatItDoes:
      'The main feature of chapter 04. Choosing one of five areas fades the rest of the drawing, highlights that area and shows its text below. Until you choose, a speech bubble cycles through the area names.',
    test: is('landscapeMap'),
    trigger: 'press',
    weight: 'heavy',
    accessibility: PROMPTED,
    builtWith: ['Three.js', 'SVG', 'radio group', 'usePromptMemory'],
    files: [`${COMPONENTS}/landscape-3d/Landscape3D.tsx`, `${COMPONENTS}/landscape-3d/RollCall.tsx`, `${COMPONENTS}/landscape-3d/landscape-3d.css`],
    packages: ['three', 'motion'],
  },
  {
    id: 'landscape',
    name: 'Design Landscape, nested frames',
    category: 'interactive',
    description: 'Five nested frames on a tint, chosen by label, with the layer’s text on white.',
    whatItDoes:
      'The first draft of chapter 04’s landscape: five frames nest 32px apart, each a step more frosted, and the labels are the only control. The chosen frame gains an ink hairline while the rest step back. Replaced by the Design Landscape map.',
    test: is('landscape'),
    fallback: () =>
      mapBlock && {
        kind: 'landscape',
        label: mapBlock.label,
        restTitle: mapBlock.restTitle,
        restBody: mapBlock.restBody,
        layers: mapBlock.layers,
      },
    trigger: 'press',
    weight: 'light',
    accessibility: CHOOSE,
    builtWith: ['CSS grid', 'radio group'],
    files: [`${COMPONENTS}/DesignLandscape.tsx`, `${COMPONENTS}/design-landscape.css`],
    packages: ['motion'],
  },
  {
    id: 'voices',
    name: 'Voices',
    category: 'interactive',
    description: 'Quotes from two people, one at a time, with a drawing of each.',
    whatItDoes:
      'The two drawings stand on a turning floor. The one at the front is speaking, and their quote shows beside them with a few words highlighted. Press the drawing to turn to the other person.',
    test: is('voices'),
    trigger: 'press',
    weight: 'medium',
    accessibility: PROMPTED,
    builtWith: ['CSS transitions', 'usePromptMemory'],
    files: [`${COMPONENTS}/Voices.tsx`, `${COMPONENTS}/voices.css`],
    packages: [],
  },
  {
    id: 'stories',
    name: 'Story panels',
    category: 'interactive',
    description: 'Three photos side by side. Choose one and it opens wide to show its story.',
    whatItDoes:
      'Each closed photo is faded, with its name on a tag. Pointing at one, or selecting it, opens it across most of the width with its story on a card. The height stays the same, so the page does not jump.',
    test: is('stories'),
    trigger: 'press',
    weight: 'medium',
    accessibility: PROMPTED,
    builtWith: ['CSS flex transitions', 'backdrop-filter', 'usePromptMemory'],
    files: [`${COMPONENTS}/Stories.tsx`, `${COMPONENTS}/stories.css`],
    packages: [],
  },
  {
    id: 'participation',
    name: 'Participation model',
    category: 'interactive',
    description: 'The participation model as four rings, with a drawing on each.',
    whatItDoes:
      'The main feature of chapter 06. The four rings sit one inside the other, and dragging tilts the model slightly. Pressing a drawing lifts it and shows the name of that step.',
    test: is('participation'),
    trigger: 'press',
    weight: 'heavy',
    accessibility: PROMPTED,
    builtWith: ['Three.js', 'canvas wash', 'usePromptMemory'],
    files: [
      `${COMPONENTS}/participation/Participation.tsx`,
      `${COMPONENTS}/participation/scene.ts`,
      `${COMPONENTS}/participation/wash.ts`,
      `${COMPONENTS}/participation/participation.css`,
    ],
    packages: ['three'],
  },
  {
    id: 'participation-steps',
    name: 'Participation steps',
    category: 'interactive',
    description: 'The four steps of the participation model, one tab for each step.',
    whatItDoes:
      'Each tab shows the step’s name, a short summary, the full text and a small copy of its drawing. The height stays the same whichever tab is open.',
    test: is('participationSteps'),
    trigger: 'press',
    weight: 'light',
    accessibility: CHOOSE,
    builtWith: ['ARIA tabs'],
    files: [`${COMPONENTS}/participation/ParticipationSteps.tsx`, `${COMPONENTS}/participation/participation.css`],
    packages: [],
  },
  {
    id: 'journey',
    name: 'Journey',
    category: 'interactive',
    description: 'Ordered steps in a row on a tinted band, the chosen step’s text on white below.',
    whatItDoes:
      'Each step is a numbered dot, a name and its lead-in, joined by a quiet line through the dots. The steps are the only control. A first draft for chapter 06, replaced by the participation model.',
    test: is('journey'),
    fallback: () =>
      stepsBlock && {
        kind: 'journey',
        label: stepsBlock.label,
        restTitle: 'The participation model',
        restBody: 'Choose a step to read about it.',
        steps: stepsBlock.steps,
      },
    trigger: 'press',
    weight: 'light',
    accessibility: CHOOSE,
    builtWith: ['CSS grid', 'radio group'],
    files: [`${COMPONENTS}/Journey.tsx`, `${COMPONENTS}/journey.css`],
    packages: ['motion'],
  },
]

/** No chapter uses the small accordion now, so it is shown with Who we are's accordion sections. */
function SmallAccordionDemo() {
  const acc = first(is('accordion')) as Extract<Block, { kind: 'accordion' }> | undefined
  if (!acc) return null
  return (
    <div className="fc pl-fc">
      <div className="container fc__grid pl-fc__grid">
        <div className="fc__main">
          <div className="fc__block fc__block--text pl-fc__block">
            <Accordion small sections={acc.sections} />
          </div>
        </div>
      </div>
    </div>
  )
}

function FrameworkDemo() {
  return (
    <div className="pl-framework">
      <FrameworkPill part="head" />
      <FrameworkPill part="heart" />
      <FrameworkPill part="hands" />
    </div>
  )
}

export const FOUNDATIONS_PATTERNS: LibraryPattern[] = ENTRIES.map(({ test, fallback, demo, ...e }) => {
  const used =
    e.id === 'framework'
      ? chapters
          .filter((c) => CHAPTER_CONTENT[c.slug]?.framework)
          .map((c) => ({ label: c.title, href: `/foundations/${c.slug}`, ref: `content/${c.slug}.tsx` }))
      : whereUsed(test)
  return {
    ...e,
    source: 'foundations',
    status: used.length ? 'live' : 'built',
    whereUsed: used,
    demo: demo ?? (e.id === 'framework' ? FrameworkDemo : stage(first(test) ?? fallback?.())),
    stageWidth: e.id === 'framework' ? 480 : e.stageWidth,
  }
})

/* ── Chapter marks: not a block, but every chapter's landing card and end carry one ── */

function MarksDemo() {
  const [read, setRead] = useState(false)
  return (
    <div className="pl-marks">
      <ul className="pl-marks__row">
        {chapters.map(({ slug, title, Mark }) => (
          <li key={slug} className="pl-marks__item">
            <Mark className="pl-marks__mark" read={read} />
            <span className="pl-marks__name">{title}</span>
          </li>
        ))}
      </ul>
      <button type="button" className="pl-button" aria-pressed={read} onClick={() => setRead((r) => !r)}>
        {read ? 'Show as unread' : 'Show as read'}
      </button>
    </div>
  )
}

export const MARKS_PATTERN: LibraryPattern = {
  id: 'chapter-marks',
  name: 'Chapter marks',
  source: 'foundations',
  category: 'motion',
  status: 'live',
  description: 'Each chapter’s drawn symbol. It is grey until you read the chapter, then it turns to colour.',
  whatItDoes:
    'Each chapter has its own symbol in a circle. Unread chapters show it as a grey outline, and once you have read a chapter it fills with colour. At the end of an unread chapter, the outline draws itself as you reach it.',
  whereUsed: [
    { label: 'Explore the foundations, one card per chapter', href: '/foundations', ref: 'foundations/page.tsx' },
    { label: 'The end of every chapter', ref: 'foundations/[chapter]/ChapterEnd.tsx' },
  ],
  trigger: 'press',
  weight: 'light',
  accessibility: { reducedMotion: 'supported', keyboard: null, hoverOnly: false, autoplay: false },
  builtWith: ['inline SVG', 'motion variants'],
  files: [
    'src/app/(public)/foundations/marks.tsx',
    'src/app/(public)/foundations/foundation-marks.css',
    'src/app/(public)/foundations/MarkCard.tsx',
  ],
  packages: ['motion'],
  demo: MarksDemo,
  stageWidth: 1000,
}
