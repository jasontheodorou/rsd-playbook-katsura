import type { ReactNode } from 'react'

import type { DemoAsset, DemoCard } from '../content'
import { PHOTOS } from '../content/photos'
import { Asset } from './Asset'
import { PhotoBlock } from './Photos'
import { Inline } from './Inline'
import { PcList } from './Parts'

/** "After M8.4, the end of …": the content ID an asset follows, if it says. */
const after = (a: DemoAsset) => a.placement?.match(/^After (M[\d.]+)/)?.[1]

type Bullet = { cid: string; text: string }
type Section = { heading: string; body: ReactNode[] }

/**
 * A card's words and assets, in the plan's order. Each paragraph and bullet carries its content ID
 * as data-cid (never shown). The look borrows Mantine patterns in the course's colour: a card that
 * lists use Mantine's List with a small coloured marker; a card's opening paragraph is set larger, as a lead. Assets follow their
 * content ID when the plan places them, otherwise they come after the words.
 */
export function CardBody({ card, course }: { card: DemoCard; course: number }) {
  const placed = new Map<string, DemoAsset[]>()
  const rest: DemoAsset[] = []
  for (const a of card.assets) {
    const cid = after(a)
    if (cid) placed.set(cid, [...(placed.get(cid) ?? []), a])
    else rest.push(a)
  }
  // Photos placed on top of the plan (content/photos.ts), after a content ID or after the words.
  const photos = PHOTOS.filter((p) => p.course === course && p.card === card.n)
  const assetsAfter = (cid: string) => [
    ...photos
      .filter((p) => p.after === cid)
      .map((p, k) => <PhotoBlock key={`p-${cid}-${k}`} asset={p.asset} />),
    ...(placed.get(cid) ?? []).map((a) => <Asset key={`a-${cid}-${a.component}`} asset={a} />),
  ]

  const top: ReactNode[] = []
  const sections: Section[] = []
  const into = () => (sections.length ? sections[sections.length - 1].body : top)
  const blocks = card.replaceBlocks ? [] : card.blocks
  let bullets: Bullet[] = []
  const flush = () => {
    if (!bullets.length) return
    const run = bullets
    into().push(
      <PcList
        key={`ul-${run[0].cid}`}
        items={run.map((x) => ({ cid: x.cid, node: <Inline text={x.text} /> }))}
      />,
    )
    bullets = []
    for (const b of run) into().push(...assetsAfter(b.cid))
  }
  blocks.forEach((b, i) => {
    if (b.type === 'bullet') {
      bullets.push(b)
      return
    }
    flush()
    if (b.type === 'heading') sections.push({ heading: b.text, body: [] })
    else {
      const lead = i === 0 && !sections.length
      into().push(
        <p key={b.cid} data-cid={b.cid} className={lead ? 'pc-lead' : undefined}>
          <Inline text={b.text} />
        </p>,
      )
      into().push(...assetsAfter(b.cid))
    }
  })
  flush()

  // Headed points are plain subheadings with their words under them (a Timeline was tried and removed as too busy).
  const body: ReactNode[] = [...top]
  for (const s of sections) body.push(<h3 key={`h-${s.heading}`}>{s.heading}</h3>, ...s.body)
  photos
    .filter((p) => !p.after)
    .forEach((p, k) => body.push(<PhotoBlock key={`p-end-${k}`} asset={p.asset} />))
  rest.forEach((a, i) => body.push(<Asset key={`r-${i}-${a.component}`} asset={a} />))
  return <div className="tz-words cp-words pc-words">{body}</div>
}
