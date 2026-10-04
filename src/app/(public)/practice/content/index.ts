import { EXERCISES } from './exercises'
import plan from './myp-demo.json'
import type { DemoAsset, DemoBlock, DemoCard, DemoCourse } from './types'

export type { DemoAsset, DemoBlock, DemoCard, DemoCourse }

/** A course as the pages use it: its slug, its lessons in order and each card's reading time. */
export type Course = DemoCourse & {
  slug: string
  theme: Theme
  lessons: { name: string; cards: DemoCard[] }[]
  minutes: Record<number, number>
}

/**
 * Each course's colour, from the Transform palette, matching its tile on the landing page.
 * accent marks and fills; deep is the dark partner used for text, icons and the main button (AA
 * on white and on tint); tint is the course's pale surface.
 */
export type Theme = {
  accent: string
  deep: string
  tint: string
  wash: { base: string; a: string; b: string; at: string }
}
const THEMES: Record<number, Theme> = {
  // Transform palette only (3 October 2026): course 1 is accent blue #619CBA with navy #213D59;
  // course 2 is accent yellow #F1D46E with primary grey #333333. Tints are those accents mixed with white.
  1: {
    accent: '#619CBA',
    deep: '#213D59',
    tint: '#e5ecec',
    wash: { base: '#eef2f3', a: '#9fb7c4', b: '#d9cfc0', at: '28% 30%, 78% 76%' },
  },
  2: {
    accent: '#F1D46E',
    deep: '#333333',
    tint: '#fbf2d4',
    wash: { base: '#f6f1e6', a: '#e2c98f', b: '#c9b8a6', at: '72% 28%, 24% 78%' },
  },
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/**
 * A card's reading time: its words (blocks and the text inside its assets) at 200 a minute, plus a
 * minute for each interactive. Worked out from the content, never typed in.
 */
const INTERACTIVE = new Set([
  'slider',
  'step',
  'flip',
  'match',
  'spot',
  'before',
  'map',
  'check',
  'choose',
])
const words = (x: unknown): number =>
  typeof x === 'string'
    ? x.split(/\s+/).filter(Boolean).length
    : Array.isArray(x)
      ? x.reduce((t: number, v) => t + words(v), 0)
      : x && typeof x === 'object'
        ? Object.values(x).reduce((t: number, v) => t + words(v), 0)
        : 0
function minutesFor(card: DemoCard) {
  const text = (card.replaceBlocks ? [] : card.blocks).reduce((t, b) => t + words(b.text), 0)
  const assets = card.assets.reduce((t, a) => t + words(a.props), 0)
  const extra = card.assets.filter((a) => INTERACTIVE.has(a.component)).length
  return Math.max(1, Math.round((text + assets) / 200) + extra)
}

/**
 * Changes Jason has made on top of the plan, kept here so myp-demo.json stays an exact copy of it.
 * 3 October 2026: the manifesto's numbering is dropped from its headings in course 1
 * ("1. We Start with Lived Experience" becomes "We Start with Lived Experience"), because it
 * broke the flow across cards.
 */
const unnumber = (card: DemoCard): DemoCard =>
  card.lesson === 'The manifesto'
    ? {
        ...card,
        blocks: card.blocks.map((b) =>
          b.type === 'heading' ? { ...b, text: b.text.replace(/^\d+\.\s+/, '') } : b,
        ),
      }
    : card

/*
 * 3 October 2026: the plan's two photos to commission (course 2, cards 2 and 8) are replaced with
 * the closest photos the playbook already has, at Jason's request. The alt text describes each
 * photo as it is; the plan's brief stays in myp-demo.json for when a photo is commissioned.
 */
const REPLACED: Record<string, { src: string; alt: string }> = {
  '2.2': {
    src: '/photos/worksheet-writing.png',
    alt: 'Close-up of hands holding a pen over a printed worksheet during a conversation.',
  },
  '2.8': {
    src: '/photos/lego-model-held.jpg',
    alt: 'A woman examines a small Lego model while colleagues sit on the floor building behind her.',
  },
}
const withPhotos =
  (courseN: number) =>
  (card: DemoCard): DemoCard => {
    const r = REPLACED[`${courseN}.${card.n}`]
    if (!r) return card
    return {
      ...card,
      assets: card.assets.map((a) =>
        a.component === 'image' ? { ...a, props: { ...a.props, ...r } } : a,
      ),
    }
  }

export const COURSES: Course[] = (plan.courses as DemoCourse[]).map((raw0) => {
  const shorter = (card: DemoCard): DemoCard => ({
    ...card,
    assets: card.assets.map((a) => {
      const props = EXERCISES[`${raw0.n}.${card.n}.${a.component}`]
      return props ? { ...a, props } : a
    }),
  })
  const raw = { ...raw0, cards: raw0.cards.map(withPhotos(raw0.n)).map(shorter) }
  const c = raw.n === 1 ? { ...raw, cards: raw.cards.map(unnumber) } : raw
  const lessons: Course['lessons'] = []
  for (const card of c.cards) {
    const last = lessons.at(-1)
    if (last && last.name === card.lesson) last.cards.push(card)
    else lessons.push({ name: card.lesson, cards: [card] })
  }
  return {
    ...c,
    slug: slugify(c.title),
    theme: THEMES[c.n] ?? THEMES[1],
    lessons,
    minutes: Object.fromEntries(c.cards.map((k) => [k.n, minutesFor(k)])),
  }
})

export const findCourse = (slug: string) => COURSES.find((c) => c.slug === slug)
