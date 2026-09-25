'use client'

import { motion, useReducedMotion, useScroll } from 'motion/react'
import { useMemo, useRef, type ReactNode } from 'react'

import { useChapterFrame } from '../ChapterFrame'
import { Accordion } from '../components/Accordion'
import { BodyText } from '../components/BodyText'
import { ImageTrio } from '../components/ImageTrio'
import { PhotoWithPlane } from '../components/PhotoWithPlane'
import { SpacingOverlay, type Space } from '../components/SpacingOverlay'
import { TShapedTabs } from '../components/TShapedTabs'
import type { Block, ChapterContent } from './types'
import './foundations-chapter.css'

/**
 * The Foundations chapter page: the gold standard set by Who we are (25 September 2026), applied
 * to any chapter's content. It owns the frame, the rail, the grid, the title and statement, the
 * placement of every block and every gap, so a new chapter only supplies its words and pictures
 * (see page/types.ts and docs/DESIGN-RULES.md, "Foundations page standard").
 */
export function FoundationsChapter({
  number,
  end,
  content,
  showSpacing = true,
}: {
  number: string
  end: ReactNode
  content: ChapterContent
  /** The temporary spacing overlay, while a page is being designed. */
  showSpacing?: boolean
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const { leaving } = useChapterFrame()
  const spaces = useMemo(() => spacesFor(content.blocks), [content.blocks])

  return (
    <div ref={scrollRef} className="fc">
      {showSpacing && <SpacingOverlay root={scrollRef} spaces={spaces} />}
      <div className="container fc__grid">
        <motion.aside
          className="fc__rail"
          aria-label="Chapter progress"
          initial={reduce ? false : { opacity: 0, x: -16 }}
          animate={
            leaving
              ? { opacity: 0, x: -16, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }
              : {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
                }
          }
        >
          <span className="fc__number">{number}</span>
          <span className="fc__track" aria-hidden="true">
            <motion.span className="fc__fill" style={{ scaleY: scrollYProgress }} />
          </span>
        </motion.aside>

        <motion.article
          className="fc__main"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.65, 0, 0.45, 1], delay: 0.1 }}
        >
          <header className="fc__hero">
            <h1 className="fc__title">
              {content.title}
              <span className="fc__stop" aria-hidden="true" />
            </h1>
            <p className="fc__statement">
              <span className="fc__statement-lead">{content.statement.lead}</span>{' '}
              {content.statement.rest}
            </p>
          </header>

          {content.blocks.map((block, i) => (
            <div key={i} className={`fc__block fc__block--${block.kind}`} data-block={i}>
              <BlockView block={block} />
            </div>
          ))}

          <div className="fc__end">{end}</div>
        </motion.article>
      </div>
    </div>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'text':
      return (
        <BodyText>
          {block.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </BodyText>
      )
    case 'photo':
      return <PhotoWithPlane src={block.src} alt={block.alt} />
    case 'accordion':
      return <Accordion sections={block.sections} />
    case 'trio':
      return <ImageTrio items={block.items} />
    case 'tabs':
      return <TShapedTabs roles={block.roles} />
  }
}

/* ── The spacing overlay's gaps, generated from the blocks so every chapter can be checked ── */

/** What each block's visible top and bottom are, for measuring. */
function edges(block: Block, i: number): { top: string; bottom: string } {
  const b = `[data-block="${i}"]`
  switch (block.kind) {
    case 'text':
      return { top: `${b} .body-text > p:first-child`, bottom: `${b} .body-text > p:last-child` }
    case 'photo':
      return { top: `${b} .pwp__img`, bottom: `${b} .pwp__plane` }
    case 'accordion':
      return { top: `${b} .qacc__row:first-child`, bottom: `${b} .qacc__row:last-child` }
    case 'trio':
      return { top: `${b} .trio__img`, bottom: `${b} .trio__img` }
    case 'tabs':
      return { top: `${b} .tst`, bottom: `${b} .tst` }
  }
}

const NAMES: Record<Block['kind'], string> = {
  text: 'body text',
  photo: 'photograph',
  accordion: 'accordion',
  trio: 'image trio',
  tabs: 'tabs',
}

function spacesFor(blocks: Block[]): Space[] {
  const out: Space[] = []
  let v = 0
  const add = (label: string, from: string, to: string) =>
    out.push({
      id: `V${++v}`,
      label,
      from,
      fromEdge: 'bottom',
      to,
      toEdge: 'top',
      span: '.fc__main',
    })

  out.push({
    id: `V${++v}`,
    label: 'Top of page to title',
    from: '.fc__grid',
    fromEdge: 'top',
    to: '.fc__title',
    toEdge: 'top',
    span: '.fc__main',
  })
  add('Title to statement', '.fc__title', '.fc__statement')

  let prev = { bottom: '.fc__statement', name: 'statement' }
  blocks.forEach((block, i) => {
    const e = edges(block, i)
    add(`${prev.name} to ${NAMES[block.kind]}`, prev.bottom, e.top)
    if (block.kind === 'text') {
      for (let p = 1; p < block.paragraphs.length; p++) {
        add(
          'Paragraph to paragraph',
          `[data-block="${i}"] .body-text > p:nth-child(${p})`,
          `[data-block="${i}"] .body-text > p:nth-child(${p + 1})`,
        )
      }
    }
    if (block.kind === 'photo') {
      out.push({
        id: `V${++v}`,
        label: 'Photograph to its plane',
        from: e.top,
        fromEdge: 'bottom',
        to: e.bottom,
        toEdge: 'bottom',
        span: e.bottom,
      })
    }
    prev = { bottom: e.bottom, name: NAMES[block.kind] }
  })
  add(`${prev.name} to chapter end`, prev.bottom, '.chapter-end')

  out.push(
    {
      id: 'H1',
      label: 'Window edge to rail',
      from: '.fc__grid',
      fromEdge: 'left',
      to: '.fc__number',
      toEdge: 'left',
      span: '.fc__number',
    },
    {
      id: 'H2',
      label: 'Rail to content',
      from: '.fc__number',
      fromEdge: 'right',
      to: '.fc__title',
      toEdge: 'left',
      span: '.fc__number',
    },
  )
  return out
}
