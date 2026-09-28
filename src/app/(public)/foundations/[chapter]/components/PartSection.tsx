import type { ReactNode } from 'react'

import { Accordion } from './Accordion'
import { BodyText } from './BodyText'
import { Boxout } from './Boxout'
import { NoteFan, type FanNote } from './NoteFan'
import { PartMedia, type Drift } from './PartMedia'
import './part-section.css'

/**
 * A part of a chapter's idea, written out: a small eyebrow naming the part, its heading, a wide
 * photograph on the original build's offset plane (a flat colour one grid gap behind it), then body text with an optional list. One column, on content columns 1 to 8 like
 * body text, so it reads straight down the page.
 */
export type PlaneTone = 'paleblue' | 'terracotta' | 'blue' | 'yellow' | 'grey'

export function PartSection({
  eyebrow,
  heading,
  photo,
  alt,
  paragraphs,
  list,
  boxout,
  fan,
  items,
  plane = 'paleblue',
  side = 'tl',
  drift,
  accent,
  mark,
}: {
  /** A small label above the heading. Optional: a drawn mark can do its job. */
  eyebrow?: string
  heading: string
  photo: string
  alt: string
  paragraphs: ReactNode[]
  list?: ReactNode[]
  /** A boxout of points set between the paragraphs, after the paragraph numbered `after`. */
  boxout?: { after: number; items: string[]; accent?: string }
  /** Up to three short points as a fanned stack of sticky notes, after the text. */
  fan?: { label: string; notes: FanNote[]; tints?: string[] }
  /** A short list as a small accordion after the text: each item's lead-in as its title. */
  items?: { title: string; body: ReactNode }[]
  /** The offset plane's colour, from the original build's plane tones. */
  plane?: PlaneTone
  /** Which corner the plane shows at: top-left, bottom-right or bottom-left. Vary them down the page. */
  side?: 'tl' | 'br' | 'bl'
  /** Which way the plane drifts as the reader scrolls. Vary it too. */
  drift?: Drift
  /** The part's own colour, for its eyebrow (dark enough for small text). */
  accent?: string
  /** A small drawn mark set beside the heading, such as the part's scribble from a sketch. */
  mark?: string
}) {
  return (
    <section className="part">
      {eyebrow && (
        <p className="part__eyebrow" style={accent ? { color: accent } : undefined}>
          {eyebrow}
        </p>
      )}
      <h2 className="part__heading">
        {heading}
        {mark && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="part__mark" src={mark} alt="" aria-hidden="true" />
        )}
      </h2>
      <PartMedia photo={photo} alt={alt} plane={plane} side={side} drift={drift} />
      {boxout ? (
        <>
          <BodyText>
            {paragraphs.slice(0, boxout.after).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </BodyText>
          <div className="part__boxout">
            <Boxout items={boxout.items} accent={boxout.accent} />
          </div>
          <BodyText>
            {paragraphs.slice(boxout.after).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {list && (
              <ul className="body-text__list">
                {list.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            )}
          </BodyText>
        </>
      ) : (
        <BodyText>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {list && (
            <ul className="body-text__list">
              {list.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          )}
        </BodyText>
      )}
      {fan && (
        <div className="part__fan">
          <NoteFan label={fan.label} notes={fan.notes} accent={accent} tints={fan.tints} />
        </div>
      )}
      {items && (
        <Accordion
          small
          className="part__items"
          sections={items.map((it, i) => ({
            id: String(i),
            title: it.title,
            body: <p>{it.body}</p>,
          }))}
        />
      )}
    </section>
  )
}
