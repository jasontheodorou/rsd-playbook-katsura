/**
 * The MYP demo plan's types, copied from the manual explorer (`src/myp-demo/types.ts`, 3 October
 * 2026). `myp-demo.json` is that app's `myp-demo/plan.json`, copied unchanged: it holds every
 * card's text with the agreed edits applied, and the data for every asset.
 */

export type DemoBlock =
  { type: 'heading'; text: string } | { type: 'paragraph' | 'bullet'; cid: string; text: string }

export type DemoAsset = {
  component: string
  new?: boolean
  props: Record<string, unknown>
  acceptance?: string[]
  placement?: string
}

export type DemoCard = {
  n: number
  id: string
  lesson: string
  title: string
  contentIds: string[]
  blocks: DemoBlock[]
  assets: DemoAsset[]
  replaceBlocks?: boolean
}

export type DemoCourse = {
  n: number
  title: string
  summary: string
  summaryNew?: boolean
  cards: DemoCard[]
}
