'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState, useSyncExternalStore } from 'react'

import { modulesFor, type ContentBlock, type Method, type Module, type ModuleItem } from './content'

/*
 * What the three approaches share: the stand-in content (the first build's, for a service designer
 * on HMCTS), progress kept in this browser (a prototype; the real build keeps it on the server),
 * the current card, and "Mark as complete" moving on to the next unfinished card.
 */

const KEY = 'katsura:pathway-two'
let done = new Set<string>()
let loaded = false
let snapshot: Set<string> = done
const listeners = new Set<() => void>()
const load = () => {
  if (loaded) return
  loaded = true
  try {
    done = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[])
    snapshot = done
  } catch {
    // storage blocked: start empty
  }
}
const save = (next: Set<string>) => {
  done = next
  snapshot = next
  try {
    localStorage.setItem(KEY, JSON.stringify([...next]))
  } catch {
    // ignore
  }
  listeners.forEach((l) => l())
}
const EMPTY = new Set<string>()
const useDone = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => {
      load()
      return snapshot
    },
    () => EMPTY,
  )

export type Entry = { m: Module; c: ModuleItem; i: number }

export function usePathway() {
  const startParam = useSearchParams().get('m')
  const doneSet = useDone()
  const modules = useMemo(() => modulesFor('service-designer', 'hmcts'), [])
  const all = useMemo(() => modules.flatMap((m) => m.cards.map((c, i) => ({ m, c, i }))), [modules])
  const [pickedId, setPicked] = useState<string | null>(null)
  // ?m=<module> opens that module's first unfinished card (from the landing page)
  const startModule = modules.find((x) => x.id === startParam)
  const isDone = (id: string) => doneSet.has(id)
  const current =
    all.find((e) => e.c.id === pickedId) ??
    (startModule && (all.find((e) => e.m.id === startModule.id && !doneSet.has(e.c.id)) ?? all.find((e) => e.m.id === startModule.id))) ??
    all.find((e) => !doneSet.has(e.c.id)) ??
    all[0]
  const count = all.filter((e) => doneSet.has(e.c.id)).length

  const open = (id: string) => setPicked(id)
  const toggle = (advance = true) => {
    const id = current.c.id
    setPicked(id)
    const next = new Set(doneSet)
    if (next.has(id)) {
      next.delete(id)
      save(next)
      return
    }
    next.add(id)
    save(next)
    // on to the next unfinished card in the module, after this one first
    const cards = current.m.cards
    const after = [...cards.slice(current.i + 1), ...cards.slice(0, current.i)].find((c) => !next.has(c.id))
    const later = after ?? all.find((e) => !next.has(e.c.id))?.c
    if (later && advance) window.setTimeout(() => setPicked(later.id), 450)
  }
  /** The next unfinished card after the current one, for a "Next" link. */
  const nextUp = (() => {
    const cards = current.m.cards
    const c = [...cards.slice(current.i + 1), ...cards.slice(0, current.i)].find((x) => !doneSet.has(x.id))
    return c ?? all.find((e) => !doneSet.has(e.c.id) && e.c.id !== current.c.id)?.c
  })()
  return { modules, all, current, count, total: all.length, isDone, open, toggle, nextUp }
}

export const fillSample = () => {
  const all = modulesFor('service-designer', 'hmcts').flatMap((m) => m.cards)
  save(new Set(all.slice(0, 9).map((c) => c.id)))
}
export const resetSample = () => save(new Set())

/** The approaches being compared: small and quiet, above the page. */
export const APPROACHES = [
  { n: 1, name: 'Two zones', rule: 'One card in two surfaces, as the benefits card and data path: your tasks as small white rows on a warm tint, the card on white. One slate accent.' },
  { n: 2, name: 'Reading room', rule: 'No box. A quiet task list beside the chapter progress track, and each card read like a chapter, ending in a mark that blooms when it is done.' },
  { n: 3, name: 'Paper desk', rule: 'The card is a sheet of paper on a coloured plane; the cards still to read in the module are a stack beneath it, thinning as you go.' },
  { n: 4, name: 'Two zones, Mantine', rule: 'A course page on the Foundations spacing scale: breadcrumbs and the course name in the sub-chapter heading style, a soft green progress ring (Mantine RingProgress), parts that fold away (Mantine Accordion), plain task rows with green ticks, and the card kept in view.' },
] as const

export function Switcher({ n }: { n: number }) {
  return (
    <nav className="p2-switch" aria-label="Approaches">
      <span className="p2-switch__links">
        {APPROACHES.map((a) => (
          <Link key={a.n} href={`/modular?o=${a.n}`} aria-current={a.n === n ? 'page' : undefined}>
            {a.n}. {a.name}
          </Link>
        ))}
      </span>
      <span className="p2-switch__tools">
        <button type="button" onClick={fillSample}>
          Show with some progress
        </button>
        <button type="button" onClick={resetSample}>
          Reset
        </button>
      </span>
      <span className="p2-switch__rule">{APPROACHES[n - 1].rule}</span>
    </nav>
  )
}

// ---------------- the card's words, the same in every approach ----------------

const LABEL = { tool: 'Tool', involve: 'Who to involve', 'best-practice': 'Best practice' } as const

function Block({ block }: { block: ContentBlock }) {
  if (block.type === 'paragraph') return <p>{block.text}</p>
  if (block.type === 'heading') return <h3>{block.text}</h3>
  if (block.type === 'list')
    return (
      <ul>
        {block.items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    )
  return (
    <aside className="p2-aside" data-variant={block.variant}>
      <p className="p2-aside__label">{LABEL[block.variant]}</p>
      <p>{block.body}</p>
      {block.ctaLabel && block.ctaHref && (
        <Link className="p2-aside__link" href={block.ctaHref}>
          {block.ctaLabel}
        </Link>
      )}
    </aside>
  )
}

function MethodBody({ item }: { item: Method }) {
  const list = (xs: string[]) => (
    <ul>
      {xs.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  )
  return (
    <>
      <p>{item.whatItIs}</p>
      <h3>When to use it</h3>
      {list(item.whenToUse)}
      <h3>What you do</h3>
      <ol>
        {item.whatYouDo.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ol>
      <h3>What you produce</h3>
      {list(item.whatYouProduce)}
      <aside className="p2-aside" data-variant="best-practice">
        <p className="p2-aside__label">What good looks like</p>
        {typeof item.whatGoodLooksLike === 'string' ? <p>{item.whatGoodLooksLike}</p> : list(item.whatGoodLooksLike)}
      </aside>
    </>
  )
}

/** A card's words. Each approach styles them through its own class. */
export function Words({ item, className }: { item: ModuleItem; className: string }) {
  return (
    <div className={className}>
      {item.kind === 'method' ? <MethodBody item={item} /> : item.content.map((b, i) => <Block key={i} block={b} />)}
    </div>
  )
}
