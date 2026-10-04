import { BookOpenText, Lightbulb } from '@phosphor-icons/react/dist/ssr'

import { Inline } from './Inline'

/** Top tip: Mantine's Blockquote pattern (a coloured rule and an icon on its edge), as an aside, in the course's colour. */
export function Tip({ text }: { text: string }) {
  return (
    <aside className="pc-box pc-tip" aria-label="Top tip">
      <span className="pc-box__icon" aria-hidden>
        <Lightbulb size={20} weight="duotone" />
      </span>
      <p className="pc-box__label">Top tip</p>
      <p className="pc-box__text">
        <Inline text={text} />
      </p>
    </aside>
  )
}

/** Useful resource: Mantine's card-with-icon pattern, the source as a badge and the title as the link. */
export function Resource({
  title,
  url,
  summary,
  source,
}: {
  title: string
  url: string
  summary: string
  source: string
}) {
  return (
    <aside className="pc-box pc-resource" aria-label="Useful resource">
      <span className="pc-resource__icon" aria-hidden>
        <BookOpenText size={22} weight="duotone" />
      </span>
      <div className="pc-resource__body">
        <p className="pc-box__label">Useful resource</p>
        <p className="pc-resource__title">
          <a href={url}>{title}</a>
        </p>
        <p className="pc-box__text">{summary}</p>
        <p className="pc-resource__source">{source}</p>
      </div>
    </aside>
  )
}

/**
 * An image. No photo in the playbook fits either brief in the demo (a researcher in someone's home;
 * residents and staff at one table), so each shows a placeholder with its brief, to be commissioned.
 * The alt text is the plan's, given to the placeholder so screen readers hear the intended picture.
 */
export function Figure({
  kind,
  brief,
  alt,
  caption,
  src,
}: {
  kind: 'photo' | 'diagram'
  brief: string
  alt: string
  caption?: string
  src?: string
}) {
  return (
    <figure className="pc-figure">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} />
      ) : (
        <div className="pc-figure__placeholder" role="img" aria-label={alt}>
          <span>
            {kind === 'photo' ? 'Photo to commission' : 'Diagram to draw'}: {brief}
          </span>
        </div>
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
