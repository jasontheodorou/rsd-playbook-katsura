type Tone = 'yellow' | 'terracotta' | 'paleblue' | 'warmgrey' | 'blue'

/** Quote card with a Georgia speech-mark corner and a tinted plane background. Ported from the reference build. */
export function QuoteCard({
  text,
  attribution,
  tone = 'yellow',
}: {
  text: string
  attribution?: string
  tone?: Tone
}) {
  return (
    <div className={`p1v2__qcard p1v2__qcard--${tone}`}>
      <span className="p1v2__qcard-mark" aria-hidden="true">
        &ldquo;
      </span>
      <p className="p1v2__qcard-text">{text}</p>
      {attribution && <span className="p1v2__qcard-attribution">{attribution}</span>}
    </div>
  )
}
