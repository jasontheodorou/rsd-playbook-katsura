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
    name: 'Photograph with plane',
    category: 'image',
    description: 'A 2:1 photograph with a pale blue plane one grid gap behind it.',
    whatItDoes:
      'A landscape photograph across columns 2 to 12, with a pale blue plane set one grid gap below and to the right, ending on column 12’s edge. It came from the original build’s offset plane and gives a photograph a frame without a border.',
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
    name: 'Written part with drifting plane',
    category: 'image',
    description: 'A heading with a drawn mark, a 21:9 photograph on a plane that drifts as you scroll, then text.',
    whatItDoes:
      'One part of a chapter’s idea written out: an optional eyebrow, a heading, a wide photograph and body text, on columns 2 to 9. The coloured plane behind the photograph drifts up to 20px as the reader scrolls, and the photograph moves a few pixels the other way. The corner, colour and direction of drift vary from part to part so a page never repeats itself.',
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
    name: 'Pinned photograph with hidden quote',
    category: 'image',
    description: 'A square photograph on a yellow plane that settles into a slight tilt, with a quote behind a tab.',
    whatItDoes:
      'A square photograph on columns 2 to 6, on a yellow plane the same size that settles from 0 to −3 degrees as it scrolls into view. A “Read the quote” tab on its corner slides a yellow quote card out from behind it. The tab pulses until it is first used on that page.',
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
    name: 'Image trio',
    category: 'image',
    description: 'Three portrait photographs that fill with colour and show a label when pointed at.',
    whatItDoes:
      'Three 4:5 photographs in equal cells across columns 2 to 12. Pointing at a cell fills it with yellow, blue or terracotta and shows its label just above the pointer. Thin dividers run only as tall as the photographs.',
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
    description: 'Up to three photographs as tilted prints with handwritten captions.',
    whatItDoes:
      'Square photographs in white print frames, overlapping at slight angles across columns 2 to 9. Pointing at or focusing a print straightens it, lifts it and brings it to the front.',
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
    description: 'Short ideas on cards that pin and fold over one another as you scroll.',
    whatItDoes:
      'Each card pins near the top of the page and the next slides over it, deepening the covered card’s shade slightly. Each card has an eyebrow, a title and a 4:3 photograph. Below 1024px the cards simply stack.',
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
    name: 'Self-building wall',
    category: 'motion',
    description: 'The head, heart and hands sketch, cut into posters and notes that build it on scroll.',
    whatItDoes:
      'The sketch is cut into three posters and seven notes that rebuild it exactly. On first view each poster drops onto its pins in turn, then the notes follow. Pointing at a poster swings it gently from its pins.',
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
    description: 'A flat yellow card holding one quotation, on the reading columns.',
    whatItDoes:
      'A yellow panel with 24px corners on columns 2 to 9, a Georgia speech mark in its first column and the quotation in bold beside it. Adapted from the original build’s tinted quote card, keeping only the yellow tone.',
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
    description: 'A white panel of points that stand apart, with a short accent bar.',
    whatItDoes:
      'A white panel with a hairline edge on columns 2 to 9, a short accent bar at its top left in the chapter’s colour, a small grey label and points with square markers. It also breaks up a long run of paragraphs inside a written part.',
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
    name: 'Fanned sticky notes',
    category: 'motion',
    description: 'Two or three short points as a stack of sticky notes that fans out when pointed at.',
    whatItDoes:
      'Square notes in three shades of the part’s tint, stacked so the top one reads. Pointing at, focusing or choosing the stack fans the notes into a row. On a page’s first stack a yellow speech bubble and a pulse show until it is first opened.',
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
    name: 'Framework marks',
    category: 'editorial',
    description: 'Three small scribbles under a title, saying which part of head, heart and hands a chapter is.',
    whatItDoes:
      'Three 16px scribbles with their names in small spaced capitals. The chapter’s own part is in its colour and the other two are faint grey. It is a quiet flourish, not navigation, and links nowhere.',
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
    name: 'Accordion, quiet outline',
    category: 'interactive',
    description: 'Sections that open and close on faint warm tints.',
    whatItDoes:
      'Tinted rows 4px apart, deeper when open, each with a marker, a title and a small round button that fills when open. All text is in the page, so it reads without JavaScript.',
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
    name: 'T-shaped tabs',
    category: 'interactive',
    description: 'Roles or options side by side in one card, with a drawing or photo for each.',
    whatItDoes:
      'A paper card with a hairline edge, a tinted bar of pill tabs and a sand pill for the chosen one. Each panel has a drawing on watercolour paper that settles from a tilt as it arrives, and text with bold lead-ins. The card stays the height of its tallest panel.',
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
    description: 'A centre idea and five items on a pentagon; choosing one shows its words and photo.',
    whatItDoes:
      'One card in two halves. On the warm tint, five lifted circles on a pentagon around the centre idea; on white, the chosen item’s words with its photograph below. A yellow speech bubble and soft blue pulses show until the first choice on that page.',
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
    description: 'Ideas that move from a failure to good practice, revealing each passage past the middle.',
    whatItDoes:
      'One row per idea with a slider between two ends in the source’s own words. Past the middle a row brightens and shows the full passage, and a count says how many are in balance. A speech bubble and pulses under each handle show until the first move.',
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
    description: 'Five stops rising along a line on a dotted tint; choosing one shows its words on white.',
    whatItDoes:
      'One card split on a grid line. On the tint, five white stops rise like points on a chart over a faint dot grid, each above its label. Choosing a stop fills the line up to it in slate and shows its words on the white half, every state in one cell.',
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
    description: 'The hand-drawn landscape as a map: choose a region and its line rises to its name.',
    whatItDoes:
      'Chapter 04’s signature. Choosing one of five regions fades the rest of the drawing, gives the region a light blue wash, raises its line to its name and shows its text in a yellow box below. Roll call, a yellow speech bubble, cycles through the layer names until the first choice.',
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
    name: 'Voices, the Turntable',
    category: 'interactive',
    description: 'Two people’s quotes, one at a time: sketches on a turning floor, the speaker’s quote beside.',
    whatItDoes:
      'The two sketches stand on a faint turning floor; the one at the front speaks and the other stands back. Moving on turns the floor half a turn, a pen sweep draws the speaker in, and a few of their words are highlighted in yellow. The drawing is the only control.',
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
    description: 'Three photographs side by side; the chosen one opens wide with its words on a frosted card.',
    whatItDoes:
      'Closed photographs sit under a frosted veil with a tag naming them. Pointing at, clicking or focusing one opens it to most of the width over 0.8 seconds and shows a frosted card with its count, name and words. The height never changes.',
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
    description: 'The participation model in 2.5D: four rings with a drawing on each, on a soft yellow wash.',
    whatItDoes:
      'Chapter 06’s signature. Four rings lie one inside the next with a white cut-out drawing on each. Dragging tilts the model a few degrees; clicking a drawing lifts it and pops its step’s name up as a big orange word that floats away.',
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
    description: 'The model’s four steps one at a time, in the T-shaped tabs’ style, each with its drawing.',
    whatItDoes:
      'Pill tabs on a tinted bar, every panel in one grid cell so the height never changes. Each panel has the step’s name, its lead in bold and its text, and a small reminder of its drawing on a white card with a yellow plane behind.',
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
  description: 'One drawn mark per chapter: grey outlines while unread, a solid colour once read.',
  whatItDoes:
    'Each chapter has a mark on a circle. Unread, it is grey outlines on a grey circle; when the chapter is read, a pastel blooms out from the centre and the outline cross-fades into one solid dark colour. At the end of an unread chapter the outline draws itself in as it comes into view.',
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
