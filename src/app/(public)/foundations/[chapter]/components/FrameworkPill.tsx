import './framework-pill.css'

/**
 * The Head, heart and hands mark under the title of chapters 04 to 06: a quiet design flourish,
 * not navigation. Three small scribbles with their names, this chapter's in its colour and the
 * other two faint, so the reader sees at a glance which part of the framework they are in. It
 * links nowhere. Screen readers hear one short description.
 */
export type FrameworkPart = 'head' | 'heart' | 'hands'

const PARTS: { id: FrameworkPart; name: string; colour: string }[] = [
  { id: 'head', name: 'Head', colour: '#a94c00' },
  { id: 'heart', name: 'Heart', colour: '#c4121f' },
  { id: 'hands', name: 'Hands', colour: '#a61448' },
]

export function FrameworkPill({ part }: { part: FrameworkPart }) {
  const current = PARTS.find((p) => p.id === part)!
  return (
    <p className="fwp" role="img" aria-label={`${current.name}, one part of Head, heart and hands`}>
      {PARTS.map((p) => {
        const on = p.id === part
        return (
          <span
            key={p.id}
            className="fwp__part"
            data-on={on}
            style={on ? { color: p.colour } : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/illustrations/hhh/${p.id}-scribble.png`} alt="" />
            {p.name}
          </span>
        )
      })}
    </p>
  )
}
