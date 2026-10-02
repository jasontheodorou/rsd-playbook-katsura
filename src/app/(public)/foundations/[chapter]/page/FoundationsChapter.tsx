'use client'

import { motion, useReducedMotion, useScroll } from 'motion/react'
import { useMemo, useRef, type ReactNode } from 'react'

import { useChapterFrame } from '../ChapterFrame'
import { Accordion } from '../components/Accordion'
import { Balance } from '../components/Balance'
import { BodyText } from '../components/BodyText'
import { Boxout } from '../components/Boxout'
import { DataPath } from '../components/DataPath'
import { DesignLandscape } from '../components/DesignLandscape'
import { Landscape3D } from '../components/landscape-3d/Landscape3D'
import { Participation } from '../components/participation/Participation'
import { ParticipationSteps } from '../components/participation/ParticipationSteps'
import { Polaroids } from '../components/Polaroids'
import { Diagram } from '../components/Diagram'
import { FrameworkPill } from '../components/FrameworkPill'
import { HhhWall } from '../components/HhhWall'
import { ImageTrio } from '../components/ImageTrio'
import { Journey } from '../components/Journey'
import { PartSection } from '../components/PartSection'
import { BenefitsCard } from '../components/BenefitsCard'
import { PhotoWithPlane } from '../components/PhotoWithPlane'
import { PinnedPhoto } from '../components/PinnedPhoto'
import { QuoteCard } from '../components/QuoteCard'
import { SpacingOverlay, type Space } from '../components/SpacingOverlay'
import { StackCards } from '../components/StackCards'
import { Stories } from '../components/Stories'
import { TShapedTabs } from '../components/TShapedTabs'
import { Voices } from '../components/Voices'
import { ChapterScrollContext } from './scroll-context'
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
  const firstFan = content.blocks.findIndex((b) => b.kind === 'part' && Boolean(b.fan))
  const scrollRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const { leaving } = useChapterFrame()
  const spaces = useMemo(
    () => spacesFor(content.blocks, Boolean(content.statement), Boolean(content.framework)),
    [content.blocks, content.statement, content.framework],
  )

  return (
    <ChapterScrollContext.Provider value={scrollRef}>
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
              {content.framework && (
                <div className="fc__framework">
                  <FrameworkPill part={content.framework} />
                </div>
              )}
              {content.statement && (
                <p className="fc__statement">
                  <span className="fc__statement-lead">{content.statement.lead}</span>
                  {content.statement.rest && <> {content.statement.rest}</>}
                </p>
              )}
            </header>

            {content.blocks.map((block, i) => (
              <div key={i} className={`fc__block fc__block--${block.kind}`} data-block={i}>
                <BlockView block={block} firstFan={i === firstFan} />
              </div>
            ))}

            <div className="fc__end">{end}</div>
          </motion.article>
        </div>
      </div>
    </ChapterScrollContext.Provider>
  )
}

/** Only the page's first sticky-note stack carries the prompt and pulse. */
const FAN_PROMPT = 'Expand the sticky notes'

function BlockView({ block, firstFan = false }: { block: Block; firstFan?: boolean }) {
  switch (block.kind) {
    case 'text':
      return (
        <BodyText>
          {block.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {block.list && (
            <ul className="body-text__list">
              {block.list.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          )}
        </BodyText>
      )
    case 'photo':
      return <PhotoWithPlane src={block.src} alt={block.alt} />
    case 'accordion':
      return <Accordion sections={block.sections} />
    case 'trio':
      return <ImageTrio items={block.items} />
    case 'tabs':
      return <TShapedTabs roles={block.roles} look={block.art} />
    case 'diagram':
      if (block.items.some((it) => it.photo))
        return (
          <BenefitsCard
            prompt={block.title}
            hub={block.hub}
            label={block.label}
            restTitle={block.emptyTitle}
            restBody={block.emptyBody}
            items={block.items}
            restPhoto={block.restPhoto}
            restAlt={block.restAlt}
          />
        )
      return (
        <Diagram
          look="refined"
          hub={block.hub}
          label={block.label}
          emptyTitle={block.emptyTitle}
          emptyBody={block.emptyBody}
          items={block.items}
          washes={block.washes}
        />
      )
    case 'balance':
      return <Balance prompt={block.prompt} items={block.items} look="quiet" />
    case 'boxout':
      return <Boxout label={block.label} items={block.items} accent={block.accent} />
    case 'pinned':
      return <PinnedPhoto src={block.src} alt={block.alt} quote={block.quote} />
    case 'quote':
      return <QuoteCard text={block.text} attribution={block.attribution} />
    case 'illustration':
      // eslint-disable-next-line @next/next/no-img-element
      return <img className="fc__illustration" src={block.src} alt={block.alt} />
    case 'hhhWall':
      return <HhhWall alt={block.alt} />
    case 'voices':
      return (
        <Voices
          look={block.look ?? 'turntable'}
          flourish={block.flourish ?? ['sketch', 'highlight']}
          voices={block.voices}
          bar
        />
      )
    case 'stories':
      return <Stories look="panels" label={block.label} stories={block.stories} prompt={block.prompt} bar />
    case 'participation':
      return <Participation prompt={block.prompt} lead={block.lead} steps={block.steps} />
    case 'participationSteps':
      return <ParticipationSteps label={block.label} steps={block.steps} />
    case 'journey':
      return (
        <Journey
          title={block.title}
          label={block.label}
          restTitle={block.restTitle}
          restBody={block.restBody}
          steps={block.steps}
        />
      )
    case 'landscape':
      return (
        <DesignLandscape
          title={block.title}
          label={block.label}
          restTitle={block.restTitle}
          restBody={block.restBody}
          layers={block.layers}
          washes={block.washes}
        />
      )
    case 'polaroids':
      return <Polaroids prints={block.prints} />
    case 'landscapeMap':
      return (
        <Landscape3D
          prompt={block.prompt}
          label={block.label}
          restTitle={block.restTitle}
          restBody={block.restBody}
          layers={block.layers}
        />
      )
    case 'dataPath':
      return (
        <DataPath
          prompt={block.prompt}
          label={block.label}
          restTitle={block.restTitle}
          restBody={block.restBody}
          items={block.items}
        />
      )
    case 'stack':
      return <StackCards cards={block.cards} />
    case 'part':
      return (
        <PartSection
          eyebrow={block.eyebrow}
          heading={block.heading}
          lead={block.lead}
          photo={block.photo}
          alt={block.alt}
          paragraphs={block.paragraphs}
          list={block.list}
          boxout={block.boxout}
          fan={
            block.fan && {
              ...block.fan,
              prompt: firstFan ? (block.fan.prompt ?? FAN_PROMPT) : undefined,
            }
          }
          items={block.items}
          plane={block.plane}
          side={block.side}
          drift={block.drift}
          accent={block.accent}
          mark={block.mark}
        />
      )
  }
}

/* ── The spacing overlay's gaps, generated from the blocks so every chapter can be checked ── */

/** What each block's visible top and bottom are, for measuring. */
function edges(block: Block, i: number): { top: string; bottom: string } {
  const b = `[data-block="${i}"]`
  switch (block.kind) {
    case 'text':
      return { top: `${b} .body-text > :first-child`, bottom: `${b} .body-text > :last-child` }
    case 'photo':
      return { top: `${b} .pwp__img`, bottom: `${b} .pwp__plane` }
    case 'accordion':
      return { top: `${b} .qacc__row:first-child`, bottom: `${b} .qacc__row:last-child` }
    case 'trio':
      return { top: `${b} .trio__img`, bottom: `${b} .trio__img` }
    case 'tabs':
      return { top: `${b} .tst`, bottom: `${b} .tst` }
    case 'diagram':
      return { top: `${b} .bd, ${b} .bc`, bottom: `${b} .bd, ${b} .bc` }
    case 'boxout':
      return { top: `${b} .boxout`, bottom: `${b} .boxout` }
    case 'balance':
      return { top: `${b} .sl2`, bottom: `${b} .sl2` }
    case 'pinned':
      return { top: `${b} .pin__img`, bottom: `${b} .pin__img` }
    case 'quote':
      return { top: `${b} .qcard`, bottom: `${b} .qcard` }
    case 'illustration':
      return { top: `${b} .fc__illustration`, bottom: `${b} .fc__illustration` }
    case 'hhhWall':
      return { top: `${b} .hxw`, bottom: `${b} .hxw` }
    case 'landscape':
      return { top: `${b} .dl`, bottom: `${b} .dl` }
    case 'landscapeMap':
      return { top: `${b} .lm-stage`, bottom: `${b} .lm-text` }
    case 'polaroids':
      return { top: `${b} .pol`, bottom: `${b} .pol` }
    case 'voices':
      return { top: `${b} .qv`, bottom: `${b} .qv` }
    case 'stories':
      return { top: `${b} .st`, bottom: `${b} .st` }
    case 'journey':
      return { top: `${b} .jy`, bottom: `${b} .jy` }
    case 'participation':
      return { top: `${b} .pm-stage`, bottom: `${b} .pm-stage` }
    case 'participationSteps':
      return { top: `${b} .pm-tabs`, bottom: `${b} .pm-tabs` }
    case 'dataPath':
      return { top: `${b} .dpn`, bottom: `${b} .dpn` }
    case 'stack':
      return { top: `${b} .stk__card:first-child`, bottom: `${b} .stk__card:last-child` }
    case 'part':
      return { top: `${b} .part > :first-child`, bottom: `${b} .part > :last-child` }
  }
}

const NAMES: Record<Block['kind'], string> = {
  text: 'body text',
  photo: 'photograph',
  accordion: 'accordion',
  trio: 'image trio',
  tabs: 'tabs',
  quote: 'quote card',
  pinned: 'pinned photo',
  diagram: 'diagram',
  boxout: 'boxout',
  balance: 'balance',
  illustration: 'illustration',
  hhhWall: 'head, heart and hands wall',
  landscape: 'design landscape',
  landscapeMap: 'design landscape map',
  polaroids: 'polaroids',
  voices: 'voices',
  stories: 'story panels',
  journey: 'journey',
  participation: 'participation model',
  participationSteps: 'participation steps',
  dataPath: 'data path',
  stack: 'stacking cards',
  part: 'written part',
}

function spacesFor(blocks: Block[], hasStatement: boolean, hasFramework = false): Space[] {
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
  let prev = { bottom: '.fc__title', name: 'title' }
  if (hasFramework) {
    add('Title to framework pill', '.fc__title', '.fwp')
    prev = { bottom: '.fwp', name: 'framework pill' }
  }
  if (hasStatement) {
    add(
      `${prev.name === 'title' ? 'Title' : 'Framework pill'} to statement`,
      prev.bottom,
      '.fc__statement',
    )
    prev = { bottom: '.fc__statement', name: 'statement' }
  }
  blocks.forEach((block, i) => {
    const e = edges(block, i)
    add(`${prev.name} to ${NAMES[block.kind]}`, prev.bottom, e.top)
    if (block.kind === 'part' && block.boxout) {
      // A boxout splits the part's text in two; pair paragraphs only within each half.
      const halves = [
        { sel: '.part > .body-text:first-of-type', count: block.boxout.after },
        {
          sel: '.part > .body-text:last-of-type',
          count: block.paragraphs.length - block.boxout.after,
        },
      ]
      for (const h of halves)
        for (let p = 1; p < h.count; p++)
          add(
            'Paragraph to paragraph',
            `[data-block="${i}"] ${h.sel} > p:nth-child(${p})`,
            `[data-block="${i}"] ${h.sel} > p:nth-child(${p + 1})`,
          )
    } else if (block.kind === 'text' || block.kind === 'part') {
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
