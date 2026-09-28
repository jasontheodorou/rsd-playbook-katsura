import '../accordions/accordions.css'
import '../foundations/[chapter]/page/foundations-chapter.css'
import { GlassBar, MiniWall, ScribbleChip, SegmentedPill, Thread } from './Options'
import './hhhnav.css'

export const metadata = { title: 'Head, heart and hands panel. The RSD Playbook' }

const OPTIONS = [
  {
    id: 'seg',
    name: 'Segmented pill',
    rule: 'One frosted pill under the title: the framework’s name, which goes back to it, and the three parts as segments with their scribbles. This chapter’s segment is lit in its colour.',
    demo: <SegmentedPill />,
  },
  {
    id: 'wall',
    name: 'Mini wall',
    rule: 'The sketch’s three posters as small thumbnails. This chapter’s poster is in colour and lifted, the others are pencil grey. One line of text and a link back.',
    demo: <MiniWall />,
  },
  {
    id: 'thread',
    name: 'Thread',
    rule: 'The three parts as stops on a short line, like a route. This chapter is a filled stop in its colour; the others are open stops you can go to.',
    demo: <Thread />,
  },
  {
    id: 'chip',
    name: 'Scribble chip',
    rule: 'The smallest option: one quiet line with this chapter’s scribble, saying which part this is. The whole chip goes back to the framework.',
    demo: <ScribbleChip />,
  },
  {
    id: 'glass',
    name: 'Glass bar that opens',
    rule: 'A slim frosted bar with the three scribbles. Point at it or choose Explore and it opens to the three posters and their chapters. It takes one line until asked.',
    demo: <GlassBar />,
  },
]

/**
 * Options for a small panel under the title of chapters 04 to 06, saying the chapter is one part
 * of Head, heart and hands and leading back to it. Each is shown under How we think (Head).
 */
export default function HhhNavPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">04</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Head, heart and hands panel</h1>
          <p className="accp-intro__lede">
            Five ways to show, under the title of chapters 4 to 6, that each is one part of Head,
            heart and hands, and to lead back to it. Each is shown on How we think.
          </p>
        </header>
        {OPTIONS.map((o, i) => (
          <section key={o.id} className="accp-design" aria-labelledby={`hn-${o.id}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={`hn-${o.id}`} className="accp-design__name">
                {o.name}
              </h2>
              <p className="accp-design__rule">{o.rule}</p>
            </div>
            <div className="accp-design__demo hn-demo">
              <p className="fc__title hn-demo__title">
                How we think
                <span className="fc__stop" aria-hidden="true" />
              </p>
              <div className="hn-demo__slot">{o.demo}</div>
              <p className="fc__statement hn-demo__statement">
                <span className="fc__statement-lead">
                  Every aspect of the way we live is changing - our economies, our jobs, our
                  communities and our relationships.
                </span>
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
