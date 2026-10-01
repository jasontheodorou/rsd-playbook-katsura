import '../accordions/accordions.css'
import '../refine/refine.css'
import { Stories, type Story, type StoriesLook } from '../foundations/[chapter]/components/Stories'

export const metadata = { title: 'Three ways to tell stories. The RSD Playbook' }

/*
 * Four ways to replace the fanned sticky notes in "How our designers tell stories" (How we tell
 * stories, chapter 05) with a component that holds the full width, its words on or beside a
 * photograph for each way (1 October 2026). The words are the chapter's three notes. The
 * photographs are a first pick from public/photos, for sign-off.
 */

const STORIES: Story[] = [
  {
    label: 'Storytelling',
    text: 'Helping teams “zoom in” on human detail and “zoom out” to see the big picture.',
    photo: '/photos/three-way-conversation.png',
    alt: 'Three people talking around a table, one of them explaining with her hands.',
  },
  {
    label: 'Visualisation & storytelling',
    text: 'Using narratives, maps, personas and prototypes to make abstract concepts tangible and persuadable.',
    photo: '/photos/lego-show-and-tell.png',
    alt: 'Two people at a workshop, one holding up a small Lego model while the other talks.',
  },
  {
    label: 'Visual storytelling',
    text: 'Translating research into artefacts that visualise how people interact with services, the moments of delight and the barriers they face.',
    photo: '/photos/insight-wall-sticky.png',
    alt: 'A man leaning in to add a sticky note to a wall of research notes.',
  },
]

const OPTIONS: { look: StoriesLook; name: string; rule: string }[] = [
  {
    look: 'panels',
    name: 'Panels',
    rule: 'Three photographs side by side. Pointing at one opens it wide, and its words appear on a frosted card over it.',
  },
  {
    look: 'split',
    name: 'Photo and list',
    rule: 'One card: a large photograph on the left, the three ways listed on the right. Choosing one changes the photograph and the words.',
  },
  {
    look: 'scroll',
    name: 'Scroll story',
    rule: 'The three ways scroll past on the left while the photograph holds still on the right and changes as each one reaches the middle.',
  },
  {
    look: 'hero',
    name: 'Wide photograph',
    rule: 'One wide photograph with its words on a frosted card. The three ways are thumbnails in the corner; choosing one changes the photograph.',
  },
]

/** Four versions of a full-width component for the three ways our designers tell stories. */
export default function StoriesPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">05</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Three ways to tell stories</h1>
          <p className="accp-intro__lede">
            Four ways to replace the sticky notes in “How our designers tell stories” with a component
            that holds the full width. Each way has its own photograph, with its words on it or beside it.
          </p>
        </header>
        {OPTIONS.map((o, i) => (
          <section key={o.look} className="accp-design" aria-labelledby={`st-${o.look}`}>
            <div className="accp-design__head">
              <span className="accp-design__id">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={`st-${o.look}`} className="accp-design__name">
                {o.name}
              </h2>
              <p className="accp-design__rule">{o.rule}</p>
            </div>
            <div className="accp-design__demo rf-demo">
              <Stories look={o.look} label="Three ways our designers tell stories" stories={STORIES} />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
