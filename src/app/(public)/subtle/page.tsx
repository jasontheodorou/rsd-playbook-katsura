import '../accordions/accordions.css'
import '../different/different.css'
import * as S from './Subtle'
import './subtle.css'

export const metadata = { title: 'Subtle. The RSD Playbook' }

type Idea = { id: string; name: string; page: string; rule: string; demo: React.ReactNode }

const GROUPS: { name: string; intro: string; ideas: Idea[] }[] = [
  {
    name: 'Images',
    intro: 'Quiet ways for a photograph to arrive or respond.',
    ideas: [
      {
        id: 'focus',
        name: 'Arrive in focus',
        page: 'Heart',
        rule: 'The photo comes into view from a soft blur and a touch too large, and settles sharp over a second. Once only.',
        demo: <S.ArriveInFocus />,
      },
      {
        id: 'aperture',
        name: 'Aperture',
        page: 'All three',
        rule: 'The photo opens out from a small circle at its centre, like the chapter marks when a chapter is read. Ties the pages to the grid.',
        demo: <S.Aperture />,
      },
      {
        id: 'pan',
        name: 'Slow pan',
        page: 'Hands',
        rule: 'A wide photo’s crop travels a few per cent sideways as you scroll, like a slow camera move along a journey map.',
        demo: <S.SlowPan />,
      },
      {
        id: 'tilt',
        name: 'Gentle tilt',
        page: 'Heart',
        rule: 'The photo leans up to 3 degrees towards the pointer, as if held, and springs level when the pointer leaves. Mouse only.',
        demo: <S.GentleTilt />,
      },
    ],
  },
  {
    name: 'Text',
    intro: 'Type that arrives with care, without decoration.',
    ideas: [
      {
        id: 'lines',
        name: 'Lines rise',
        page: 'Head',
        rule: 'Each line of the statement slides up out of its own mask, 80ms after the last, as it scrolls into view.',
        demo: <S.LinesRise />,
      },
      {
        id: 'settle',
        name: 'Type settles',
        page: 'Heart',
        rule: 'A heading arrives slightly spaced and soft, and draws its letters together into place.',
        demo: <S.TypeSettles />,
      },
      {
        id: 'glide',
        name: 'Glide',
        page: 'Heart',
        rule: 'Three topics as words. A soft pill glides to the one you point at, and its line eases in beneath. The height never changes.',
        demo: <S.Glide />,
      },
      {
        id: 'preview',
        name: 'Word preview',
        page: 'Heart',
        rule: 'Pointing at a named method floats a small photo of it beside the pointer, trailing it gently. The sentence stays whole.',
        demo: <S.WordPreview />,
      },
    ],
  },
  {
    name: 'Text and image together',
    intro: 'A photograph and its words moving as one.',
    ideas: [
      {
        id: 'travel',
        name: 'Photo travels',
        page: 'Hands',
        rule: 'The four ways we work as a list. Choose one and its photo glides into that row as the row opens, the others easing aside.',
        demo: <S.PhotoTravels />,
      },
      {
        id: 'captions',
        name: 'Scroll captions',
        page: 'Hands',
        rule: 'One photo holds still while the three ways of working pass over it in turn as you scroll, the photo easing back as they go.',
        demo: <S.ScrollCaptions />,
      },
    ],
  },
]

const NUMBER = new Map(GROUPS.flatMap((g) => g.ideas).map((o, i) => [o.id, i + 1]))

/** Ten subtle, Motion-led ideas for chapters 04 to 06. */
export default function SubtlePage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">04</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Subtle</h1>
          <p className="accp-intro__lede">
            Ten quieter ideas for How we think, What we care about and How we deliver. Each moves
            only when you scroll, point or choose, eases to rest without bouncing, and stands still
            for people who ask for less motion.
          </p>
        </header>
        {GROUPS.map((g) => (
          <div key={g.name} className="d-group">
            <h2 className="d-group__name">{g.name}</h2>
            <p className="d-group__intro">{g.intro}</p>
            {g.ideas.map((o) => {
              const n = NUMBER.get(o.id) ?? 0
              return (
                <section key={o.id} className="accp-design" aria-labelledby={`s-${o.id}`}>
                  <div className="accp-design__head">
                    <span className="accp-design__id">{String(n).padStart(2, '0')}</span>
                    <h3 id={`s-${o.id}`} className="accp-design__name">
                      {o.name} <span className="d-for">For {o.page}</span>
                    </h3>
                    <p className="accp-design__rule">{o.rule}</p>
                  </div>
                  <div className="accp-design__demo d-demo">{o.demo}</div>
                </section>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
